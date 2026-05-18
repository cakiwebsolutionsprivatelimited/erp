import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  UsersTable 
} from '@/components/tables/users/UsersTable';
import { 
  LeadsTable 
} from '@/components/tables/leads/LeadsTable';
import { 
  StatCard, 
  KPIGrid, 
  ActivityFeed, 
  RevenueAreaChart, 
  QuickActions,
  CRMMetrics
} from '@/components/dashboard';
import { PricingCards } from '@/components/pricing/PricingCards';
import { UserProfileCard } from '@/components/profile/UserProfileCard';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { FormWrapper } from '@/components/forms/FormWrapper';
import { FormInput, FormSection } from '@/components/forms/FormComponents';
import { userSchema } from '@/utils/validation-utils';
import { notify } from '@/services/notificationService';
import { Spinner, PageLoader } from '@/components/loaders';
import { BaseModal } from '@/components/modals/BaseModal';
import { useModals } from '@/hooks/useModals';
import { 
  Bell, 
  LayoutDashboard,
  Layers,
  Component,
  Database,
  FormInput as FormIcon,
  MessageSquare,
  Zap
} from 'lucide-react';

const sections = [
  { id: 'buttons', label: 'Buttons', icon: Zap },
  { id: 'forms', label: 'Forms & Inputs', icon: FormIcon },
  { id: 'tables', label: 'Data Tables', icon: Database },
  { id: 'dashboard', label: 'Dashboard Widgets', icon: LayoutDashboard },
  { id: 'modals', label: 'Modals & Alerts', icon: MessageSquare },
  { id: 'pricing', label: 'Pricing & SaaS', icon: Layers },
  { id: 'profile', label: 'Identity', icon: Component },
];

const ComponentShowcasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const { confirm, remove } = useModals();

  const handleShowLoader = () => {
    setIsLoaderOpen(true);
    setTimeout(() => setIsLoaderOpen(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTab(id);
    }
  };

  return (
    <PageContainer showBreadcrumb={false}>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Content Area */}
        <div className="flex-1 space-y-24 pb-24">
          <SectionHeader 
            title="Component Showcase" 
            description="A comprehensive library of reusable enterprise components built for the SaaS platform."
          />

          {/* Buttons Section */}
          <section id="buttons" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Zap size={20} /></div>
              <h2 className="text-2xl font-bold">Buttons</h2>
            </div>
            
            <div className="grid gap-8 p-8 bg-muted/30 rounded-3xl border border-dashed">
              <div className="space-y-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Variants</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">States & Icons</p>
                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading State</Button>
                  <Button><Zap className="mr-2 h-4 w-4" /> With Left Icon</Button>
                  <Button>With Right Icon <Zap className="ml-2 h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><Bell size={18} /></Button>
                </div>
              </div>
            </div>
          </section>

          {/* Forms & Inputs Section */}
          <section id="forms" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><FormIcon size={20} /></div>
              <h2 className="text-2xl font-bold">Forms & Inputs</h2>
            </div>
            
            <div className="grid gap-12">
              <div className="grid md:grid-cols-2 gap-8 p-8 bg-background border rounded-3xl shadow-sm">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Input Primitives</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Text Input</label>
                      <Input placeholder="Type something..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password Input</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Textarea</label>
                      <Textarea placeholder="Large multi-line input..." />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Complex Elements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-xl">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm font-medium leading-none">Accept terms and conditions</label>
                    </div>
                    <div className="p-4 border rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground italic">Accordions and Tabs can also be used inside forms to organize fields.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-background border rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold mb-6">Integrated Form Wrapper (React Hook Form + Zod)</h3>
                <FormWrapper 
                  schema={userSchema} 
                  defaultValues={{ firstName: '', lastName: '', email: '', role: 'user' }} 
                  onSubmit={(v) => notify.success('Form Valid!', JSON.stringify(v))}
                >
                  {() => (
                    <FormSection title="Account Details" description="Fill in the information below to test validation.">
                      <FormInput name="firstName" label="First Name" placeholder="John" />
                      <FormInput name="lastName" label="Last Name" placeholder="Doe" />
                      <FormInput name="email" label="Email" type="email" placeholder="john@example.com" />
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-xs text-primary font-medium">
                        Validation errors will appear automatically when you click save.
                      </div>
                    </FormSection>
                  )}
                </FormWrapper>
              </div>
            </div>
          </section>

          {/* Data Tables Section */}
          <section id="tables" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Database size={20} /></div>
              <h2 className="text-2xl font-bold">Enterprise Data Tables</h2>
            </div>
            
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-6 p-1 bg-muted rounded-2xl h-12">
                <TabsTrigger value="users" className="rounded-xl px-8">Users Directory</TabsTrigger>
                <TabsTrigger value="leads" className="rounded-xl px-8">CRM Leads</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <UsersTable />
              </TabsContent>
              <TabsContent value="leads">
                <LeadsTable />
              </TabsContent>
            </Tabs>
          </section>

          {/* Dashboard Widgets Section */}
          <section id="dashboard" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><LayoutDashboard size={20} /></div>
              <h2 className="text-2xl font-bold">Dashboard & Analytics</h2>
            </div>
            
            <div className="space-y-8">
              <KPIGrid>
                <StatCard title="Active Revenue" value="$42.5k" trend="up" trendValue="+12%" icon={Zap} />
                <StatCard title="New Signups" value="1,284" trend="up" trendValue="+5%" icon={Zap} />
                <StatCard title="Churn Rate" value="0.8%" trend="down" trendValue="-1.2%" icon={Zap} />
                <StatCard title="System Uptime" value="99.9%" trend="up" trendValue="Stable" icon={Zap} />
              </KPIGrid>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <RevenueAreaChart />
                <CRMMetrics />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <ActivityFeed activities={[
                  { id: '1', type: 'order', title: 'New Payment Received', time: 'Just now' },
                  { id: '2', type: 'user', title: 'User Updated Profile', time: '10m ago' }
                ]} />
                <QuickActions />
              </div>
            </div>
          </section>

          {/* Modals & Notifications Section */}
          <section id="modals" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><MessageSquare size={20} /></div>
              <h2 className="text-2xl font-bold">Modals & Notifications</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-background border rounded-3xl shadow-sm">
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Global Toasts (Sonner)</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" onClick={() => notify.success('Success!', 'Operation completed.')}>Success Toast</Button>
                  <Button variant="outline" onClick={() => notify.error('Failed', 'Something went wrong.')}>Error Toast</Button>
                  <Button variant="outline" onClick={() => notify.warning('Warning', 'Check your settings.')}>Warning Toast</Button>
                  <Button variant="outline" onClick={() => notify.info('Information', 'New update available.')}>Info Toast</Button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold">Modal System</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(true)}>Open Base Modal</Button>
                  <Button variant="outline" onClick={() => confirm({ title: 'Are you sure?', onConfirm: () => notify.success('Confirmed!') })}>Confirmation Hook</Button>
                  <Button variant="destructive" onClick={() => remove({ itemType: 'Project', onDelete: () => notify.error('Deleted!') })}>Delete Hook</Button>
                  <Button variant="outline" onClick={handleShowLoader}>Trigger Page Loader</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Layers size={20} /></div>
              <h2 className="text-2xl font-bold">Pricing & SaaS Components</h2>
            </div>
            <PricingCards />
          </section>

          {/* Identity Section */}
          <section id="profile" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Component size={20} /></div>
              <h2 className="text-2xl font-bold">Identity & Documentation</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <UserProfileCard />
              <InvoicePreview />
            </div>
          </section>
        </div>
      </div>

      {/* Internal State Modals */}
      <BaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Sample Base Modal"
        description="This is a direct implementation of the BaseModal component."
      >
        <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
          Your custom content goes here.
        </div>
      </BaseModal>

      {isLoaderOpen && <PageLoader />}
    </PageContainer>
  );
};

export default ComponentShowcasePage;
