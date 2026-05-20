import React, { useState, useEffect } from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { 
  MOCK_EMPLOYEES, 
  EmployeeCompactCard, 
  EmployeeProfileCard, 
  EmployeeManagementRow, 
  type Employee 
} from "@/components/hrms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { notify } from "@/services/notificationService"
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  LayoutGrid, 
  ListOrdered
} from "lucide-react"

import { useAppSelector, useAppDispatch } from "@/store"
import { resetSearchQuery } from "@/store/features/searchSlice"

export default function HRMSPage() {
  const dispatch = useAppDispatch()
  // Page state
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([])
  const [activeProfileEmpId, setActiveProfileEmpId] = useState<string>("EMP001")
  const [isLoading] = useState(false)

  const searchQuery = useAppSelector((state) => state.search.query)

  // Reset the search input value when navigating away
  useEffect(() => {
    return () => {
      dispatch(resetSearchQuery())
    }
  }, [dispatch])

  const filteredEmployees = employees.filter(emp => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.skills.some(s => s.toLowerCase().includes(query))
    );
  });

  // Find active employee for the profile card inspection
  const activeEmployee = employees.find(e => e.id === activeProfileEmpId) || employees[0]

  // Handle individual checkbox selection
  const handleSelectEmployee = (empId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmpIds(prev => [...prev, empId])
    } else {
      setSelectedEmpIds(prev => prev.filter(id => id !== empId))
    }
  }

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmpIds(employees.map(e => e.id))
    } else {
      setSelectedEmpIds([])
    }
  }

  // Handle dynamic operations from row/cards
  const handleEmployeeAction = (action: string, emp: Employee) => {
    switch (action) {
      case "view_profile":
        setActiveProfileEmpId(emp.id)
        notify.info("Profile Loaded", `Loaded ${emp.name}'s statistics in detail view.`)
        break

      case "send_email":
        notify.success("Email Draft Generated", `Draft sent to ${emp.email} with standard contract files.`)
        break

      case "send_message":
        notify.success("Chat Connected", `Initiated high-security chat sync with ${emp.name}.`)
        break

      case "process_payroll":
        // Update specific employee payroll status to Paid
        setEmployees(prev => prev.map(e => 
          e.id === emp.id 
            ? { ...e, salary: { ...e.salary, status: "Paid" as const } }
            : e
        ))
        notify.success("Payroll Dispatched", `Approved & processed monthly payroll of $${(emp.salary.amount / 12).toLocaleString()} for ${emp.name}.`)
        break

      case "terminate_employee":
        setEmployees(prev => prev.filter(e => e.id !== emp.id))
        setSelectedEmpIds(prev => prev.filter(id => id !== emp.id))
        notify.error("Contract Terminated", `${emp.name} has been archived in active staff database.`)
        break

      case "refresh_audit":
        setEmployees(prev => prev.map(e => 
          e.id === emp.id 
            ? { ...e, leaveBalance: { ...e.leaveBalance, annual: 15, sick: 10, casual: 5 } }
            : e
        ))
        notify.success("Leave Restored", `Reset standard allowances for ${emp.name} (15 Annual, 10 Sick, 5 Casual days).`)
        break

      default:
        notify.info("Action Triggered", `Triggered '${action}' on employee ${emp.name}.`)
    }
  }

  // Bulk payroll approval
  const handleBulkApprovePayroll = () => {
    if (selectedEmpIds.length === 0) {
      notify.warning("No Selection", "Please check at least one employee row first.")
      return
    }

    setEmployees(prev => prev.map(e => 
      selectedEmpIds.includes(e.id)
        ? { ...e, salary: { ...e.salary, status: "Paid" as const } }
        : e
    ))
    notify.success("Bulk Approval", `Processed payroll for ${selectedEmpIds.length} checked staff members!`)
    setSelectedEmpIds([])
  }

  const handleAddNewStaff = () => {
    notify.info("Showcase Notice", "Launching 'Add New Personnel' wizard simulation.")
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Human Resource Management System (HRMS)"
        description="Oversee corporate directory, track daily check-ins, approve payroll, and audit leave structures."
        action={
          <Button onClick={handleAddNewStaff} className="font-bold shadow-sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Personnel
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Side: Attendance Preview Panel (EmployeeCompactCard) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staff Attendance Preview</h3>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold border-transparent">
                Dashboard Widget
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Live attendance stream from office entry turnstiles. Click three dots to view full profiles.
            </p>
            
            <Separator className="bg-muted" />

            <div className="space-y-2.5">
              {filteredEmployees.map(emp => (
                <EmployeeCompactCard
                  key={emp.id}
                  employee={emp}
                  isLoading={isLoading}
                  onAction={handleEmployeeAction}
                />
              ))}
            </div>
          </div>

          {/* Profile Inspector View Card (EmployeeProfileCard) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personnel Inspector Card</span>
              <Badge className="bg-indigo-500/10 text-indigo-500 border-transparent hover:bg-indigo-500/20 font-bold">
                Directory Inspector
              </Badge>
            </div>
            <EmployeeProfileCard
              employee={activeEmployee}
              isLoading={isLoading}
              onAction={handleEmployeeAction}
            />
          </div>
        </div>

        {/* Right Side: Tabular HR Directory / Payroll Row (EmployeeManagementRow) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <Tabs defaultValue="management" className="w-full flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b pb-3">
              <TabsList variant="line" className="h-10 bg-transparent rounded-none gap-6 p-0 border-none">
                <TabsTrigger value="management" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
                  <ListOrdered className="h-4 w-4" />
                  Management & Payroll Row List
                </TabsTrigger>
                <TabsTrigger value="directory" className="h-full border-b-2 rounded-none px-1 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Grid Directory Cards View
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB CONTENT 1: MANAGEMENT TAB (EmployeeManagementRow) */}
            <TabsContent value="management" className="space-y-4 mt-4">
              
              {/* Batch Actions Bar */}
              <div className="bg-muted/30 border border-dashed p-3 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Checkbox 
                    checked={selectedEmpIds.length === employees.length && employees.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label="Select all employees"
                    className="h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {selectedEmpIds.length > 0 
                      ? `${selectedEmpIds.length} Employees checked` 
                      : "Check rows for batch processing"}
                  </span>
                </div>
                {selectedEmpIds.length > 0 && (
                  <Button 
                    size="sm" 
                    className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-600/90 text-white gap-1.5"
                    onClick={handleBulkApprovePayroll}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    Approve Payroll Selected
                  </Button>
                )}
              </div>

              {/* Rows List */}
              <div className="space-y-3">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-16 border border-dashed rounded-3xl bg-muted/10">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h4 className="text-sm font-bold">Personnel Roster is Empty</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery ? "No employees match your search query." : "Click 'Add New Personnel' to begin enrolling staff."}
                    </p>
                  </div>
                ) : (
                  filteredEmployees.map(emp => (
                    <EmployeeManagementRow
                      key={emp.id}
                      employee={emp}
                      isSelected={selectedEmpIds.includes(emp.id)}
                      onSelectChange={(checked) => handleSelectEmployee(emp.id, checked)}
                      isLoading={isLoading}
                      onAction={handleEmployeeAction}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* TAB CONTENT 2: DIRECTORY GRID VIEW (EmployeeProfileCard Grid) */}
            <TabsContent value="directory" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredEmployees.map(emp => (
                  <EmployeeProfileCard
                    key={emp.id}
                    employee={emp}
                    isLoading={isLoading}
                    onAction={handleEmployeeAction}
                  />
                ))}
              </div>
            </TabsContent>

          </Tabs>

        </div>

      </div>
    </PageContainer>
  )
}
