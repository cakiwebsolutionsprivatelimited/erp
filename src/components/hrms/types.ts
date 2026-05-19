export interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  avatarUrl?: string
  initials: string
  avatarBg: string // Tailwind background gradient/color class
  status: "Active" | "Inactive" | "On Leave" | "Suspended"
  presence: "Online" | "Offline" | "Away"
  attendance: {
    status: "Present" | "Absent" | "Late" | "Half Day"
    checkInTime?: string
    checkOutTime?: string
  }
  shiftTiming: string
  joiningDate: string
  skills: string[]
  performanceScore: number // Score from 1 to 100
  performanceLabel: "Outstanding" | "Exceeds Expectations" | "Meets Expectations" | "Needs Improvement"
  salary: {
    amount: number
    currency: string
    status: "Paid" | "Processing" | "Pending" | "On Hold"
    lastPaidDate?: string
  }
  leaveBalance: {
    casual: number
    sick: number
    annual: number
    unpaid: number
  }
  lastLogin: string
}
