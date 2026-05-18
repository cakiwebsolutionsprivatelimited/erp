import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Sale {
  id: string;
  name: string;
  email: string;
  amount: string;
  image?: string;
}

export const RecentSales: React.FC<{ sales: Sale[] }> = ({ sales }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border">
                {sale.image ? (
                  <img src={sale.image} alt={sale.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{sale.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">{sale.name}</p>
                <p className="text-xs text-muted-foreground">{sale.email}</p>
              </div>
              <div className="font-bold text-emerald-600">+{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
