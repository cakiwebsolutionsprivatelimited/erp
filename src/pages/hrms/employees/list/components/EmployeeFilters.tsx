import React from 'react';
import type { FilterState } from '../hooks/useEmployeeFilters';
import { DEPARTMENTS, DESIGNATIONS, WORK_LOCATIONS, STATUSES, EMPLOYMENT_TYPES, WORK_MODES } from '../constants/employeeFilters';
import { X, Filter, RefreshCw, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface EmployeeFiltersProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeCount: number;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  updateFilter,
  resetFilters,
  isOpen,
  onClose,
  activeCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xs cursor-pointer transition-opacity" 
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-card border-l shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-350 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Advanced Directory Filters</h3>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {activeCount > 0 ? `${activeCount} filters active` : 'No filters applied'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Form Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
          
          {/* Department Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Corporate Department
            </Label>
            <Select 
              value={filters.department} 
              onValueChange={(val) => updateFilter('department', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Departments</SelectItem>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Designation Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Official Designation</Label>
            <Select 
              value={filters.designation} 
              onValueChange={(val) => updateFilter('designation', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Designations" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Designations</SelectItem>
                {DESIGNATIONS.map(des => (
                  <SelectItem key={des} value={des}>{des}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Employee Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(val) => updateFilter('status', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Statuses</SelectItem>
                {STATUSES.map(st => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Work Mode Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Operating Work Mode</Label>
            <Select 
              value={filters.workMode} 
              onValueChange={(val) => updateFilter('workMode', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Work Modes" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Work Modes</SelectItem>
                {WORK_MODES.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employment Type Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Employment Type</Label>
            <Select 
              value={filters.employmentType} 
              onValueChange={(val) => updateFilter('employmentType', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Types</SelectItem>
                {EMPLOYMENT_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Work Location Select */}
          <div className="space-y-1.5">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Office Location
            </Label>
            <Select 
              value={filters.workLocation} 
              onValueChange={(val) => updateFilter('workLocation', val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">All Locations</SelectItem>
                {WORK_LOCATIONS.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Joining Date Range */}
          <div className="space-y-2 border-t pt-4">
            <Label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Joining Date Bounds
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-muted-foreground block">Joined After</span>
                <Input 
                  type="date" 
                  value={filters.joiningDateStart}
                  onChange={(e) => updateFilter('joiningDateStart', e.target.value)}
                  className="rounded-xl h-9 bg-background font-mono px-2"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-muted-foreground block">Joined Before</span>
                <Input 
                  type="date" 
                  value={filters.joiningDateEnd}
                  onChange={(e) => updateFilter('joiningDateEnd', e.target.value)}
                  className="rounded-xl h-9 bg-background font-mono px-2"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t shrink-0 flex gap-3 bg-muted/20">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex-1 rounded-xl h-10 gap-1.5 text-xs font-bold border-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset All
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 rounded-xl h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground"
          >
            Apply Filters
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeFilters;
