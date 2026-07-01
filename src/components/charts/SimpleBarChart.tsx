import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface BarDatum {
  name: string;
  value: number;
}

export function SimpleBarChart({ data, color = '#6366f1', height = 240, unit = '' }: { data: BarDatum[]; color?: string; height?: number; unit?: string }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ direction: 'rtl', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            formatter={(value) => [`${value}${unit}`, '']}
          />
          <Bar dataKey="value" fill={color} radius={[8, 8, 8, 8]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
