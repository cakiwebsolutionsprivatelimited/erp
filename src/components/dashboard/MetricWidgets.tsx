import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@radix-ui/react-progress';
import { cn } from '@/utils';

interface MetricProps {
  label: string;
  value: number;
  total: number;
  color?: string;
}

const ProgressBar = ({ value, total, color }: MetricProps) => {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground">{percentage.toFixed(0)}% Complete</span>
        <span>{value}/{total}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 rounded-full", color || "bg-primary")} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CRMMetrics: React.FC = () => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Sales Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Leads Qualified</p>
          <ProgressBar value={45} total={100} color="bg-blue-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Proposals Sent</p>
          <ProgressBar value={12} total={30} color="bg-violet-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Deals Closed</p>
          <ProgressBar value={8} total={15} color="bg-emerald-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export const InventoryMetrics: React.FC = () => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Stock Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-tight">Low Stock Alert</p>
            <p className="text-lg font-bold">12 Items</p>
          </div>
          <div className="h-2 w-24 bg-rose-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 w-[20%]" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-tight">In Stock</p>
            <p className="text-lg font-bold">1,240 Items</p>
          </div>
          <div className="h-2 w-24 bg-emerald-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[85%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
