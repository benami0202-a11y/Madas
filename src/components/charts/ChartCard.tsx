import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export function ChartCard({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      {children}
    </Card>
  );
}
