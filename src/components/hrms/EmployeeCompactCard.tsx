import React from "react"
import { MoreHorizontal, User, Mail, Calendar, CheckCircle, Clock, AlertTriangle, UserX } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { type Employee } from "./types"
import { cn } from "@/utils"

interface EmployeeCompactCardProps {
  employee?: Employee | null
  isLoading?: boolean
  onAction?: (action: string, employee: Employee) => void
}

export function EmployeeCompactCard({
  employee,
  isLoading = false,
  onAction
}: EmployeeCompactCardProps) {
  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border rounded-2xl animate-pulse">
        <div className="relative shrink-0">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4.5 w-2/3 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>
    )
  }

  // Empty State
  if (!employee) {
    return (
      <div className="flex items-center justify-center p-4 border border-dashed rounded-2xl bg-muted/20 text-center">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
          <UserX className="h-4 w-4 shrink-0" />
          <span>No Employee Selected</span>
        </div>
      </div>
    )
  }

  // Presence Color Indicators
  const presenceColors = {
    Online: "bg-emerald-500 ring-emerald-500",
    Away: "bg-amber-500 ring-amber-500",
    Offline: "bg-muted-foreground/30 ring-background dark:ring-card",
  }

  // Attendance Badges
  const getAttendanceBadge = (status: Employee["attendance"]["status"]) => {
    switch (status) {
      case "Present":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent font-bold py-0 px-1.5 text-[10px] gap-0.5">
            <CheckCircle className="h-2.5 w-2.5" />
            In
          </Badge>
        )
      case "Late":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-transparent font-bold py-0 px-1.5 text-[10px] gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            Late
          </Badge>
        )
      case "Half Day":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-transparent font-bold py-0 px-1.5 text-[10px] gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            Half
          </Badge>
        )
      default:
        return (
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-transparent font-bold py-0 px-1.5 text-[10px] gap-0.5">
            <AlertTriangle className="h-2.5 w-2.5" />
            Out
          </Badge>
        )
    }
  }

  return (
    <div
      onClick={() => onAction?.("view_profile", employee)}
      className="flex items-center gap-3 p-3 bg-card border rounded-2xl shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all group cursor-pointer"
    >
      {/* Avatar with Presence Indicator */}
      <div className="relative shrink-0">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform",
          employee.avatarBg
        )}>
          {employee.initials}
        </div>
        {/* Presence Indicator Dot */}
        <span className={cn(
          "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background block",
          presenceColors[employee.presence]
        )} />
      </div>

      {/* Name and Designation Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
          {employee.name}
        </h4>
        <span className="text-xs text-muted-foreground truncate block mt-0.5 font-medium">
          {employee.role}
        </span>
      </div>

      {/* Attendance & Dropdown Action */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="flex flex-col items-end gap-0.5">
          {getAttendanceBadge(employee.attendance.status)}
          {employee.attendance.checkInTime && (
            <span className="text-[9px] font-bold text-muted-foreground tracking-tight">
              {employee.attendance.checkInTime}
            </span>
          )}
        </div>

        {/* Action Dropdown Menu */}
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted" size="icon-sm">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.("view_profile", employee)}>
                <User className="mr-2 h-3.5 w-3.5" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("send_email", employee)}>
                <Mail className="mr-2 h-3.5 w-3.5" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("log_attendance", employee)}>
                <Calendar className="mr-2 h-3.5 w-3.5" />
                Edit Shift
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
