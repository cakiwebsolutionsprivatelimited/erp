import React, { useState, useEffect } from "react"
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  FileText, 
  UploadCloud, 
  ExternalLink, 
  Copy, 
  Check, 
  Briefcase, 
  Search, 
  Send,
  Loader2,
  FileSpreadsheet,
  FileImage,
  FileCode,
  Globe,
  CornerDownRight,
  ShieldCheck,
  Zap
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { notify } from "@/services/notificationService"
import { cn } from "@/utils"

// ==========================================
// 1. TypeScript Types & Interfaces
// ==========================================

export interface Lead {
  id: string
  company: string
  contact: string
  value: number
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Won"
  phone: string
  email: string
  temperature: "Hot" | "Warm" | "Cold"
  source: string
  createdDate: string
  assignedSalesperson: {
    name: string
    email: string
    role: string
    initials: string
    avatarBg: string // Tailwind bg class
  }
  notes?: string
}

export interface LeadActivity {
  id: string
  type: "call" | "note" | "followup" | "whatsapp" | "email" | "system"
  title: string
  description: string
  timestamp: string
  userName: string
}

export interface LeadAttachment {
  id: string
  name: string
  size: string
  type: "pdf" | "docx" | "xlsx" | "image" | "other"
  uploadedAt: string
  uploadedBy: string
}

export interface LeadQuotation {
  id: string
  quoteNumber: string
  date: string
  expiryDate: string
  amount: number
  status: "Draft" | "Sent" | "Accepted" | "Expired"
}

interface LeadDetailsDrawerProps {
  leadId: string | null
  isOpen: boolean
  onClose: () => void
  onUpdateLead?: (updatedLead: Lead) => void
  isLoading?: boolean
}

// ==========================================
// 2. High-Fidelity Mock Data (tailored for each lead in the system)
// ==========================================

const MOCK_LEAD_EXTENSIONS: Record<string, Omit<Lead, "id" | "company" | "contact" | "value" | "status" | "phone">> = {
  L1: {
    email: "mark.ruffalo@techcorp.com",
    temperature: "Hot",
    source: "LinkedIn Outreach",
    createdDate: "2026-04-10",
    assignedSalesperson: {
      name: "Sarah Jenkins",
      email: "sarah.j@enterprise-erp.com",
      role: "Enterprise Account Executive",
      initials: "SJ",
      avatarBg: "bg-purple-600 text-white"
    },
    notes: "Very interested in our multi-currency billing and consolidated general ledger features. Ready to review the formal quotation for 150 licenses. Strongly leaning towards our Professional tier plus custom integration."
  },
  L2: {
    email: "hank.hill@globex.com",
    temperature: "Warm",
    source: "Website Form",
    createdDate: "2026-05-02",
    assignedSalesperson: {
      name: "Michael Chang",
      email: "michael.c@enterprise-erp.com",
      role: "Mid-Market Account Manager",
      initials: "MC",
      avatarBg: "bg-indigo-600 text-white"
    },
    notes: "Evaluating ERP modules to streamline propane retail logistics. Needs automated supply chain dispatch and billing. Asked if we support tank-level telemetry integration. Keep nurturing on custom API capabilities."
  },
  L3: {
    email: "leela.turanga@soylent.co",
    temperature: "Hot",
    source: "Referral",
    createdDate: "2026-05-15",
    assignedSalesperson: {
      name: "Sarah Jenkins",
      email: "sarah.j@enterprise-erp.com",
      role: "Enterprise Account Executive",
      initials: "SJ",
      avatarBg: "bg-purple-600 text-white"
    },
    notes: "Requires massive scale HRMS and payroll. Multi-planetary labor regulations compliance is highly desirable. Demo went exceptionally well, particularly loved the interactive Org Chart explorer and instant compliance checklists."
  },
  L4: {
    email: "peter.gibbons@initech.com",
    temperature: "Cold",
    source: "Cold Outreach",
    createdDate: "2026-02-18",
    assignedSalesperson: {
      name: "David Vance",
      email: "david.v@enterprise-erp.com",
      role: "Sales Development Rep",
      initials: "DV",
      avatarBg: "bg-amber-600 text-white"
    },
    notes: "Experiencing severe paperwork bloat. Mentioned frustration with 'TPS reports'. Expressed interest in automated workflow approvals, but budget approval is stalled in management hierarchy. Hard to reach."
  },
  L5: {
    email: "albert.wesker@umbrellacorp.com",
    temperature: "Hot",
    source: "Executive Event",
    createdDate: "2026-05-01",
    assignedSalesperson: {
      name: "Michael Chang",
      email: "michael.c@enterprise-erp.com",
      role: "Mid-Market Account Manager",
      initials: "MC",
      avatarBg: "bg-indigo-600 text-white"
    },
    notes: "High priority lead. Requires strict data containment, military-grade end-to-end encryption, and isolated private cloud hosting. Evaluating manufacturing batch controls and strict inventory expiration monitors."
  }
}

