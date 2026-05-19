import { type Employee } from "./types"

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Jenkins",
    role: "Lead Software Architect",
    department: "Engineering",
    email: "sarah.j@enterprise-erp.com",
    phone: "+1 555 0120",
    initials: "SJ",
    avatarBg: "bg-purple-600 text-white",
    status: "Active",
    presence: "Online",
    attendance: {
      status: "Present",
      checkInTime: "08:45 AM",
      checkOutTime: "05:30 PM"
    },
    shiftTiming: "09:00 AM - 05:00 PM (EST)",
    joiningDate: "2023-03-15",
    skills: ["React", "TypeScript", "Node.js", "System Design", "AWS"],
    performanceScore: 95,
    performanceLabel: "Outstanding",
    salary: {
      amount: 145000,
      currency: "USD",
      status: "Paid",
      lastPaidDate: "2026-04-30"
    },
    leaveBalance: {
      casual: 4,
      sick: 6,
      annual: 14,
      unpaid: 0
    },
    lastLogin: "2026-05-19T08:30:00Z"
  },
  {
    id: "EMP002",
    name: "Michael Chang",
    role: "Senior UX Designer",
    department: "Product Design",
    email: "michael.c@enterprise-erp.com",
    phone: "+1 555 0145",
    initials: "MC",
    avatarBg: "bg-indigo-600 text-white",
    status: "Active",
    presence: "Away",
    attendance: {
      status: "Late",
      checkInTime: "09:40 AM"
    },
    shiftTiming: "09:00 AM - 05:00 PM (EST)",
    joiningDate: "2024-01-10",
    skills: ["Figma", "User Research", "Tailwind CSS", "Prototyping"],
    performanceScore: 88,
    performanceLabel: "Exceeds Expectations",
    salary: {
      amount: 110000,
      currency: "USD",
      status: "Paid",
      lastPaidDate: "2026-04-30"
    },
    leaveBalance: {
      casual: 2,
      sick: 4,
      annual: 10,
      unpaid: 0
    },
    lastLogin: "2026-05-19T09:35:00Z"
  },
  {
    id: "EMP003",
    name: "David Vance",
    role: "Sales Executive",
    department: "Sales & Marketing",
    email: "david.v@enterprise-erp.com",
    phone: "+1 555 0192",
    initials: "DV",
    avatarBg: "bg-amber-600 text-white",
    status: "On Leave",
    presence: "Offline",
    attendance: {
      status: "Absent"
    },
    shiftTiming: "09:00 AM - 05:00 PM (EST)",
    joiningDate: "2024-06-01",
    skills: ["CRM Logistics", "Client Relations", "Cold Outreach", "Negotiations"],
    performanceScore: 79,
    performanceLabel: "Meets Expectations",
    salary: {
      amount: 85000,
      currency: "USD",
      status: "Processing",
      lastPaidDate: "2026-04-30"
    },
    leaveBalance: {
      casual: 0,
      sick: 2,
      annual: 3,
      unpaid: 2
    },
    lastLogin: "2026-05-16T17:10:00Z"
  },
  {
    id: "EMP004",
    name: "Emma Stone",
    role: "HR Generalist",
    department: "Human Resources",
    email: "emma.s@enterprise-erp.com",
    phone: "+1 555 0205",
    initials: "ES",
    avatarBg: "bg-emerald-600 text-white",
    status: "Active",
    presence: "Online",
    attendance: {
      status: "Present",
      checkInTime: "08:55 AM"
    },
    shiftTiming: "08:30 AM - 04:30 PM (EST)",
    joiningDate: "2023-08-20",
    skills: ["Conflict Resolution", "Talent Acquisition", "ERP Onboarding", "Compliance"],
    performanceScore: 92,
    performanceLabel: "Outstanding",
    salary: {
      amount: 95000,
      currency: "USD",
      status: "Paid",
      lastPaidDate: "2026-04-30"
    },
    leaveBalance: {
      casual: 5,
      sick: 8,
      annual: 15,
      unpaid: 0
    },
    lastLogin: "2026-05-19T08:45:00Z"
  },
  {
    id: "EMP005",
    name: "Richard Hendricks",
    role: "Senior Security Specialist",
    department: "Information Security",
    email: "richard.h@enterprise-erp.com",
    phone: "+1 555 0300",
    initials: "RH",
    avatarBg: "bg-rose-600 text-white",
    status: "Suspended",
    presence: "Offline",
    attendance: {
      status: "Absent"
    },
    shiftTiming: "10:00 AM - 06:00 PM (EST)",
    joiningDate: "2025-11-01",
    skills: ["Data Contaminations", "Encryption Keys", "Private Cloud Hosting", "Penetration Testing"],
    performanceScore: 45,
    performanceLabel: "Needs Improvement",
    salary: {
      amount: 130000,
      currency: "USD",
      status: "On Hold",
      lastPaidDate: "2026-03-31"
    },
    leaveBalance: {
      casual: 1,
      sick: 3,
      annual: 8,
      unpaid: 5
    },
    lastLogin: "2026-05-12T14:00:00Z"
  }
]
