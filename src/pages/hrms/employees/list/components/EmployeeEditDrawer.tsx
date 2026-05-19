import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { Employee } from '../types/employee.types';
import { DEPARTMENTS, DESIGNATIONS, WORK_LOCATIONS, STATUSES, EMPLOYMENT_TYPES, WORK_MODES, SHIFTS } from '../constants/employeeFilters';
import { X, Save, Edit3, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notify } from '@/services/notificationService';

interface EmployeeEditDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<Employee>) => void;
}

export const EmployeeEditDrawer: React.FC<EmployeeEditDrawerProps> = ({
  employee,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'employment' | 'payroll'>('personal');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<Employee> | null>(null);

  const methods = useForm<any>({
    mode: 'onChange'
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = methods;

  // Prepopulate form when employee changes
  useEffect(() => {
    if (employee && isOpen) {
      reset({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        mobile: employee.mobile || '',
        department: employee.department || '',
        designation: employee.designation || '',
        status: employee.status || 'Active',
        employmentType: employee.employmentType || 'Full-time',
        workMode: employee.workMode || 'Onsite',
        workLocation: employee.workLocation || '',
        shiftTiming: employee.shiftTiming || '',
        reportingManager: employee.reportingManager || '',
        grossSalary: employee.grossSalary || '',
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        uanNumber: employee.uanNumber || '',
        panNumber: employee.panNumber || ''
      });
      setActiveSubTab('personal');
      setPendingData(null);
      setIsConfirmOpen(false);
    }
  }, [employee, isOpen, reset]);

  if (!employee || !isOpen) return null;

  const onFormSubmit = (data: any) => {
    // 1. Convert numeric parameters
    const cleanedData: Partial<Employee> = {
      ...data,
      grossSalary: data.grossSalary ? Number(data.grossSalary) : undefined
    };

    setPendingData(cleanedData);
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingData) {
      onSave(employee.id, pendingData);
      setIsConfirmOpen(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xs cursor-pointer transition-opacity" 
      />

      {/* Drawer Overlay */}
      <div className="relative w-full max-w-xl h-full bg-card border-l shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-350 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shrink-0">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Edit Employee Folder</h3>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                Revise coordinates for {employee.fullName} ({employee.id})
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b px-6 shrink-0 bg-muted/10 text-xs font-bold text-muted-foreground">
          <button
            onClick={() => setActiveSubTab('personal')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'personal' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-foreground'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveSubTab('employment')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'employment' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-foreground'
            }`}
          >
            Employment Details
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'payroll' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-foreground'
            }`}
          >
            Payroll & Statutory
          </button>
        </div>

        {/* Form Container */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              
              {/* TAB 1: PERSONAL INFO */}
              {activeSubTab === 'personal' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">First Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Richard"
                        className="rounded-xl h-10 font-semibold"
                        {...register('firstName', { required: 'First name is required' })}
                      />
                      {errors.firstName && <span className="text-[10px] text-destructive font-bold">{errors.firstName.message as string}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Last Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Hendricks"
                        className="rounded-xl h-10 font-semibold"
                        {...register('lastName', { required: 'Last name is required' })}
                      />
                      {errors.lastName && <span className="text-[10px] text-destructive font-bold">{errors.lastName.message as string}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Official Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        type="email"
                        placeholder="richard@piedpiper.com"
                        className="rounded-xl h-10"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email pattern' }
                        })}
                      />
                      {errors.email && <span className="text-[10px] text-destructive font-bold">{errors.email.message as string}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Mobile Number <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="+1 555 0192"
                        className="rounded-xl h-10"
                        {...register('mobile', { required: 'Mobile number is required' })}
                      />
                      {errors.mobile && <span className="text-[10px] text-destructive font-bold">{errors.mobile.message as string}</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Account Status <span className="text-destructive">*</span></Label>
                    <Select 
                      value={watch('status')} 
                      onValueChange={(val) => setValue('status', val, { shouldValidate: true })}
                    >
                      <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {STATUSES.map(st => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* TAB 2: EMPLOYMENT DETAILS */}
              {activeSubTab === 'employment' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Department <span className="text-destructive">*</span></Label>
                      <Select 
                        value={watch('department')} 
                        onValueChange={(val) => setValue('department', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {DEPARTMENTS.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Designation <span className="text-destructive">*</span></Label>
                      <Select 
                        value={watch('designation')} 
                        onValueChange={(val) => setValue('designation', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                          <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {DESIGNATIONS.map(des => (
                            <SelectItem key={des} value={des}>{des}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Work Mode <span className="text-destructive">*</span></Label>
                      <Select 
                        value={watch('workMode')} 
                        onValueChange={(val) => setValue('workMode', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                          <SelectValue placeholder="Select Work Mode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {WORK_MODES.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Employment Type <span className="text-destructive">*</span></Label>
                      <Select 
                        value={watch('employmentType')} 
                        onValueChange={(val) => setValue('employmentType', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {EMPLOYMENT_TYPES.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Office Work Location <span className="text-destructive">*</span></Label>
                      <Select 
                        value={watch('workLocation')} 
                        onValueChange={(val) => setValue('workLocation', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {WORK_LOCATIONS.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Reporting Supervisor <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Richard Hendricks"
                        className="rounded-xl h-10"
                        {...register('reportingManager', { required: 'Reporting manager is required' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Shift Timings <span className="text-destructive">*</span></Label>
                    <Select 
                      value={watch('shiftTiming')} 
                      onValueChange={(val) => setValue('shiftTiming', val, { shouldValidate: true })}
                    >
                      <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                        <SelectValue placeholder="Select Shift Schedule" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {SHIFTS.map(sh => (
                          <SelectItem key={sh} value={sh}>{sh}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* TAB 3: PAYROLL & STATUTORY */}
              {activeSubTab === 'payroll' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Annual Gross Salary ($/yr) <span className="text-destructive">*</span></Label>
                    <Input
                      type="number"
                      placeholder="e.g. 15000"
                      className="rounded-xl h-10 font-mono font-bold"
                      {...register('grossSalary', { required: 'Gross salary is required' })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Disbursement Bank Name</Label>
                      <Input
                        placeholder="e.g. SVB"
                        className="rounded-xl h-10"
                        {...register('bankName')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Bank Account Number</Label>
                      <Input
                        placeholder="e.g. ••••4729"
                        className="rounded-xl h-10 font-mono"
                        {...register('accountNumber')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">UAN Number</Label>
                      <Input
                        placeholder="12 Digit code"
                        maxLength={12}
                        className="rounded-xl h-10 font-mono"
                        {...register('uanNumber')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">National PAN Code</Label>
                      <Input
                        placeholder="10 Character code"
                        maxLength={10}
                        className="rounded-xl h-10 font-mono"
                        {...register('panNumber')}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Actions Bar */}
            <div className="p-5 border-t shrink-0 flex gap-3 bg-muted/20 justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="rounded-xl h-10 px-5 text-xs font-bold border-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!isDirty}
                className="rounded-xl h-10 px-5 text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Validate & Save
              </Button>
            </div>
          </form>
        </FormProvider>

      </div>

      {/* Confirmation Sub-Modal Overlay */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-card border rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Save Changes to Ledger?</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-semibold">
                You are editing official employment coordinates. Submitting will update turnstile security settings, RFID codes, and monthly payroll parameters instantly.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl font-bold cursor-pointer"
              >
                Go Back
              </Button>
              <Button 
                size="sm" 
                onClick={handleConfirmSave}
                className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-bold gap-1 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Authorized Sync
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeEditDrawer;