const MOCK_ACTIVITIES: Record<string, LeadActivity[]> = {
  L1: [
    { id: "a1", type: "system", title: "Lead Created", description: "Imported via LinkedIn campaign integration", timestamp: "2026-04-10T10:00:00Z", userName: "System" },
    { id: "a2", type: "email", title: "Outbound Email Sent", description: "Follow-up email with ERP capabilities deck", timestamp: "2026-04-11T14:30:00Z", userName: "Sarah Jenkins" },
    { id: "a3", type: "call", title: "Discovery Call Logged", description: "30-minute introductory call. Discussed pain points on multi-currency and global consolidations.", timestamp: "2026-04-15T11:00:00Z", userName: "Sarah Jenkins" },
    { id: "a4", type: "note", title: "Internal Brief Added", description: "Requires a highly customizable API hook for their custom client portal.", timestamp: "2026-04-15T11:45:00Z", userName: "Sarah Jenkins" },
    { id: "a5", type: "whatsapp", title: "WhatsApp Message Sent", description: "Shared sandbox login credentials as requested.", timestamp: "2026-04-20T09:15:00Z", userName: "Sarah Jenkins" },
    { id: "a6", type: "followup", title: "Demo Scheduled", description: "Scheduled ERP general ledger walkthrough with the CFO.", timestamp: "2026-04-25T16:00:00Z", userName: "Sarah Jenkins" }
  ],
  L2: [
    { id: "a7", type: "system", title: "Lead Created", description: "Submitted 'Request a Quote' form on website", timestamp: "2026-05-02T08:12:00Z", userName: "System" },
    { id: "a8", type: "call", title: "Outbound Call - No Answer", description: "Left voicemail to reschedule intro call.", timestamp: "2026-05-03T10:00:00Z", userName: "Michael Chang" },
    { id: "a9", type: "call", title: "Introductory Call", description: "Discussed fuel delivery tracking requirements. Hank is happy to move forward with a custom demo.", timestamp: "2026-05-05T15:20:00Z", userName: "Michael Chang" },
    { id: "a10", type: "followup", title: "Follow-up Task Completed", description: "Sent propane dispatch whitepaper and case studies.", timestamp: "2026-05-08T13:45:00Z", userName: "Michael Chang" }
  ],
  L3: [
    { id: "a11", type: "system", title: "Lead Created", description: "Referred by Hermes Conrad (Planet Express)", timestamp: "2026-05-15T09:00:00Z", userName: "System" },
    { id: "a12", type: "call", title: "Discovery Call", description: "Highly positive call. Extremely urgent need due to expansion to Mars colony. HR compliance is their main bottleneck.", timestamp: "2026-05-16T11:30:00Z", userName: "Sarah Jenkins" },
    { id: "a13", type: "note", title: "Priority Briefing", description: "Targeting Won. Needs high-priority SLA pricing for enterprise tier.", timestamp: "2026-05-16T12:00:00Z", userName: "Sarah Jenkins" }
  ],
  L4: [
    { id: "a14", type: "system", title: "Lead Created", description: "Imported via cold prospect list upload", timestamp: "2026-02-18T14:00:00Z", userName: "System" },
    { id: "a15", type: "email", title: "Cold Outreach Sent", description: "Emailed introducing ERP automated workflows and audit tracking.", timestamp: "2026-02-19T09:00:00Z", userName: "David Vance" },
    { id: "a16", type: "email", title: "Outbound Email Sent", description: "Sent follow-up regarding scheduling an intro call.", timestamp: "2026-03-05T11:00:00Z", userName: "David Vance" }
  ],
  L5: [
    { id: "a17", type: "system", title: "Lead Created", description: "Handwritten card at Annual Bioscience Executive Summit", timestamp: "2026-05-01T18:00:00Z", userName: "System" },
    { id: "a18", type: "note", title: "High Security Flags", description: "MUST host on completely isolated instances. No multi-tenant databases. Ready to pay 3x premium for dedicated infrastructure.", timestamp: "2026-05-02T10:00:00Z", userName: "Michael Chang" },
    { id: "a19", type: "call", title: "Security Architecture Session", description: "Reviewed data encryption protocols and key management frameworks.", timestamp: "2026-05-08T14:00:00Z", userName: "Michael Chang" },
    { id: "a20", type: "followup", title: "NDA Completed", description: "Bi-lateral custom NDA signed and archived.", timestamp: "2026-05-12T16:30:00Z", userName: "Michael Chang" }
  ]
}

