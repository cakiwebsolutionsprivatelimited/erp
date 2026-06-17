import React from 'react';
import { KanbanBoard, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { LeadStage } from '@/tenant/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];

const PipelinePage: React.FC = () => {
  const { leads, changeLeadStage } = useTenantData();

  return (
    <div>
      <PageHeader title="Pipeline Kanban" description="Drag leads between stages to update the local demo pipeline." />
      <KanbanBoard leads={leads} stages={stages} onDropLead={changeLeadStage} />
    </div>
  );
};

export default PipelinePage;
