import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface LineDatum {
  name: string;
  value: number;
}

export function SimpleLineChart({ data, color = '#6366f1', height = 240, unit = '' }: { data: LineDatum[]; color?: string; height?: number; unit?: string }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ direction: 'rtl', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            formatter={(value) => [`${value}${unit}`, '']}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
