import * as XLSX from 'xlsx';

export type ReportRow = Record<string, string | number>;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(filename: string, sheetName: string, rows: ReportRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!rtl'] = true;
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(filename: string, rows: ReportRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  // BOM so Excel opens UTF-8 Hebrew text correctly
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Opens a printable RTL HTML report in a new tab and triggers the browser
 * print dialog, where the user can "Save as PDF". This renders Hebrew
 * correctly (unlike jsPDF's built-in fonts, which lack Hebrew glyphs).
 */
export function exportToPDF(title: string, rows: ReportRow[]) {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]);
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const tableRows = rows
    .map((row) => `<tr>${columns.map((col) => `<td>${row[col] ?? ''}</td>`).join('')}</tr>`)
    .join('');

  printWindow.document.write(`
    <!doctype html>
    <html lang="he" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body { font-family: 'Assistant', 'Heebo', Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p.meta { color: #6b7280; font-size: 12px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: center; }
          th { background: #f3f4f6; font-weight: 700; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="meta">מערך הכושר הפלוגתי · הופק בתאריך ${new Date().toLocaleDateString('he-IL')}</p>
        <table>
          <thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
