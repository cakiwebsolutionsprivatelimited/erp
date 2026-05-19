import React, { useState, useMemo } from 'react';
import { PageContainer, SectionHeader } from '@/components/common/PageLayout';
import { useEmployees } from './hooks/useEmployees';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { exportEmployeesToExcel } from './utils/exportEmployees';
import { getEmployeeDirectoryStats } from './utils/employeeHelpers';
import { DEPARTMENTS, STATUSES } from './constants/employeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeToolbar } from './components/EmployeeToolbar';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeQuickView } from './components/EmployeeQuickView';
import { EmployeeEditDrawer } from './components/EmployeeEditDrawer';
import type { Employee } from './types/employee.types';
import { 
  FolderHeart, Trash2, X, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const EmployeeListPage: React.FC = () => {
  const {
    employees,
    selectedIds,
    isLoading,
    fetchEmployees,
    updateEmployee,
    deleteEmployee,
    bulkDelete,
    bulkUpdateDepartment,
    bulkUpdateStatus,
    setSelectedIds
  } = useEmployees();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredEmployees,
    activeFiltersCount,
    isDrawerOpen,
    setIsDrawerOpen
  } = useEmployeeFilters(employees);

  // Stats
  const stats = useMemo(() => getEmployeeDirectoryStats(employees), [employees]);

  // Selected Employee profile quick view and edit folder states
  const [activeQuickViewEmp, setActiveQuickViewEmp] = useState<Employee | null>(null);
  const [activeEditEmp, setActiveEditEmp] = useState<Employee | null>(null);

  // Bulk actions status change or department change
  const handleBulkExport = () => {
    // Only export columns selected or visible by default
    const visibleKeys = ['id', 'fullName', 'email', 'mobile', 'department', 'designation', 'joiningDate', 'status', 'workMode', 'workLocation'];
    exportEmployeesToExcel(employees, selectedIds, visibleKeys);
  };

  const handleSingleExport = () => {
    const visibleKeys = ['id', 'fullName', 'email', 'mobile', 'department', 'designation', 'joiningDate', 'status', 'workMode', 'workLocation'];
    exportEmployeesToExcel(employees, [], visibleKeys);
  };

  return (
    <PageContainer>
      
      {/* 1. Header with Breadcrumbs and Count Stats */}
      <div className="space-y-1 pb-4">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>HRMS</span>
          <span>/</span>
          <span>Employees</span>
          <span>/</span>
          <span className="text-primary">Employee List</span>
        </div>
        
        <SectionHeader
          title="Personnel & Corporate Directory"
          description="Faceted lookup database detailing employee coordinates, gate access clearances, and active payroll sync logs."
          action={
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-transparent font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase shrink-0">
                Staff count: {stats.total}
              </Badge>
            </div>
          }
        />
      </div>

      {/* 2. Primary Toolbars & Stats Cards */}
      <div className="mt-2 space-y-6">
        <EmployeeToolbar
          search={filters.search}
          onSearchChange={(val) => updateFilter('search', val)}
          onToggleFilters={() => setIsDrawerOpen(true)}
          onExport={handleSingleExport}
          onRefresh={fetchEmployees}
          activeFiltersCount={activeFiltersCount}
          stats={stats}
        />

        {/* 3. TanStack Table Container */}
        <div className="border rounded-3xl p-5 bg-card shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs font-bold text-foreground block">Active Workforce Directory</span>
              <p className="text-[10px] text-muted-foreground font-semibold">Select rows for batch updates. Archive hides folders from active rosters.</p>
            </div>
          </div>

          <EmployeeTable
            data={filteredEmployees}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onView={(emp) => setActiveQuickViewEmp(emp)}
            onEdit={(emp) => setActiveEditEmp(emp)}
            onDelete={(id) => deleteEmployee(id)}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 4. Sliding Advanced Filters Panel */}
      <EmployeeFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeCount={activeFiltersCount}
      />

      {/* 5. Quick Profile Inspector Overlay */}
      <EmployeeQuickView
        employee={activeQuickViewEmp}
        isOpen={activeQuickViewEmp !== null}
        onClose={() => setActiveQuickViewEmp(null)}
      />

      {/* 6. In-Context Employee Edit Drawer */}
      <EmployeeEditDrawer
        employee={activeEditEmp}
        isOpen={activeEditEmp !== null}
        onClose={() => setActiveEditEmp(null)}
        onSave={(id, data) => updateEmployee(id, data)}
      />

      {/* 7. Bottom Floating Bulk Actions Roster */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground dark:bg-zinc-900 border text-background dark:text-foreground rounded-3xl p-4 shadow-2xl w-full max-w-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-background/10 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <FolderHeart className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold block">{selectedIds.length} personnel checked</span>
              <p className="text-[9px] opacity-75 leading-relaxed font-semibold">Authorized multi-action sync is active.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            {/* Bulk Department */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-[10px] font-bold rounded-xl bg-background border-none text-foreground cursor-pointer gap-1"
                >
                  Change Department
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl w-[150px]">
                <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Select Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DEPARTMENTS.map(dept => (
                  <DropdownMenuItem 
                    key={dept}
                    onClick={() => bulkUpdateDepartment(dept)}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-[10px] font-bold rounded-xl bg-background border-none text-foreground cursor-pointer gap-1"
                >
                  Set Status
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl w-[150px]">
                <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Select Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUSES.map(st => (
                  <DropdownMenuItem 
                    key={st}
                    onClick={() => bulkUpdateStatus(st as Employee['status'])}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    {st}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Excel Export */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="h-9 text-[10px] font-bold rounded-xl bg-background border-none text-foreground cursor-pointer"
            >
              Export Selected
            </Button>

            {/* Bulk Delete */}
            <Button
              type="button"
              size="sm"
              onClick={bulkDelete}
              className="h-9 text-[10px] font-bold rounded-xl bg-rose-600 hover:bg-rose-600/90 text-white cursor-pointer gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Archive
            </Button>

            {/* Close / Deselect */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSelectedIds([])}
              className="h-9 w-9 text-background/60 hover:text-background dark:text-foreground/60 dark:hover:text-foreground hover:bg-background/10 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default EmployeeListPage;
