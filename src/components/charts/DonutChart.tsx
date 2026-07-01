import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function DonutChart({ data, height = 220 }: { data: DonutDatum[]; height?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div style={{ width: '100%', height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ direction: 'rtl', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            formatter={(value, name) => [`${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{total}</span>
        <span className="text-xs text-gray-400">סה"כ</span>
      </div>
    </div>
  );
}