const MOCK_ATTACHMENTS: Record<string, LeadAttachment[]> = {
  L1: [
    { id: "f1", name: "TechCorp_Requirements_V2.pdf", size: "2.4 MB", type: "pdf", uploadedAt: "2026-04-15", uploadedBy: "Sarah Jenkins" },
    { id: "f2", name: "License_Pricing_Tier_Professional.xlsx", size: "480 KB", type: "xlsx", uploadedAt: "2026-04-28", uploadedBy: "Sarah Jenkins" }
  ],
  L2: [
    { id: "f3", name: "Propane_Logistics_Flowchart.pdf", size: "1.8 MB", type: "pdf", uploadedAt: "2026-05-05", uploadedBy: "Michael Chang" }
  ],
  L3: [
    { id: "f4", name: "PlanetExpress_Referral_Note.docx", size: "320 KB", type: "docx", uploadedAt: "2026-05-15", uploadedBy: "Sarah Jenkins" },
    { id: "f5", name: "SoylentCorp_Logo.png", size: "1.1 MB", type: "image", uploadedAt: "2026-05-16", uploadedBy: "Sarah Jenkins" }
  ],
  L4: [],
  L5: [
    { id: "f6", name: "Umbrella_Isolated_Cloud_Specs.pdf", size: "5.7 MB", type: "pdf", uploadedAt: "2026-05-08", uploadedBy: "Michael Chang" },
    { id: "f7", name: "Executed_Mutual_NDA_Wesker.pdf", size: "1.2 MB", type: "pdf", uploadedAt: "2026-05-12", uploadedBy: "Michael Chang" }
  ]
}

const MOCK_QUOTATIONS: Record<string, LeadQuotation[]> = {
  L1: [
    { id: "q1", quoteNumber: "QT-2026-0842", date: "2026-04-29", expiryDate: "2026-05-29", amount: 12000, status: "Sent" }
  ],
  L2: [
    { id: "q2", quoteNumber: "QT-2026-0911", date: "2026-05-06", expiryDate: "2026-06-06", amount: 5000, status: "Draft" }
  ],
  L3: [
    { id: "q3", quoteNumber: "QT-2026-0955", date: "2026-05-16", expiryDate: "2026-06-16", amount: 25000, status: "Sent" }
  ],
  L4: [],
  L5: [
    { id: "q4", quoteNumber: "QT-2026-0899", date: "2026-05-09", expiryDate: "2026-06-09", amount: 300000, status: "Sent" },
    { id: "q5", quoteNumber: "QT-2026-0902", date: "2026-05-13", expiryDate: "2026-06-13", amount: 100000, status: "Accepted" }
  ]
}

// ==========================================
// 3. Helper Functions
// ==========================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

const getInitials = (name: string) => {
  if (!name) return "LD"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// ==========================================
// 4. Custom Reusable Badges
// ==========================================

export function StatusBadge({ status }: { status: Lead["status"] }) {
  switch (status) {
    case "Won":
      return (
        <Badge variant="success" className="font-semibold gap-1 py-0.5">
          <CheckCircle2 className="h-3 w-3" />
          Won
        </Badge>
      )
    case "Lost":
      return (
        <Badge variant="destructive" className="font-semibold gap-1 py-0.5">
          <X className="h-3 w-3" />
          Lost
        </Badge>
      )
    case "Qualified":
      return (
        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-semibold gap-1 py-0.5 dark:bg-purple-900/20 dark:text-purple-400">
          <ShieldCheck className="h-3 w-3" />
          Qualified
        </Badge>
      )
    case "Contacted":
      return (
        <Badge variant="warning" className="font-semibold gap-1 py-0.5">
          <MessageSquare className="h-3 w-3" />
          Contacted
        </Badge>
      )
    default:
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-semibold gap-1 py-0.5 dark:bg-blue-900/20 dark:text-blue-400">
          <Zap className="h-3 w-3" />
          New
        </Badge>
      )
  }
}

export function TemperatureBadge({ temp }: { temp: Lead["temperature"] }) {
  switch (temp) {
    case "Hot":
      return (
        <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20 gap-1 font-semibold dark:bg-rose-900/20 dark:text-rose-400">
          <Sparkles className="h-3 w-3 text-rose-500 animate-pulse" />
          Hot
        </Badge>
      )
    case "Warm":
      return (
        <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1 font-semibold dark:bg-amber-900/20 dark:text-amber-400">
          <TrendingUp className="h-3 w-3 text-amber-500" />
          Warm
        </Badge>
      )
    case "Cold":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 gap-1 font-semibold dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-3 w-3 text-blue-500" />
          Cold
        </Badge>
      )
  }
}

