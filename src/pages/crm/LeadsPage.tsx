import React, { useState, useEffect } from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { LeadsTable } from "@/components/tables/leads/LeadsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LeadDetailsDrawer, type Lead } from "@/components/crm/LeadDetailsDrawer"
import { notify } from "@/services/notificationService"
import { useAppSelector, useAppDispatch } from "@/store"
import { resetSearchQuery } from "@/store/features/searchSlice"

const DEFAULT_LEADS = [
  { id: "L1", company: "Tech Corp", contact: "Mark Ruffalo", value: 12000, status: "Won" as const, phone: "+1 234 567 890" },
  { id: "L2", company: "Globex Inc", contact: "Hank Hill", value: 5000, status: "Qualified" as const, phone: "+1 987 654 321" },
  { id: "L3", company: "Soylent Corp", contact: "Leela Turanga", value: 25000, status: "New" as const, phone: "+1 555 0199" },
  { id: "L4", company: "Initech", contact: "Peter Gibbons", value: 1500, status: "Lost" as const, phone: "+1 555 0123" },
  { id: "L5", company: "Umbrella Co", contact: "Albert Wesker", value: 100000, status: "Contacted" as const, phone: "+1 555 6666" },
]

const CRMLeadsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [leads, setLeads] = useState(DEFAULT_LEADS)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const searchQuery = useAppSelector((state) => state.search.query)

  // Reset the search input value when navigating away
  useEffect(() => {
    return () => {
      dispatch(resetSearchQuery())
    }
  }, [dispatch])

  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      lead.company.toLowerCase().includes(query) ||
      lead.contact.toLowerCase().includes(query) ||
      lead.status.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query)
    );
  });

  const handleRowClick = (lead: typeof DEFAULT_LEADS[number]) => {
    setSelectedLeadId(lead.id)
    setIsDrawerOpen(true)
  }

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === updatedLead.id
          ? { ...lead, status: updatedLead.status, value: updatedLead.value }
          : lead
      )
    )
  }

  const handleCreateNewLead = () => {
    notify.info("Feature Simulation", "Opening 'Add New Lead' modal simulation.")
  }

  return (
    <PageContainer>
      <SectionHeader
        title="CRM Leads"
        description="Manage and track your sales pipeline and potential customers."
        action={
          <Button onClick={handleCreateNewLead}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        }
      />
      
      <div className="mt-6">
        <LeadsTable 
          data={filteredLeads}
          onRowClick={handleRowClick}
        />
      </div>

      <LeadDetailsDrawer
        leadId={selectedLeadId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateLead={handleUpdateLead}
      />
    </PageContainer>
  )
}

export default CRMLeadsPage
