import { useState, useEffect, useCallback } from 'react';
import type { Employee } from '../types/employee.types';
import { employeeService } from '../services/employee.service';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEmployees = useCallback(() => {
    setIsLoading(true);
    // Simulate slight API network latency
    setTimeout(() => {
      const data = employeeService.getEmployees();
      setEmployees(data);
      setIsLoading(false);
    }, 450);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = (newEmp: Omit<Employee, 'id' | 'profileCompleteness'> & { id?: string }) => {
    const created = employeeService.addEmployee(newEmp);
    fetchEmployees();
    return created;
  };

  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    const updated = employeeService.updateEmployee(id, updatedData);
    fetchEmployees();
    return updated;
  };

  const deleteEmployee = (id: string) => {
    employeeService.deleteEmployee(id);
    setSelectedIds(prev => prev.filter(item => item !== id));
    fetchEmployees();
  };

  // Bulk options
  const bulkDelete = () => {
    employeeService.bulkDeleteEmployees(selectedIds);
    setSelectedIds([]);
    fetchEmployees();
  };

  const bulkUpdateDepartment = (department: string) => {
    employeeService.bulkUpdateDepartment(selectedIds, department);
    setSelectedIds([]);
    fetchEmployees();
  };

  const bulkUpdateStatus = (status: Employee['status']) => {
    employeeService.bulkUpdateStatus(selectedIds, status);
    setSelectedIds([]);
    fetchEmployees();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      // Exclude soft-deleted (Terminated) from selection by default
      const selectable = employees
        .filter(emp => emp.status !== 'Terminated')
        .map(emp => emp.id);
      setSelectedIds(selectable);
    } else {
      setSelectedIds([]);
    }
  };

  return {
    employees,
    selectedIds,
    isLoading,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    bulkDelete,
    bulkUpdateDepartment,
    bulkUpdateStatus,
    toggleSelect,
    toggleSelectAll,
    setSelectedIds
  };
};
