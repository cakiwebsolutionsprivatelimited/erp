import React from 'react';
import { PageContainer, SectionHeader } from '@/components/common/PageLayout';
import { 
  StatCard, 
  KPIGrid, 
  ActivityFeed, 
  RecentSales, 
  RevenueAreaChart, 
  UserEngagementBarChart,
  QuickActions,
  CRMMetrics,
  InventoryMetrics
} from '@/components/dashboard';
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const activities = [
  { id: '1', type: 'order' as const, title: 'New order received #4023', time: '2 mins ago', status: 'Processing' },
  { id: '2', type: 'user' as const, title: 'New user registered', time: '1 hour ago' },
  { id: '3', type: 'alert' as const, title: 'Server storage at 90%', time: '3 hours ago', status: 'Critical' },
  { id: '4', type: 'comment' as const, title: 'New feedback from Alice', time: '5 hours ago' },
];

const sales = [
  { id: '1', name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '$1,999.00' },
  { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '$39.00' },
  { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '$299.00' },
  { id: '4', name: 'William Kim', email: 'will@email.com', amount: '$99.00' },
  { id: '5', name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '$39.00' },
];

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Enterprise Dashboard" 
        description="Real-time overview of your business metrics and operations."
        action={
          <Button variant="outline" className="shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        }
      />

      <KPIGrid>
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          trend="up" 
          trendValue="+20.1%" 
          description="from last month" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Active Users" 
          value="+2350" 
          trend="up" 
          trendValue="+180.1%" 
          description="from last month" 
          icon={Users} 
        />
        <StatCard 
          title="Sales" 
          value="+12,234" 
          trend="up" 
          trendValue="+19%" 
          description="from last month" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Active Projects" 
          value="+573" 
          trend="down" 
          trendValue="-2.5%" 
          description="since last hour" 
          icon={Briefcase} 
        />
      </KPIGrid>

      <div className="grid gap-6 lg:grid-cols-4">
        <RevenueAreaChart />
        <div className="space-y-6">
          <QuickActions />
          <UserEngagementBarChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RecentSales sales={sales} />
        <ActivityFeed activities={activities} />
        <CRMMetrics />
        <InventoryMetrics />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
