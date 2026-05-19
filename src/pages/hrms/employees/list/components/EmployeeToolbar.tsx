import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, SlidersHorizontal, Download, RefreshCw, 
  Users, UserCheck, CalendarDays, GraduationCap, BarChart3, HelpCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmployeeToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onToggleFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  activeFiltersCount: number;
  stats: {
    total: number;
    active: number;
    onLeave: number;
    probation: number;
    averageCompleteness: number;
  };
}

export const EmployeeToolbar: React.FC<EmployeeToolbarProps> = ({
  search,
  onSearchChange,
  onToggleFilters,
  onExport,
  onRefresh,
  activeFiltersCount,
  stats
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      
      {/* 1. Statistics Cards Grid Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Total */}
        <div className="border p-4 rounded-3xl bg-card flex items-center gap-3.5 shadow-2xs">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Directory</span>
            <span className="text-xl font-extrabold text-foreground block mt-0.5">{stats.total}</span>
          </div>
        </div>

        {/* Stat 2: Active */}
        <div className="border p-4 rounded-3xl bg-card flex items-center gap-3.5 shadow-2xs">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Personnel</span>
            <span className="text-xl font-extrabold text-foreground block mt-0.5">{stats.active}</span>
          </div>
        </div>

        {/* Stat 3: On Leave */}
        <div className="border p-4 rounded-3xl bg-card flex items-center gap-3.5 shadow-2xs">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">On Leave</span>
            <span className="text-xl font-extrabold text-foreground block mt-0.5">{stats.onLeave}</span>
          </div>
        </div>

        {/* Stat 4: Probation */}
        <div className="border p-4 rounded-3xl bg-card flex items-center gap-3.5 shadow-2xs">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Probationary</span>
            <span className="text-xl font-extrabold text-foreground block mt-0.5">{stats.probation}</span>
          </div>
        </div>

        {/* Stat 5: Average completeness */}
        <div className="border p-4 rounded-3xl bg-card flex items-center gap-3.5 col-span-2 lg:col-span-1 shadow-2xs">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Avg Completeness</span>
            <span className="text-xl font-extrabold text-foreground block mt-0.5">{stats.averageCompleteness}%</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by candidate name, email, designation..."
            className="pl-10 pr-4 h-10 rounded-xl bg-card border font-semibold text-foreground focus-visible:ring-1"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Advanced Filters Button */}
          <Button
            type="button"
            variant="outline"
            onClick={onToggleFilters}
            className="h-10 rounded-xl border text-xs font-bold border-muted gap-2 relative bg-card cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1.5 rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground flex items-center justify-center border-2 border-background">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Excel Export Button */}
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-10 rounded-xl border text-xs font-bold border-muted gap-2 bg-card cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>

          {/* Refresh/Reload Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-10 w-10 border rounded-xl border-muted hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Add Employee Redirect Button */}
          <Button
            type="button"
            onClick={() => navigate('/hrms/employees/add')}
            className="h-10 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Enroll Staff
          </Button>
        </div>
      </div>

    </div>
  );
};

export default EmployeeToolbar;
