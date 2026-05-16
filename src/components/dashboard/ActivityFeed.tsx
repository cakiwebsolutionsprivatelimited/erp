import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';
import { 
  UserPlus, 
  ShoppingBag, 
  MessageSquare, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'order' | 'comment' | 'alert';
  title: string;
  time: string;
  status?: string;
}

const iconMap = {
  user: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  order: { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  comment: { icon: MessageSquare, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  alert: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  return (
    <Card className="col-span-1 border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Activity Timeline</CardTitle>
        <Clock className="text-muted-foreground" size={18} />
      </CardHeader>
      <CardContent>
        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
          {activities.map((item) => {
            const { icon: Icon, color, bg } = iconMap[item.type];
            return (
              <div key={item.id} className="relative flex gap-4 pl-0">
                <div className={cn("z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow-sm", bg, color)}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  {item.status && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 font-bold uppercase tracking-wider">
                      {item.status}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
