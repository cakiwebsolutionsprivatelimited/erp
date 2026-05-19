import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Scale, CheckCircle } from 'lucide-react';

export const StatutorySection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const pfEnrolled = watch('pfEnrolled') !== false;
  const esiEnrolled = watch('esiEnrolled') || false;
  const ptEnrolled = watch('ptEnrolled') !== false;
  const statutoryDeductionsEnrolled = watch('statutoryDeductionsEnrolled') !== false;

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Statutory & Provident Funds</CardTitle>
          <CardDescription className="text-xs">Configure UAN numbers, state insurance parameters, and legal tax deductions</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Core Statutory Reg Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="uanNumber" className="font-semibold text-xs">Universal Account Number (UAN) (12 Digits)</Label>
            <Input
              id="uanNumber"
              placeholder="e.g. 100983274591"
              maxLength={12}
              className="rounded-xl h-10 font-mono tracking-wider bg-background font-semibold"
              {...register('uanNumber')}
            />
            {errors.uanNumber && <span className="text-[10px] text-destructive font-bold">{errors.uanNumber.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="esiNumber" className="font-semibold text-xs">Employee State Insurance (ESI) Number (Optional)</Label>
            <Input
              id="esiNumber"
              placeholder="e.g. 31002348576000102"
              className="rounded-xl h-10 font-mono tracking-wider bg-background font-semibold"
              {...register('esiNumber')}
            />
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="border-t pt-4 space-y-4">
          <span className="text-xs font-bold text-primary block mb-3 uppercase tracking-wider">Statutory Deductions Enrollments</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-3xl flex items-center justify-between gap-4 bg-muted/15">
              <div>
                <span className="text-xs font-bold text-foreground">Provident Fund (PF) Active</span>
                <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                  Enforce standard 12% basic salary deduction for retirement accounts.
                </p>
              </div>
              <Switch
                checked={pfEnrolled}
                onCheckedChange={(val: boolean) => setValue('pfEnrolled', val, { shouldValidate: true })}
              />
            </div>

            <div className="border p-4 rounded-3xl flex items-center justify-between gap-4 bg-muted/15">
              <div>
                <span className="text-xs font-bold text-foreground">ESI Medical Scheme</span>
                <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                  Enable state medical cards mapping for employee and dependents.
                </p>
              </div>
              <Switch
                checked={esiEnrolled}
                onCheckedChange={(val: boolean) => setValue('esiEnrolled', val, { shouldValidate: true })}
              />
            </div>

            <div className="border p-4 rounded-3xl flex items-center justify-between gap-4 bg-muted/15">
              <div>
                <span className="text-xs font-bold text-foreground">Professional Tax (PT) Active</span>
                <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                  Deduct municipal state-level professional trade taxes.
                </p>
              </div>
              <Switch
                checked={ptEnrolled}
                onCheckedChange={(val: boolean) => setValue('ptEnrolled', val, { shouldValidate: true })}
              />
            </div>

            <div className="border p-4 rounded-3xl flex items-center justify-between gap-4 bg-muted/15">
              <div>
                <span className="text-xs font-bold text-foreground">Central Statutory Sync</span>
                <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                  Automatically report deductions to legal state compliance desks.
                </p>
              </div>
              <Switch
                checked={statutoryDeductionsEnrolled}
                onCheckedChange={(val: boolean) => setValue('statutoryDeductionsEnrolled', val, { shouldValidate: true })}
              />
            </div>
          </div>
        </div>

        {/* Audit Compliance Notice */}
        <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-3xl flex items-start gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground">Legal Auditing Synchronization active</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mt-0.5">
              PF/ESI contributions are computed in accordance with the Central Board directives. Monthly reporting occurs automatically on the 15th.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default StatutorySection;
