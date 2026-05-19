import { useState, useMemo } from 'react';
import type { Employee } from '../types/employee.types';

export interface FilterState {
  search: string;
  department: string;
  designation: string;
  status: string;
  workMode: string;
  employmentType: string;
  workLocation: string;
  joiningDateStart: string;
  joiningDateEnd: string;
}

const INITIAL_FILTERS: FilterState = {
  search: '',
  department: '',
  designation: '',
  status: '',
  workMode: '',
  employmentType: '',
  workLocation: '',
  joiningDateStart: '',
  joiningDateEnd: ''
};

export const useEmployeeFilters = (employees: Employee[]) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.department) count++;
    if (filters.designation) count++;
    if (filters.status) count++;
    if (filters.workMode) count++;
    if (filters.employmentType) count++;
    if (filters.workLocation) count++;
    if (filters.joiningDateStart || filters.joiningDateEnd) count++;
    return count;
  }, [filters]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // 1. Text Search matching name, email, designation, skills, employee ID
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = emp.fullName.toLowerCase().includes(query);
        const matchesEmail = emp.email.toLowerCase().includes(query);
        const matchesId = emp.id.toLowerCase().includes(query);
        const matchesDesignation = emp.designation.toLowerCase().includes(query);
        const matchesDepartment = emp.department.toLowerCase().includes(query);
        
        if (!matchesName && !matchesEmail && !matchesId && !matchesDesignation && !matchesDepartment) {
          return false;
        }
      }

      // 2. Department filter
      if (filters.department && emp.department !== filters.department) {
        return false;
      }

      // 3. Designation filter
      if (filters.designation && emp.designation !== filters.designation) {
        return false;
      }

      // 4. Status filter
      if (filters.status && emp.status !== filters.status) {
        return false;
      }

      // 5. Work Mode filter
      if (filters.workMode && emp.workMode !== filters.workMode) {
        return false;
      }

      // 6. Employment Type filter
      if (filters.employmentType && emp.employmentType !== filters.employmentType) {
        return false;
      }

      // 7. Location filter
      if (filters.workLocation && emp.workLocation !== filters.workLocation) {
        return false;
      }

      // 8. Date ranges
      if (filters.joiningDateStart && emp.joiningDate < filters.joiningDateStart) {
        return false;
      }
      if (filters.joiningDateEnd && emp.joiningDate > filters.joiningDateEnd) {
        return false;
      }

      return true;
    });
  }, [employees, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredEmployees,
    activeFiltersCount,
    isDrawerOpen,
    setIsDrawerOpen
  };
};
