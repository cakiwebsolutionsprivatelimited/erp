import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText,
  PackagePlus,
  BarChart3
} from 'lucide-react';

const actions = [
  { label: 'Create Invoice', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Add Product', icon: PackagePlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Invite User', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'Run Report', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export const QuickActions: React.FC = () => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button 
              key={action.label} 
              variant="outline" 
              className="h-auto flex-col gap-3 py-6 hover:bg-muted/50 border-dashed"
            >
              <div className={`p-3 rounded-2xl ${action.bg} ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-semibold">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
