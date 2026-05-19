import React, { useState, useEffect } from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { useAppSelector, useAppDispatch } from "@/store"
import { resetSearchQuery } from "@/store/features/searchSlice"
import { notify } from "@/services/notificationService"
import { cn } from "@/utils"
import { 
  MOCK_INVOICES, 
  InvoiceMiniCard, 
  InvoicePreviewCard, 
  InvoiceManagementRow, 
  type Invoice 
} from "@/components/billing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ListTodo, 
  LayoutGrid, 
  ListOrdered,
  Plus,
  RefreshCw,
  Send,
  Download,
  Share2
} from "lucide-react"

export default function InvoicePage() {
  const dispatch = useAppDispatch()
  
  // Real-time local state simulated from MOCK dataset
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [inspectedInvoiceId, setInspectedInvoiceId] = useState<string>("INV-2026-003") // default inspect overdue
  const [activeFilter, setActiveFilter] = useState<"all" | "paid" | "pending" | "overdue" | "draft">("all")
  const [isLoading, setIsLoading] = useState(false)

  // Read search query from Redux global slice
  const searchQuery = useAppSelector((state) => state.search.query)

  // Auto reset search bar on navigate unmount
  useEffect(() => {
    return () => {
      dispatch(resetSearchQuery())
    }
  }, [dispatch])

  // Get inspected invoice for sidebar details
  const inspectedInvoice = invoices.find(i => i.id === inspectedInvoiceId) || invoices[0]

  // Dynamic Financial Calculators
  const reconciledIncome = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0)
  const outstandingRevenue = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + i.totalAmount, 0)
  const overdueDebtAlerts = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.totalAmount, 0)
  const pendingCount = invoices.filter(i => i.status === "pending").length

  // Search & Tab filtering logic
  const filteredInvoices = invoices.filter(invoice => {
    // 1. Search Query filter
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query || (
      invoice.clientName.toLowerCase().includes(query) ||
      invoice.clientCompany.toLowerCase().includes(query) ||
      invoice.clientEmail.toLowerCase().includes(query) ||
      invoice.id.toLowerCase().includes(query) ||
      invoice.paymentMethod.toLowerCase().includes(query)
    )

    // 2. Tab filter
    if (activeFilter === "all") return matchesSearch
    return matchesSearch && invoice.status === activeFilter
  })

  // Checkbox handlers
  const handleSelectOne = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, invoiceId])
    } else {
      setSelectedIds(prev => prev.filter(id => id !== invoiceId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredInvoices.map(i => i.id))
    } else {
      setSelectedIds([])
    }
  }

  // Simulating Billing Actions
  const handleInvoiceAction = (actionType: string, invoice: Invoice) => {
    setInspectedInvoiceId(invoice.id) // Inspect clicked item

    const logTimestamp = () => {
      const date = new Date()
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    switch (actionType) {
      case "inspect":
        notify.info("Inspect View", `Loaded ledger details for ${invoice.id}.`)
        break;

      case "reminder":
        setIsLoading(true)
        setTimeout(() => {
          setInvoices(prev => prev.map(inv => {
            if (inv.id === invoice.id) {
              return {
                ...inv,
                history: [
                  ...inv.history,
                  { id: `H-${Date.now()}`, action: `Overdue reminder sent manually`, timestamp: logTimestamp() }
                ]
              }
            }
            return inv
          }))
          setIsLoading(false)
          notify.success(
            "Reminder Dispatched", 
            `Successfully sent email reminder alert to ${invoice.clientEmail} for ${invoice.id}.`
          )
        }, 500)
        break;

      case "reconcile":
        setIsLoading(true)
        setTimeout(() => {
          setInvoices(prev => prev.map(inv => {
            if (inv.id === invoice.id) {
              return {
                ...inv,
                status: "paid",
                paymentMethod: "Reconciled Cash/ACH",
                history: [
                  ...inv.history,
                  { id: `H-${Date.now()}`, action: `Payment reconciled manually`, timestamp: logTimestamp() }
                ]
              }
            }
            return inv
          }))
          setIsLoading(false)
          notify.success(
            "Invoice Reconciled", 
            `Marked ${invoice.id} as Fully Paid. Net value ($${invoice.totalAmount.toFixed(2)}) moved to Reconciled Income.`
          )
        }, 600)
        break;

      case "share":
        notify.success("Link Shared", `Payment gateway link for ${invoice.id} shared with account team.`)
        break;

      case "download":
        notify.success("PDF Downloaded", `Initiated PDF print rendering for invoice ledger ${invoice.id}.`)
        break;

      case "delete":
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id))
        setSelectedIds(prev => prev.filter(id => id !== invoice.id))
        notify.warning("Invoice Voided", `Successfully voided / deleted transaction ${invoice.id}.`)
        break;

      default:
        break;
    }
  }

  // Bulk Actions
  const handleBulkReconcile = () => {
    if (selectedIds.length === 0) return
    setIsLoading(true)
    setTimeout(() => {
      const date = new Date()
      const timestamp = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setInvoices(prev => prev.map(inv => {
        if (selectedIds.includes(inv.id)) {
          return {
            ...inv,
            status: "paid",
            history: [
              ...inv.history,
              { id: `H-${Date.now()}`, action: `Bulk manual reconciliation`, timestamp }
            ]
          }
        }
        return inv
      }))
      setSelectedIds([])
      setIsLoading(false)
      notify.success("Bulk Reconcile Done", "Marked all selected transactions as Paid successfully.")
    }, 700)
  }

  return (
    <PageContainer>
      {/* Top Section Header */}
      <SectionHeader
        title="Accounts Receivable & Invoices"
        description="Oversee corporate billing entries, reconcile manual payment transfers, and dispatch payment reminders."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => notify.info("Export CSV", "Initiated ledger sheet download.")} className="shadow-xs cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Import Ledger
            </Button>
            <Button onClick={() => notify.success("Add Invoice", "Opening 'New Invoice' creator sheet simulation.")} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* KPI 1: Reconciled Income */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reconciled Income</span>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">${reconciledIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
              <CheckCircle2 size={12} /> Reconciled & Fully Paid
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <DollarSign size={22} />
          </div>
        </div>

        {/* KPI 2: Outstanding Revenue */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Outstanding Revenue</span>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">${outstandingRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
              <Clock size={12} /> Accounts Receivable
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Clock size={22} />
          </div>
        </div>

        {/* KPI 3: Overdue Debt */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Overdue Debt Alerts</span>
            <h3 className="text-2xl font-extrabold text-rose-500 tracking-tight">${overdueDebtAlerts.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-rose-500/80 font-semibold flex items-center gap-0.5 animate-pulse">
              <AlertCircle size={12} /> Immediate follow-up due
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <AlertCircle size={22} />
          </div>
        </div>

        {/* KPI 4: Pending Counts */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pending Roster Count</span>
            <h3 className="text-2xl font-extrabold text-primary tracking-tight">{pendingCount} Invoices</h3>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Awaiting client validation
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Main Core Layout: Sidebar Ledger feed + Central View Tab systems */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Side: Recent Roster Alert feed & Invoice Inspector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Accounts Receivable Feed</h3>
              <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold border-transparent">
                Live Ledger
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Recent invoice statements pending reconciliation. Click to inspect financial logs.
            </p>
            
            <Separator className="bg-muted" />

            {/* Sidebar list items */}
            <div className="space-y-2.5">
              {invoices.filter(i => i.status !== "paid").map(inv => (
                <InvoiceMiniCard
                  key={inv.id}
                  invoice={inv}
                  isLoading={isLoading}
                  onAction={handleInvoiceAction}
                />
              ))}
            </div>
          </div>

          {/* Audit Log / History details Inspector Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reconciliation Audit Log</span>
              <Badge className="bg-indigo-500/10 text-indigo-500 border-transparent hover:bg-indigo-500/20 font-bold">
                Invoice History
              </Badge>
            </div>

            {/* History logs inspector card */}
            <div className="bg-card border rounded-3xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block font-mono">{inspectedInvoice.id}</span>
                  <h4 className="text-sm font-bold text-foreground truncate">{inspectedInvoice.clientName}</h4>
                </div>
              </div>

              <Separator className="bg-muted" />

              {/* Invoicing Logs timeline feed */}
              <div className="space-y-3.5">
                <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Transaction Activity Logs</span>
                
                <div className="space-y-3">
                  {inspectedInvoice.history.map(log => (
                    <div key={log.id} className="relative flex gap-2.5 text-xs font-semibold">
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        <div className="w-[1px] bg-muted flex-1 min-h-[20px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-foreground font-bold block">{log.action}</span>
                        <span className="text-[10px] text-muted-foreground/80 block mt-0.5">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-muted" />

              {/* Simulators */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleInvoiceAction("reconcile", inspectedInvoice)}
                  disabled={inspectedInvoice.status === "paid"}
                  className="flex-1 text-xs font-bold gap-1 rounded-xl h-9 cursor-pointer"
                >
                  <RefreshCw size={12} className={cn(isLoading && "animate-spin")} />
                  Reconcile Payment
                </Button>
                <Button 
                  onClick={() => handleInvoiceAction("reminder", inspectedInvoice)}
                  disabled={inspectedInvoice.status === "paid" || inspectedInvoice.status === "draft"}
                  variant="outline"
                  className="flex-1 text-xs font-bold gap-1 rounded-xl h-9 border-muted-foreground/20 cursor-pointer"
                >
                  <Send size={12} />
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Central View Tab ledgers lists */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="catalog" className="w-full">
            
            {/* Toolbar section: Tabs, Search filters */}
            <div className="bg-card border rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
              
              <TabsList className="bg-muted/50 border rounded-2xl h-10 p-1 w-fit">
                <TabsTrigger value="catalog" className="rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer">
                  <LayoutGrid className="h-4 w-4" />
                  Invoice Preview Sheets
                </TabsTrigger>
                <TabsTrigger value="stock" className="rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer">
                  <ListOrdered className="h-4 w-4" />
                  Receivable Roster Rows
                </TabsTrigger>
              </TabsList>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "paid", "pending", "overdue", "draft"] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter)
                      setSelectedIds([])
                    }}
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full border transition-all cursor-pointer",
                      activeFilter === filter 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT 1: GRID VIEW (InvoicePreviewCard Grid) */}
            <TabsContent value="catalog" className="mt-4 animate-in fade-in-50 duration-200">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h4 className="text-sm font-bold">No Invoices Found</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery ? "No statements match your search filter query." : "There are currently no transactions recorded."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredInvoices.map(inv => (
                    <InvoicePreviewCard
                      key={inv.id}
                      invoice={inv}
                      isLoading={isLoading}
                      onAction={handleInvoiceAction}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB CONTENT 2: WAREHOUSE ROW LIST (InvoiceManagementRow List) */}
            <TabsContent value="stock" className="mt-4 animate-in fade-in-50 duration-200 space-y-4">
              
              {/* Bulk Actions Header */}
              {selectedIds.length > 0 && (
                <div className="bg-muted/30 border border-dashed p-3 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2">
                  <span className="text-xs font-bold text-muted-foreground pr-2 flex items-center gap-1.5">
                    <ListTodo className="h-4 w-4 text-primary" />
                    <strong>{selectedIds.length}</strong> transactions selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkReconcile}
                      size="sm" 
                      variant="outline"
                      className="text-xs font-bold h-8 rounded-xl cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      Bulk Reconcile
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedIds([])
                        notify.info("Checklist Cleared", "Cleared selection roster.")
                      }}
                      size="sm" 
                      variant="ghost"
                      className="text-xs font-bold h-8 rounded-xl cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Rows List */}
              <div className="space-y-3">
                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h4 className="text-sm font-bold">No Invoices Found</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery ? "No statements match your search filter query." : "There are currently no transactions recorded."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Select Roster */}
                    <div className="flex items-center px-4 py-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      <input 
                        type="checkbox"
                        checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0 mr-4"
                      />
                      <span>Select All Roster Items</span>
                    </div>

                    {filteredInvoices.map(inv => (
                      <InvoiceManagementRow
                        key={inv.id}
                        invoice={inv}
                        isSelected={selectedIds.includes(inv.id)}
                        onSelectChange={(checked) => handleSelectOne(inv.id, checked)}
                        isLoading={isLoading}
                        onAction={handleInvoiceAction}
                      />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>

          </Tabs>

        </div>

      </div>
    </PageContainer>
  )
}
