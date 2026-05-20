import React from "react"
import { MoreHorizontal, User, DollarSign, Calendar, RefreshCcw, Trash2, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { type Employee } from "./types"
import { cn } from "@/utils"

interface EmployeeManagementRowProps {
  employee?: Employee | null
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
  isLoading?: boolean
  onAction?: (action: string, employee: Employee) => void
}

export function EmployeeManagementRow({
  employee,
  isSelected = false,
  onSelectChange,
  isLoading = false,
  onAction
}: EmployeeManagementRowProps) {

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border rounded-2xl animate-pulse gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-4 w-4 rounded shrink-0" />
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-1/4 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 w-full sm:w-auto ml-11 sm:ml-0 pr-12 sm:pr-0">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <Skeleton className="absolute right-4 sm:relative sm:right-auto h-8 w-8 rounded-md shrink-0" />
      </div>
    )
  }

  // Empty State
  if (!employee) {
    return (
      <div className="flex items-center justify-center p-4 border border-dashed rounded-2xl bg-muted/20">
        <span className="text-xs text-muted-foreground font-semibold">No Employee Row Available</span>
      </div>
    )
  }

  // Helper: Formatting salary
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Helper: Format relative dates
  const formatRelativeDate = (dateStr: string) => {
    if (!dateStr) return "Never"
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    if (diffDays === 1) {
      return "Yesterday"
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Helper: Reusable Employee Status Badge
  const getEmployeeStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="success" className="font-bold py-0 px-2 text-[10px] gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Active
          </Badge>
        )
      case "On Leave":
        return (
          <Badge variant="warning" className="font-bold py-0 px-2 text-[10px] gap-1">
            <Calendar className="h-2.5 w-2.5" />
            On Leave
          </Badge>
        )
      case "Suspended":
        return (
          <Badge variant="destructive" className="font-bold py-0 px-2 text-[10px] gap-1">
            <ShieldAlert className="h-2.5 w-2.5" />
            Suspended
          </Badge>
        )
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-transparent font-bold py-0 px-2 text-[10px] gap-1">
            <User className="h-2.5 w-2.5" />
            Inactive
          </Badge>
        )
    }
  }

  // Helper: Salary Status badge
  const getSalaryStatusBadge = (sal: Employee["salary"]) => {
    switch (sal.status) {
      case "Paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent font-extrabold text-[10px] py-0 px-2">
            Paid
          </Badge>
        )
      case "Processing":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-transparent font-extrabold text-[10px] py-0 px-2">
            Processing
          </Badge>
        )
      case "On Hold":
        return (
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-transparent font-extrabold text-[10px] py-0 px-2">
            On Hold
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-transparent font-extrabold text-[10px] py-0 px-2">
            Pending
          </Badge>
        )
    }
  }

  // Total Leaves Calculator
  const totalLeaveBalance = employee.leaveBalance.annual + employee.leaveBalance.sick + employee.leaveBalance.casual

  return (
    <div 
      onClick={() => onAction?.("view_profile", employee)}
      className={cn(
        "relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border rounded-2xl shadow-2xs gap-4 transition-all hover:shadow-xs group/row cursor-pointer",
        isSelected ? "border-primary/50 bg-primary/5 dark:bg-primary/2" : "hover:border-primary/20"
      )}
    >
      
      {/* Left Area: Checkbox, Avatar, Identity Info */}
      <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
        
        {/* Row Checkbox Selector */}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelectChange?.(!!checked)}
            aria-label={`Select ${employee.name}`}
            className="h-4 w-4 shrink-0 transition-all cursor-pointer"
          />
        </div>

        {/* Circular initials avatar */}
        <div className="relative shrink-0">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs group-hover/row:scale-105 transition-transform",
            employee.avatarBg
          )}>
            {employee.initials}
          </div>
          {/* Presence Indicator Badge */}
          <span className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background block",
            employee.presence === "Online" ? "bg-emerald-500" : employee.presence === "Away" ? "bg-amber-500" : "bg-muted-foreground/30"
          )} />
        </div>

        {/* Identity Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-extrabold text-foreground leading-tight group-hover/row:text-primary transition-colors truncate">
              {employee.name}
            </h4>
            {employee.performanceScore >= 95 && (
              <Sparkles className="h-3 w-3 text-rose-500 shrink-0" />
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate block mt-0.5 font-semibold">
            {employee.role} • <span className="text-foreground">{employee.department}</span>
          </span>
        </div>

      </div>

      {/* Middle Content: Leaves, Salary, Login metrics */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-start sm:justify-end w-full sm:w-auto sm:shrink-0 ml-11 sm:ml-0 pr-12 sm:pr-0">
        
        {/* Leaves Breakdown */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Leave Balance</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="outline" className="text-[9px] font-bold py-0 px-1 bg-muted/40 hover:bg-muted">
              {totalLeaveBalance}d Total
            </Badge>
            <span className="text-[10px] text-muted-foreground font-semibold">
              ({employee.leaveBalance.annual}a • {employee.leaveBalance.sick}s)
            </span>
          </div>
        </div>

        {/* Salary Status */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Payroll Status</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-extrabold text-foreground">
              {formatSalary(employee.salary.amount / 12)}/mo
            </span>
            {getSalaryStatusBadge(employee.salary)}
          </div>
        </div>

        {/* Last Login Tracker */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Last Activity</span>
          <span className="text-xs font-semibold text-foreground mt-0.5 block">
            {formatRelativeDate(employee.lastLogin)}
          </span>
        </div>

        {/* Reusable status badge */}
        <div className="shrink-0 min-w-[85px] sm:text-right">
          <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">HR Status</span>
          {getEmployeeStatusBadge(employee.status)}
        </div>

      </div>

      {/* Right Area: Action Dropdown */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute right-4 sm:relative sm:right-auto shrink-0 self-center sm:self-auto"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted" size="icon-sm">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover/row:text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Administrative Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction?.("edit_profile", employee)}>
              <User className="mr-2 h-3.5 w-3.5" />
              Edit Job Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.("process_payroll", employee)}>
              <DollarSign className="mr-2 h-3.5 w-3.5 text-emerald-500" />
              Approve Payroll
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.("refresh_audit", employee)}>
              <RefreshCcw className="mr-2 h-3.5 w-3.5 text-blue-500" />
              Reset Leave Balance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => onAction?.("terminate_employee", employee)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Terminate Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  )
}
