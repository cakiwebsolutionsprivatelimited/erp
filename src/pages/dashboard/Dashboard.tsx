import React from 'react';
import { PageContainer, SectionHeader } from '@/components/common/PageLayout';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$128,430', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Active Users', value: '2,420', change: '+18.2%', trend: 'up', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'New Leads', value: '145', change: '-4.3%', trend: 'down', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Growth Rate', value: '24.8%', change: '+5.4%', trend: 'up', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Dashboard Overview" 
        description="Welcome back! Here's what's happening with your business today."
        action={
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Download Report
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-background border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-3 rounded-xl " + stat.color}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 bg-background border rounded-2xl h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
          <p>Main Chart Placeholder (Revenue Analytics)</p>
        </div>
        <div className="p-6 bg-background border rounded-2xl h-[400px] flex flex-col">
          <h4 className="font-bold mb-4">Recent Activity</h4>
          <div className="flex-1 border-dashed border rounded-xl flex items-center justify-center text-muted-foreground">
            <p>Activity Feed Placeholder</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
