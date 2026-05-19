import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { calculateSalaryFromGross } from '../../utils/calculations';
import { ClipboardList, TrendingUp, DollarSign, Wallet, AlertCircle, PieChart } from 'lucide-react';

export const SalaryStructureSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const grossSalary = parseFloat(watch('grossSalary') || '0');
  const employeePf = parseFloat(watch('employeePf') || '0');
  const professionalTax = parseFloat(watch('professionalTax') || '0');
  const otherDeductions = parseFloat(watch('otherDeductions') || '0');
  const netSalary = parseFloat(watch('netSalary') || '0');

  // PF and PT selection checkboxes from subsequent Statutory tabs (defaults to true)
  const pfEnrolled = watch('pfEnrolled') !== false;
  const ptEnrolled = watch('ptEnrolled') !== false;

  // Auto-calculate components in real time when Gross Annual changes
  useEffect(() => {
    if (grossSalary && grossSalary > 0) {
      const bdown = calculateSalaryFromGross(grossSalary, ptEnrolled, pfEnrolled);
      
      setValue('basicSalary', bdown.basic, { shouldValidate: true });
      setValue('hra', bdown.hra, { shouldValidate: true });
      setValue('lta', bdown.lta, { shouldValidate: true });
      setValue('specialAllowance', bdown.specialAllowance, { shouldValidate: true });
      setValue('employerPf', bdown.employerPf, { shouldValidate: true });
      setValue('employeePf', bdown.employeePf, { shouldValidate: true });
      setValue('professionalTax', bdown.professionalTax, { shouldValidate: true });
      
      const statutoryDeductions = bdown.employeePf + bdown.professionalTax;
      const net = Math.max(0, grossSalary - statutoryDeductions - otherDeductions);
      setValue('netSalary', net, { shouldValidate: true });
    }
  }, [grossSalary, pfEnrolled, ptEnrolled, otherDeductions, setValue]);

  // Monthly conversions for UI preview
  const monthlyGross = Math.round(grossSalary / 12);
  const monthlyNet = Math.round(netSalary / 12);
  const monthlyDeductions = Math.round((employeePf + professionalTax + otherDeductions) / 12);

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Salary Structure & Payroll</CardTitle>
          <CardDescription className="text-xs">Establish basic salary parameters, housing allowance distributions, and deductions</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Gross Annual Input and Real-time Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="grossSalary" className="font-semibold text-xs text-primary flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Gross Annual Salary (USD / yr) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="e.g. 145000"
                className="rounded-xl h-11 font-semibold text-lg border-primary/30 focus:border-primary bg-background"
                {...register('grossSalary')}
              />
              {errors.grossSalary && <span className="text-[10px] text-destructive font-bold">{errors.grossSalary.message as string}</span>}
            </div>

            {/* Structured Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-3xl bg-muted/10">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Basic Salary (50%)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('basicSalary')}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">HRA Allowance (40%)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('hra')}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">LTA Allowance (10%)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('lta')}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Special Allowance (Remainder)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('specialAllowance')}
                />
              </div>
            </div>

            {/* Deductions Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Provident Fund (PF)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('employeePf')}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Professional Tax (PT)</Label>
                <Input
                  type="number"
                  readOnly
                  className="rounded-xl h-9 bg-muted/40 font-semibold text-xs cursor-not-allowed text-muted-foreground"
                  {...register('professionalTax')}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-primary-foreground/0 uppercase tracking-wider">Other Deductions</Label>
                <Input
                  type="number"
                  placeholder="e.g. 0"
                  className="rounded-xl h-9 bg-background font-semibold text-xs"
                  {...register('otherDeductions')}
                />
              </div>
            </div>
          </div>

          {/* Right Premium Payroll Preview Dashboard */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-3xl flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Monthly Payroll Preview
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold border-transparent text-xs py-0.5">
                  Direct Ledger
                </Badge>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    Monthly Gross Take
                  </span>
                  <span className="text-sm font-bold text-foreground font-mono">${monthlyGross.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    Statutory Deductions
                  </span>
                  <span className="text-sm font-bold text-rose-500 font-mono">-${monthlyDeductions.toLocaleString()}</span>
                </div>

                <Separator className="bg-primary/10" />

                <div className="flex items-center justify-between bg-primary/10 p-3 rounded-2xl border border-primary/10">
                  <span className="text-xs text-primary font-bold flex items-center gap-1.5">
                    <PieChart className="h-4 w-4 text-primary" />
                    Net Take-Home (Est)
                  </span>
                  <span className="text-base font-extrabold text-primary font-mono">${monthlyNet.toLocaleString()} / mo</span>
                </div>
              </div>

              {/* Annualized vs Monthly comparison text */}
              <div className="mt-4 p-3 bg-background/50 border rounded-2xl text-[10px] text-muted-foreground font-semibold leading-relaxed">
                <span>Annualized equivalent: Gross of <span className="text-foreground font-bold">${grossSalary.toLocaleString()} / yr</span> maps to an estimated Net Take-Home of <span className="text-primary font-extrabold">${netSalary.toLocaleString()} / yr</span>.</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default SalaryStructureSection;
