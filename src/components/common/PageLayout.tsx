import React from 'react';
import { cn } from '@/utils';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  showBreadcrumb?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  showBreadcrumb = true 
}) => {
  return (
    <main className={cn("flex-1 p-4 md:p-8 animate-in fade-in duration-500", className)}>
      {showBreadcrumb && <Breadcrumb />}
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </main>
  );
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