// ==========================================
// Main Component
// ==========================================

export function LeadDetailsDrawer({
  leadId,
  isOpen,
  onClose,
  onUpdateLead,
  isLoading: propIsLoading = false
}: LeadDetailsDrawerProps) {
  
  // ----------------------------------------
  // State variables for interactive simulation
  // ----------------------------------------
  const [internalLead, setInternalLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [attachments, setAttachments] = useState<LeadAttachment[]>([])
  const [quotations, setQuotations] = useState<LeadQuotation[]>([])
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  // Simulated File Upload State
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadFileName, setUploadFileName] = useState("")

  // Load Lead details dynamically whenever leadId changes
  useEffect(() => {
    if (!leadId) {
      setInternalLead(null)
      return
    }

    setLoading(true)
    
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      // Find original base lead in the main leads table, or fall back
      const baseLeads: Record<string, { company: string; contact: string; value: number; status: Lead["status"]; phone: string }> = {
        L1: { company: "Tech Corp", contact: "Mark Ruffalo", value: 12000, status: "Won", phone: "+1 234 567 890" },
        L2: { company: "Globex Inc", contact: "Hank Hill", value: 5000, status: "Qualified", phone: "+1 987 654 321" },
        L3: { company: "Soylent Corp", contact: "Leela Turanga", value: 25000, status: "New", phone: "+1 555 0199" },
        L4: { company: "Initech", contact: "Peter Gibbons", value: 1500, status: "Lost", phone: "+1 555 0123" },
        L5: { company: "Umbrella Co", contact: "Albert Wesker", value: 100000, status: "Contacted", phone: "+1 555 6666" }
      }

      const base = baseLeads[leadId] || { company: "Generic Corp", contact: "John Doe", value: 0, status: "New" as const, phone: "+1 555 0000" }
      const extension = MOCK_LEAD_EXTENSIONS[leadId] || {
        email: "contact@generic.com",
        temperature: "Warm" as const,
        source: "Direct",
        createdDate: "2026-05-01",
        assignedSalesperson: {
          name: "Michael Chang",
          email: "michael.c@enterprise-erp.com",
          role: "Account Executive",
          initials: "MC",
          avatarBg: "bg-indigo-600 text-white"
        },
        notes: ""
      }

      setInternalLead({
        id: leadId,
        company: base.company,
        contact: base.contact,
        value: base.value,
        status: base.status,
        phone: base.phone,
        ...extension
      })

      // Load deep sub-views
      setActivities(MOCK_ACTIVITIES[leadId] || [])
      setAttachments(MOCK_ATTACHMENTS[leadId] || [])
      setQuotations(MOCK_QUOTATIONS[leadId] || [])
      
      setLoading(false)
    }, 450) // smooth short delay for premium feel

    return () => clearTimeout(timer)
  }, [leadId])

  // Reset tab to overview on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
    }
  }, [isOpen])

  // Handle clipboard copy
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    notify.info("Copied to Clipboard", `${field} copied successfully.`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // ----------------------------------------
  // Interactive Timeline: Add Note
  // ----------------------------------------
  const handleAddNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newNote.trim() || !internalLead) return

    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "note",
      title: "Note Added",
      description: newNote.trim(),
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    
    // Update notes section on the overview
    const updatedLead: Lead = {
      ...internalLead,
      notes: internalLead.notes 
        ? `${newNote.trim()}\n\n---\n\n${internalLead.notes}`
        : newNote.trim()
    }
    setInternalLead(updatedLead)
    onUpdateLead?.(updatedLead)

    setNewNote("")
    setIsAddingNote(false)
    notify.success("Note Saved", "Your internal note was successfully attached to the lead timeline.")
  }

  // ----------------------------------------
  // Action Triggers
  // ----------------------------------------
  const handleScheduleFollowup = () => {
    if (!internalLead) return
    
    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "followup",
      title: "Follow-up Scheduled",
      description: "Automated: Next review call scheduled for 3 business days from now.",
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    setActivities([newActivity, ...activities])
    notify.success("Follow-up Scheduled", "A critical task has been added to your calendar feed.")
  }

  const handleSimulateEmail = () => {
    if (!internalLead) return
    
    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "email",
      title: "Email Draft Dispatched",
      description: `Automated follow-up pitch sent to ${internalLead.email} containing the ERP onboarding guide.`,
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    setActivities([newActivity, ...activities])
    notify.success("Email Dispatched", `A personalized draft was compiled and sent to ${internalLead.email}`)
  }

  const handleSimulateWhatsApp = () => {
    if (!internalLead) return
    
    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "whatsapp",
      title: "WhatsApp Message Sent",
      description: `WhatsApp chat ping sent to ${internalLead.phone}: 'Hi ${internalLead.contact}, did you have a chance to look at our ERP sandbox yet?'`,
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    setActivities([newActivity, ...activities])
    notify.info("WhatsApp Pinged", `Simulation chat logged for contact ${internalLead.contact}`)
  }

  const handleConvertLead = () => {
    if (!internalLead) return
    if (internalLead.status === "Won") {
      notify.warning("Already Converted", "This lead is already a won customer.")
      return
    }

    const updatedLead: Lead = {
      ...internalLead,
      status: "Won"
    }
    
    setInternalLead(updatedLead)
    onUpdateLead?.(updatedLead)

    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "system",
      title: "Lead Converted to Customer 🎉",
      description: `Successfully converted ${internalLead.company} into a paid customer with value ${formatCurrency(internalLead.value)}!`,
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    setActivities([newActivity, ...activities])
    notify.success("Deal Won! 🎉", `${internalLead.company} has been converted successfully!`)
  }

  const handleCreateQuotation = () => {
    if (!internalLead) return

    const newQuoteNum = `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const newQuote: LeadQuotation = {
      id: `q-new-${Date.now()}`,
      quoteNumber: newQuoteNum,
      date: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: internalLead.value || 15000,
      status: "Draft"
    }

    setQuotations([newQuote, ...quotations])
    setActiveTab("quotations")

    const newActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "system",
      title: `Quotation ${newQuoteNum} Created`,
      description: `New draft quotation generated in amount of ${formatCurrency(newQuote.amount)}`,
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }

    setActivities([newActivity, ...activities])
    notify.success("Quotation Created", `Draft ${newQuoteNum} has been added under the Quotations tab.`)
  }

  // ----------------------------------------
  // File Upload Simulation
  // ----------------------------------------
  const handleFileUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !internalLead) return

    setUploadFileName(file.name)
    setUploadProgress(0)

    // Simulate upload timer
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            const ext = file.name.split(".").pop()?.toLowerCase() || ""
            let fileType: LeadAttachment["type"] = "other"
            if (["pdf"].includes(ext)) fileType = "pdf"
            else if (["doc", "docx"].includes(ext)) fileType = "docx"
            else if (["xls", "xlsx"].includes(ext)) fileType = "xlsx"
            else if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) fileType = "image"

            const newAttachment: LeadAttachment = {
              id: `f-new-${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: fileType,
              uploadedAt: new Date().toISOString().split("T")[0],
              uploadedBy: internalLead.assignedSalesperson.name
            }

            setAttachments([newAttachment, ...attachments])
            setUploadProgress(null)
            
            // Log to timeline
            const uploadActivity: LeadActivity = {
              id: `a-new-${Date.now()}`,
              type: "system",
              title: "Attachment Uploaded",
              description: `Uploaded file '${file.name}'`,
              timestamp: new Date().toISOString(),
              userName: internalLead.assignedSalesperson.name
            }
            setActivities([uploadActivity, ...activities])
            notify.success("Upload Finished", `'${file.name}' is now safely pinned to the lead archives.`)
          }, 300)
          return 100
        }
        return prev + 25
      })
    }, 150)
  }

  // ----------------------------------------
  // File Delete
  // ----------------------------------------
  const handleDeleteFile = (id: string, name: string) => {
    if (!internalLead) return
    setAttachments(attachments.filter((f) => f.id !== id))
    
    // Log to timeline
    const deleteActivity: LeadActivity = {
      id: `a-new-${Date.now()}`,
      type: "system",
      title: "Attachment Deleted",
      description: `Removed file '${name}'`,
      timestamp: new Date().toISOString(),
      userName: internalLead.assignedSalesperson.name
    }
    setActivities([deleteActivity, ...activities])
    notify.info("Attachment Removed", `'${name}' has been deleted from this lead.`)
  }

  const isActuallyLoading = propIsLoading || loading

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        className="w-full max-w-[550px] sm:max-w-[620px] p-0 flex flex-col h-full bg-background border-l shadow-2xl overflow-hidden focus:outline-none"
        showCloseButton={false}
      >
        {/* Sticky Header */}
        <div className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lead Profile</span>
          </div>
          <div className="flex items-center gap-2">
            {internalLead && !isActuallyLoading && (
              <>
                <TemperatureBadge temp={internalLead.temperature} />
                <StatusBadge status={internalLead.status} />
              </>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------
            LOADING STATE SKELETON
            ---------------------------------------------------- */}
        {isActuallyLoading ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-8 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-8 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-8 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-8 w-full" /></div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : !internalLead ? (
          // Empty state when no lead selected
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-foreground">No Lead Selected</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              Select a lead row from the table to review their deep pipelines and communications.
            </p>
          </div>
        ) : (
          // Drawer Body
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header Identity Block */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-card/30 to-transparent">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-background shrink-0",
                  internalLead.assignedSalesperson.avatarBg
                )}>
                  {getInitials(internalLead.contact)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-foreground leading-tight truncate">{internalLead.contact}</h2>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium truncate">{internalLead.company}</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center">
                    <DollarSign className="h-4.5 w-4.5 -mr-0.5 shrink-0" />
                    {formatCurrency(internalLead.value)}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">estimated value</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-9 justify-center gap-1.5 hover:bg-muted/50 transition-all font-semibold"
                  onClick={() => {
                    setActiveTab("activities")
                    setIsAddingNote(true)
                  }}
                >
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                  Add Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-9 justify-center gap-1.5 hover:bg-muted/50 transition-all font-semibold"
                  onClick={handleScheduleFollowup}
                >
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  Follow-up
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-9 justify-center gap-1.5 hover:bg-muted/50 transition-all font-semibold"
                  onClick={handleCreateQuotation}
                >
                  <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                  + Quote
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-9 justify-center gap-1.5 hover:bg-muted/50 transition-all font-semibold"
                  onClick={handleSimulateEmail}
                >
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-9 justify-center gap-1.5 hover:bg-muted/50 transition-all font-semibold"
                  onClick={handleSimulateWhatsApp}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  WhatsApp
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className={cn(
                    "text-xs h-9 justify-center gap-1.5 font-bold transition-all shadow-sm",
                    internalLead.status === "Won" 
                      ? "bg-emerald-600 hover:bg-emerald-600/90 text-white cursor-default" 
                      : "bg-primary hover:bg-primary/95 text-primary-foreground"
                  )}
                  onClick={handleConvertLead}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  {internalLead.status === "Won" ? "Converted" : "Convert Lead"}
                </Button>
              </div>
            </div>

            <Separator className="bg-muted" />

            {/* Tabs System */}
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-6 pt-2 bg-card/10">
                <TabsList variant="line" className="w-full flex border-b justify-start gap-6 h-10 p-0 rounded-none bg-transparent">
                  <TabsTrigger value="overview" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide flex items-center gap-1.5">
                    Activities
                    <Badge className="h-4.5 px-1 py-0 text-[10px] bg-muted text-muted-foreground rounded-full hover:bg-muted font-bold shrink-0">{activities.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="files" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide flex items-center gap-1.5">
                    Files
                    <Badge className="h-4.5 px-1 py-0 text-[10px] bg-muted text-muted-foreground rounded-full hover:bg-muted font-bold shrink-0">{attachments.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="quotations" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide flex items-center gap-1.5">
                    Quotations
                    <Badge className="h-4.5 px-1 py-0 text-[10px] bg-muted text-muted-foreground rounded-full hover:bg-muted font-bold shrink-0">{quotations.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Contents Area */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gradient-to-b from-background to-card/5">
                
                {/* ----------------------------------------------------
                    TAB CONTENT: OVERVIEW
                    ---------------------------------------------------- */}
                <TabsContent value="overview" className="space-y-6 mt-0">
                  
                  {/* Contacts Grid card */}
                  <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Contact Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Contact Person</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{internalLead.contact}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Company Name</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{internalLead.company}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Email Address</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground group min-w-0">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{internalLead.email}</span>
                          <button 
                            onClick={() => handleCopy(internalLead.email, "Email")}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === "Email" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Phone Number</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground group min-w-0">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{internalLead.phone}</span>
                          <button 
                            onClick={() => handleCopy(internalLead.phone, "Phone")}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === "Phone" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata and assignment info */}
                  <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pipeline Meta Information</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Lead Source</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="bg-muted px-2 py-0.5 rounded text-xs">{internalLead.source}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block font-medium">Created Date</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{formatDate(internalLead.createdDate)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 bg-muted" />

                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground block font-medium">Assigned Representative</span>
                      <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-dashed">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs",
                          internalLead.assignedSalesperson.avatarBg
                        )}>
                          {internalLead.assignedSalesperson.initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{internalLead.assignedSalesperson.name}</h4>
                          <span className="text-xs text-muted-foreground truncate block">{internalLead.assignedSalesperson.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Card */}
                  <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Notes & Brief</h3>
                      <Button 
                        variant="ghost" 
                        size="xs" 
                        className="text-xs text-primary font-semibold hover:bg-muted"
                        onClick={() => {
                          setActiveTab("activities")
                          setIsAddingNote(true)
                        }}
                      >
                        Edit / Append
                      </Button>
                    </div>
                    {internalLead.notes ? (
                      <p className="text-sm text-foreground whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-xl border border-muted/50 font-medium">
                        {internalLead.notes}
                      </p>
                    ) : (
                      <div className="text-center py-6 border border-dashed rounded-xl bg-muted/10">
                        <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground font-semibold">No notes logged yet.</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* ----------------------------------------------------
                    TAB CONTENT: ACTIVITIES TIMELINE
                    ---------------------------------------------------- */}
                <TabsContent value="activities" className="space-y-6 mt-0">
                  
                  {/* Inline Note Add Section */}
                  {isAddingNote ? (
                    <form onSubmit={handleAddNote} className="bg-card border rounded-2xl p-4 shadow-md border-amber-500/25 space-y-3 animate-in slide-in-from-top-3 duration-250">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Write Internal Note
                        </h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon-xs" 
                          className="hover:bg-muted text-muted-foreground"
                          onClick={() => setIsAddingNote(false)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Textarea 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type internal meeting notes, call briefs, or updates here... (will append to overview notes)"
                        className="min-h-[90px] text-sm resize-none focus-visible:ring-amber-500 bg-background"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs font-medium" 
                          onClick={() => setIsAddingNote(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="h-8 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600"
                          disabled={!newNote.trim()}
                        >
                          <Send className="h-3 w-3 mr-1.5" />
                          Save Note
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed justify-center h-10 font-bold gap-2 text-muted-foreground hover:text-foreground text-sm rounded-xl"
                      onClick={() => setIsAddingNote(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom Note to Timeline
                    </Button>
                  )}

                  {/* Vertical Timeline Feed */}
                  {activities.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10">
                      <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-foreground">Timeline is Empty</h4>
                      <p className="text-xs text-muted-foreground max-w-[220px] mx-auto mt-1">
                        Log calls, follow-ups, or notes to view the full pipeline activity feed here.
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                      {activities.map((act) => {
                        // Determine type icon/colors
                        let IconComponent = Clock
                        let colorClass = "bg-muted text-muted-foreground"
                        
                        switch (act.type) {
                          case "call":
                            IconComponent = Phone
                            colorClass = "bg-blue-500/10 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                            break
                          case "note":
                            IconComponent = FileText
                            colorClass = "bg-amber-500/10 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
                            break
                          case "followup":
                            IconComponent = Calendar
                            colorClass = "bg-purple-500/10 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400"
                            break
                          case "whatsapp":
                            IconComponent = MessageSquare
                            colorClass = "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400"
                            break
                          case "email":
                            IconComponent = Mail
                            colorClass = "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400"
                            break
                          case "system":
                            IconComponent = Sparkles
                            colorClass = "bg-rose-500/10 text-rose-500 dark:bg-rose-900/20 dark:text-rose-400"
                            break
                        }

                        return (
                          <div key={act.id} className="relative group animate-in fade-in-30 duration-200">
                            {/* Dot / Icon */}
                            <div className={cn(
                              "absolute -left-6 top-0.5 h-5.5 w-5.5 rounded-full flex items-center justify-center ring-4 ring-background z-10 shrink-0",
                              colorClass
                            )}>
                              <IconComponent className="h-3 w-3 shrink-0" />
                            </div>

                            {/* Card content */}
                            <div className="bg-card border rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold text-foreground leading-tight">{act.title}</h4>
                                <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 font-semibold block">
                                logged by <span className="text-foreground">{act.userName}</span> • {formatDate(act.timestamp)}
                              </p>
                              <p className="text-sm text-foreground mt-2.5 font-medium leading-relaxed bg-muted/15 p-2 rounded-lg border border-muted/20">
                                {act.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* ----------------------------------------------------
                    TAB CONTENT: ATTACHMENTS (FILES)
                    ---------------------------------------------------- */}
                <TabsContent value="files" className="space-y-6 mt-0">
                  
                  {/* File Dropzone Area */}
                  <div className="relative border-2 border-dashed rounded-2xl p-6 bg-card hover:bg-muted/10 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUploadSimulate}
                      disabled={uploadProgress !== null}
                    />
                    
                    {uploadProgress !== null ? (
                      <div className="w-full max-w-[280px] space-y-3 py-2">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                        <div className="space-y-1 text-center">
                          <h4 className="text-sm font-bold text-foreground truncate">{uploadFileName}</h4>
                          <span className="text-xs text-muted-foreground block font-semibold">Simulating secure cloud upload... {uploadProgress}%</span>
                        </div>
                        {/* Progress Bar container */}
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-150 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-primary">
                          <UploadCloud className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">Secure Vault Dropzone</h4>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                          Drag & drop or <span className="text-primary font-bold">browse</span> files to store contract drafts, RFPs, or pricing sheets.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Attachment Cards Grid */}
                  {attachments.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-2xl bg-muted/10">
                      <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-foreground">No Pinned Attachments</h4>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto mt-1">
                        Keep critical customer files archived directly on their sales hub.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Archived Vault ({attachments.length})</h4>
                      <div className="grid gap-3">
                        {attachments.map((file) => {
                          // Determine type colors/icons
                          let FileIcon = FileText
                          let borderClass = "border-muted"
                          let typeBadgeColor = "bg-muted text-muted-foreground"

                          if (file.type === "pdf") {
                            FileIcon = FileText
                            borderClass = "hover:border-red-500/30"
                            typeBadgeColor = "bg-red-500/10 text-red-500 dark:bg-red-900/20 dark:text-red-400"
                          } else if (file.type === "xlsx") {
                            FileIcon = FileSpreadsheet
                            borderClass = "hover:border-emerald-500/30"
                            typeBadgeColor = "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400"
                          } else if (file.type === "docx") {
                            FileIcon = FileText
                            borderClass = "hover:border-blue-500/30"
                            typeBadgeColor = "bg-blue-500/10 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                          } else if (file.type === "image") {
                            FileIcon = FileImage
                            borderClass = "hover:border-purple-500/30"
                            typeBadgeColor = "bg-purple-500/10 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400"
                          }

                          return (
                            <div 
                              key={file.id} 
                              className={cn(
                                "flex items-center justify-between border bg-card p-3 rounded-2xl shadow-2xs transition-all hover:shadow-xs group/card",
                                borderClass
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-bold",
                                  typeBadgeColor
                                )}>
                                  <FileIcon className="h-5 w-5 shrink-0" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-sm font-bold text-foreground truncate group-hover/card:text-primary transition-colors leading-tight">
                                    {file.name}
                                  </h5>
                                  <span className="text-xs text-muted-foreground block font-semibold mt-0.5">
                                    {file.size} • Uploaded {formatDate(file.uploadedAt)}
                                  </span>
                                </div>
                              </div>

                              {/* Hover actions */}
                              <div className="flex items-center gap-1.5">
                                <Button 
                                  variant="ghost" 
                                  size="icon-xs" 
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => notify.success("Downloading Started", `Retrieving '${file.name}' from secure S3 bucket...`)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon-xs" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteFile(file.id, file.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* ----------------------------------------------------
                    TAB CONTENT: QUOTATIONS
                    ---------------------------------------------------- */}
                <TabsContent value="quotations" className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Negotiations & Estimates ({quotations.length})</h4>
                    <Button 
                      size="sm" 
                      className="h-8 text-xs font-bold gap-1"
                      onClick={handleCreateQuotation}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Create Quote
                    </Button>
                  </div>

                  {quotations.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10">
                      <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-foreground">No Quotations Issued</h4>
                      <p className="text-xs text-muted-foreground max-w-[220px] mx-auto mt-1">
                        Send formal contracts or sales estimates to log quotes here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotations.map((quote) => {
                        // Quote status style
                        let statusColor = "bg-muted text-muted-foreground"
                        if (quote.status === "Accepted") {
                          statusColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-400"
                        } else if (quote.status === "Sent") {
                          statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400"
                        } else if (quote.status === "Expired") {
                          statusColor = "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-900/20 dark:text-rose-400"
                        }

                        return (
                          <div 
                            key={quote.id} 
                            className="bg-card border rounded-2xl p-4 shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-foreground">{quote.quoteNumber}</span>
                                  <Badge className={cn("text-[10px] font-bold py-0.5", statusColor)}>
                                    {quote.status}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground block font-semibold">
                                  Issued {formatDate(quote.date)} • Expires {formatDate(quote.expiryDate)}
                                </span>
                              </div>
                              <span className="text-base font-extrabold text-foreground">
                                {formatCurrency(quote.amount)}
                              </span>
                            </div>

                            <Separator className="my-3 bg-muted/60" />

                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                30-day payment terms
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Button 
                                  variant="ghost" 
                                  size="xs" 
                                  className="text-xs h-7 gap-1 font-semibold hover:bg-muted"
                                  onClick={() => notify.success("Quotation PDF Opened", `Loading client viewer for ${quote.quoteNumber}...`)}
                                >
                                  View PDF
                                </Button>
                                {quote.status === "Sent" && (
                                  <Button 
                                    variant="outline" 
                                    size="xs" 
                                    className="text-xs h-7 font-bold text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600"
                                    onClick={() => {
                                      const updatedQuotes = quotations.map(q => q.id === quote.id ? { ...q, status: "Accepted" as const } : q)
                                      setQuotations(updatedQuotes)
                                      notify.success("Quote Accepted", `${quote.quoteNumber} is now marked as Accepted!`)
                                    }}
                                  >
                                    Accept Quote
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

              </div>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
