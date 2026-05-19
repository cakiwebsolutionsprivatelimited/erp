import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTMENTS, DESIGNATIONS_BY_DEPT, REPORTING_MANAGERS } from '../../constants/dropdowns';
import { generateSuggestedEmails } from '../../utils/calculations';
import { Briefcase, Mail } from 'lucide-react';

export const EmploymentDetailsSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const department = watch('department');
  const designation = watch('designation');
  const joiningDate = watch('joiningDate');
  const workMode = watch('workMode');
  const isRehire = watch('isRehire') || false;
  const officialEmail = watch('officialEmail');

  // 1. Department → Designation Cascade
  const designationsList = department ? DESIGNATIONS_BY_DEPT[department] || [] : [];

  // Reset designation if department changes and current designation is not valid for new department
  useEffect(() => {
    if (department && !DESIGNATIONS_BY_DEPT[department]?.includes(designation)) {
      setValue('designation', '', { shouldValidate: false });
    }
  }, [department, designation, setValue]);

  // 2. Official Email Suggestion Generator
  const suggestedEmails = generateSuggestedEmails(firstName, lastName);

  // 3. Confirmation Date Auto Calculation (default exactly 6 months after joining date)
  useEffect(() => {
    if (joiningDate) {
      const date = new Date(joiningDate);
      date.setMonth(date.getMonth() + 6);
      const confStr = date.toISOString().split('T')[0];
      setValue('confirmationDate', confStr, { shouldValidate: true });
    }
  }, [joiningDate, setValue]);

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Employment Parameters</CardTitle>
          <CardDescription className="text-xs">Configure designations, corporate reporting lines, and scheduling preferences</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Department & Designation Cascade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="department" className="font-semibold text-xs">Department <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('department', val, { shouldValidate: true })}
              value={watch('department')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <span className="text-[10px] text-destructive font-bold">{errors.department.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="designation" className="font-semibold text-xs">Designation <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('designation', val, { shouldValidate: true })}
              value={watch('designation')}
              disabled={!department}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder={department ? "Select Designation" : "Please select department first"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {designationsList.map((desig) => (
                  <SelectItem key={desig} value={desig}>{desig}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.designation && <span className="text-[10px] text-destructive font-bold">{errors.designation.message as string}</span>}
          </div>
        </div>

        {/* Reporting Manager & Joining Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="reportingManager" className="font-semibold text-xs">Reporting Manager <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('reportingManager', val, { shouldValidate: true })}
              value={watch('reportingManager')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {REPORTING_MANAGERS.map((mgr) => (
                  <SelectItem key={mgr.id} value={mgr.name}>
                    {mgr.name} ({mgr.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reportingManager && <span className="text-[10px] text-destructive font-bold">{errors.reportingManager.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="joiningDate" className="font-semibold text-xs">Joining Date <span className="text-destructive">*</span></Label>
            <Input
              id="joiningDate"
              type="date"
              className="rounded-xl h-10"
              {...register('joiningDate')}
            />
            {errors.joiningDate && <span className="text-[10px] text-destructive font-bold">{errors.joiningDate.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmationDate" className="font-semibold text-xs">Confirmation Date (6 Month Probation)</Label>
            <Input
              id="confirmationDate"
              type="date"
              readOnly
              className="rounded-xl h-10 bg-muted/30 font-semibold cursor-not-allowed text-primary"
              {...register('confirmationDate')}
            />
          </div>
        </div>

        {/* Corporate Email Suggestions */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="officialEmail" className="font-semibold text-xs">Official Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="officialEmail"
              type="email"
              placeholder="e.g. richard.h@enterprise-erp.com"
              className="rounded-xl h-10"
              {...register('officialEmail')}
            />
            {errors.officialEmail && <span className="text-[10px] text-destructive font-bold">{errors.officialEmail.message as string}</span>}
          </div>

          {suggestedEmails.length > 0 && (
            <div className="bg-muted/15 border border-muted rounded-2xl p-3 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-primary" />
                Suggested Official Emails
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedEmails.map((email) => (
                  <Button
                    key={email}
                    type="button"
                    variant="ghost"
                    onClick={() => setValue('officialEmail', email, { shouldValidate: true })}
                    className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-colors ${
                      officialEmail === email 
                        ? "bg-primary/10 text-primary border-primary/30" 
                        : "bg-background border-muted hover:bg-muted"
                    }`}
                  >
                    {email}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Work Mode & Employee Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="workMode" className="font-semibold text-xs">Work Mode <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('workMode', val, { shouldValidate: true })}
              value={watch('workMode') || 'Onsite'}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Work Mode" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Onsite">Onsite (Headquarters)</SelectItem>
                <SelectItem value="Hybrid">Hybrid Schedule</SelectItem>
                <SelectItem value="Remote">100% Fully Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employeeType" className="font-semibold text-xs">Employee Type <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('employeeType', val, { shouldValidate: true })}
              value={watch('employeeType') || 'Full-time'}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Employee Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Full-time">Full-time Regular</SelectItem>
                <SelectItem value="Part-time">Part-time Staff</SelectItem>
                <SelectItem value="Contract">Independent Contractor</SelectItem>
                <SelectItem value="Intern">Intern / Trainee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conditional Work Mode Fields */}
        {workMode === 'Hybrid' && (
          <div className="space-y-1.5 p-4 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <Label htmlFor="hybridDetails" className="font-semibold text-xs">Hybrid Schedule Details <span className="text-destructive">*</span></Label>
            <Input
              id="hybridDetails"
              placeholder="e.g. Mon & Tue Office, Wed-Fri Remote"
              className="rounded-xl h-10"
              {...register('hybridDetails')}
            />
            {errors.hybridDetails && <span className="text-[10px] text-destructive font-bold">{errors.hybridDetails.message as string}</span>}
          </div>
        )}

        {workMode === 'Remote' && (
          <div className="space-y-1.5 p-4 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <Label htmlFor="remoteCountry" className="font-semibold text-xs">Remote Country / Jurisdiction <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('remoteCountry', val, { shouldValidate: true })}
              value={watch('remoteCountry')}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background">
                <SelectValue placeholder="Select Jurisdiction" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
              </SelectContent>
            </Select>
            {errors.remoteCountry && <span className="text-[10px] text-destructive font-bold">{errors.remoteCountry.message as string}</span>}
          </div>
        )}

        {/* Rehire Workflow Toggle */}
        <div className="bg-muted/10 border border-muted/50 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Rehire Employee Workflow</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Check this if this candidate has previously served in the organization. This allows mapping files, tenure, and audits.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="isRehire"
              checked={isRehire}
              onCheckedChange={(checked) => setValue('isRehire', checked, { shouldValidate: true })}
            />
            <Label htmlFor="isRehire" className="text-xs font-bold cursor-pointer">Rehired Staff</Label>
          </div>
        </div>

        {isRehire && (
          <div className="space-y-1.5 p-4 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <Label htmlFor="previousEmployeeId" className="font-semibold text-xs">Previous Employee ID <span className="text-destructive">*</span></Label>
            <Input
              id="previousEmployeeId"
              placeholder="e.g. EMP002"
              className="rounded-xl h-10 bg-background"
              {...register('previousEmployeeId')}
            />
            {errors.previousEmployeeId && <span className="text-[10px] text-destructive font-bold">{errors.previousEmployeeId.message as string}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default EmploymentDetailsSection;
