import React from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { LeadsTable } from "@/components/tables/leads/LeadsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const CRMLeadsPage: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="CRM Leads"
        description="Manage and track your sales pipeline and potential customers."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        }
      />
      
      <div className="mt-6">
        <LeadsTable />
      </div>
    </PageContainer>
  )
}

export default CRMLeadsPage
