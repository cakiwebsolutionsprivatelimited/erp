import React, { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  MessageSquare,
  Sparkles,
  UserCheck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { notify } from "@/services/notificationService"
import { type Employee } from "./types"
import { cn } from "@/utils"

interface EmployeeProfileCardProps {
  employee?: Employee | null
  isLoading?: boolean
  onAction?: (action: string, employee: Employee) => void
}

export function EmployeeProfileCard({
  employee,
  isLoading = false,
  onAction
}: EmployeeProfileCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    notify.info("Copied to Clipboard", `${label} copied.`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
        {/* Cover Header height placeholder */}
        <div className="h-20 bg-muted/40" />
        
        {/* Large Avatar and identity placeholder */}
        <div className="px-6 pb-6 flex-1 space-y-6 relative -mt-8">
          <div className="flex justify-between items-end">
            <Skeleton className="h-16 w-16 rounded-full border-4 border-card" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <Skeleton className="h-4.5 w-1/3 rounded-md" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-6 w-full" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-6 w-full" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-6 w-full" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-6 w-full" /></div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-1/4" />
            <div className="flex gap-1.5"><Skeleton className="h-5 w-12" /><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-14" /></div>
          </div>
          <Separator className="mt-auto" />
          <div className="flex gap-2 pt-2"><Skeleton className="h-9 flex-1" /><Skeleton className="h-9 w-10" /></div>
        </div>
      </div>
    )
  }

  // Empty State
  if (!employee) {
    return (
      <div className="bg-card border rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
          <User className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h4 className="text-base font-bold text-foreground">No Profile Loaded</h4>
        <p className="text-xs text-muted-foreground max-w-[200px] mt-1.5">
          Select an employee from the roster to inspect their deep metrics and organizational performance.
        </p>
      </div>
    )
  }

  // Performance Colors mapping
  const getPerformanceClass = (label: Employee["performanceLabel"]) => {
    switch (label) {
      case "Outstanding":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-900/20"
      case "Exceeds Expectations":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20 dark:bg-purple-900/20"
      case "Meets Expectations":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-900/20"
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-900/20"
    }
  }

  const presenceColors = {
    Online: "bg-emerald-500",
    Away: "bg-amber-500",
    Offline: "bg-muted-foreground/30",
  }

  return (
    <div className="bg-card border rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-muted-foreground/20 transition-all flex flex-col h-full group">
      {/* Decorative Gradient Header Card */}
      <div className="h-20 bg-gradient-to-r from-primary/10 via-muted/5 to-primary/15 relative border-b" />

      {/* Profile details & Info */}
      <div className="px-6 pb-6 flex-1 flex flex-col space-y-5 relative -mt-9">
        
        {/* Avatar overlay row */}
        <div className="flex justify-between items-end">
          <div className="relative shrink-0">
            <div className={cn(
              "h-18 w-18 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md border-4 border-card bg-popover",
              employee.avatarBg
            )}>
              {employee.initials}
            </div>
            {/* Presence indicator ring */}
            <span className={cn(
              "absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full border-4 border-card flex items-center justify-center",
              presenceColors[employee.presence]
            )} />
          </div>

          <Badge className="bg-muted text-muted-foreground border-transparent font-bold py-0.5 px-2 text-[10px] uppercase tracking-wider">
            {employee.status}
          </Badge>
        </div>

        {/* Identity & Core Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
              {employee.name}
            </h3>
            {employee.performanceScore >= 90 && (
              <Sparkles className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground block leading-tight mt-0.5">
            {employee.role} • <span className="text-foreground">{employee.department}</span>
          </span>
        </div>

        <Separator className="bg-muted" />

        {/* Core contact details 2x2 grid */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-y-3 gap-x-2">
          
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Email Address</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground group/mail min-w-0">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{employee.email}</span>
              <button 
                onClick={() => handleCopy(employee.email, "Email")}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground opacity-0 group-hover/mail:opacity-100 transition-opacity shrink-0 cursor-pointer"
              >
                {copiedField === "Email" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-2.5 w-2.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Phone</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground group/phone min-w-0">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{employee.phone}</span>
              <button 
                onClick={() => handleCopy(employee.phone, "Phone")}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground opacity-0 group-hover/phone:opacity-100 transition-opacity shrink-0 cursor-pointer"
              >
                {copiedField === "Phone" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-2.5 w-2.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Shift Timing</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground min-w-0">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{employee.shiftTiming.split(" ")[0]} hrs</span>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Date Joined</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground min-w-0">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">
                {new Date(employee.joiningDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

        </div>

        {/* Performance score Gauge card */}
        <div className={cn("border rounded-2xl p-3 flex items-center justify-between shadow-2xs", getPerformanceClass(employee.performanceLabel))}>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-70">KPI Rating score</span>
            <h4 className="text-xs font-extrabold leading-none">{employee.performanceLabel}</h4>
          </div>
          <div className="text-right">
            <span className="text-base font-black leading-none">{employee.performanceScore}</span>
            <span className="text-[10px] font-bold block opacity-70">out of 100</span>
          </div>
        </div>

        {/* Skills Tag block */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Core Proficiencies</span>
          <div className="flex flex-wrap gap-1">
            {employee.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px] py-0.5 px-2 bg-muted/40 font-medium hover:bg-muted">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-muted mt-auto" />

        {/* Action controls footer */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            className="flex-1 text-xs font-bold h-9 shadow-sm"
            onClick={() => onAction?.("view_profile", employee)}
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            Manage Profile
          </Button>
          <Button 
            variant="outline" 
            className="h-9 w-9 p-0 hover:bg-muted transition-colors shrink-0"
            onClick={() => onAction?.("send_message", employee)}
          >
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground shrink-0" />
          </Button>
        </div>

      </div>
    </div>
  )
}
