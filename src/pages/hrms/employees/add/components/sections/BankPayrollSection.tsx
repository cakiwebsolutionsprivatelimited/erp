import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BANK_NAMES } from '../../constants/dropdowns';
import { Landmark, Eye, EyeOff, Lock, Check } from 'lucide-react';

export const BankPayrollSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [showAccount, setShowAccount] = useState(false);

  const fullName = watch('fullName');
  const accountHolderName = watch('accountHolderName');
  const accountNumber = watch('accountNumber') || '';
  const bankName = watch('bankName');

  // Pre-fill Account Holder Name with Full Name if it's empty
  useEffect(() => {
    if (fullName && !accountHolderName) {
      setValue('accountHolderName', fullName, { shouldValidate: true });
    }
  }, [fullName, accountHolderName, setValue]);

  // Mask sensitive bank account digits
  const getMaskedAccount = () => {
    if (!accountNumber) return '';
    if (showAccount) return accountNumber;
    
    const visibleLen = Math.min(4, accountNumber.length);
    const maskedLen = Math.max(0, accountNumber.length - visibleLen);
    return '•'.repeat(maskedLen) + accountNumber.slice(-visibleLen);
  };

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Bank & Disbursement Account</CardTitle>
          <CardDescription className="text-xs">Establish the commercial bank account parameters for direct salary deposits</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Core Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="bankName" className="font-semibold text-xs">Bank Name <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('bankName', val, { shouldValidate: true })}
              value={watch('bankName')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {BANK_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bankName && <span className="text-[10px] text-destructive font-bold">{errors.bankName.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountHolderName" className="font-semibold text-xs">Account Holder Name <span className="text-destructive">*</span></Label>
            <Input
              id="accountHolderName"
              placeholder="e.g. Richard Hendricks"
              className="rounded-xl h-10 bg-background font-semibold"
              {...register('accountHolderName')}
            />
            {errors.accountHolderName && <span className="text-[10px] text-destructive font-bold">{errors.accountHolderName.message as string}</span>}
          </div>
        </div>

        {/* Account Number & IFSC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="accountNumber" className="font-semibold text-xs">Account Number <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input
                id="accountNumber"
                type={showAccount ? "text" : "password"}
                placeholder="e.g. 10023485762"
                className="rounded-xl h-10 pr-12 font-mono tracking-wider bg-background"
                {...register('accountNumber')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowAccount(!showAccount)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg"
              >
                {showAccount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {!showAccount && accountNumber.length > 0 && (
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-semibold">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>Masked value: <span className="font-mono text-foreground font-bold">{getMaskedAccount()}</span></span>
              </div>
            )}
            {errors.accountNumber && <span className="text-[10px] text-destructive font-bold">{errors.accountNumber.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountType" className="font-semibold text-xs">Account Type <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('accountType', val, { shouldValidate: true })}
              value={watch('accountType') || 'Savings'}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Savings">Savings Account</SelectItem>
                <SelectItem value="Current">Current / Corporate Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Branch & IFSC Cascades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="ifscCode" className="font-semibold text-xs">IFSC Code / Bank Routing Code <span className="text-destructive">*</span></Label>
            <Input
              id="ifscCode"
              placeholder="e.g. SBIN0004925"
              className="rounded-xl h-10 uppercase font-mono bg-background font-semibold"
              {...register('ifscCode')}
            />
            {errors.ifscCode && <span className="text-[10px] text-destructive font-bold">{errors.ifscCode.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="branchName" className="font-semibold text-xs">Branch Name <span className="text-destructive">*</span></Label>
            <Input
              id="branchName"
              placeholder="e.g. Silicon Valley Main Avenue"
              className="rounded-xl h-10 bg-background"
              {...register('branchName')}
            />
            {errors.branchName && <span className="text-[10px] text-destructive font-bold">{errors.branchName.message as string}</span>}
          </div>
        </div>

        {/* Audit Sync Confirmation */}
        <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-3xl flex items-start gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground">Disbursement Details Lock active</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mt-0.5">
              Your payroll bank details are synchronized with the central HR Ledger. Changing this after employee submission triggers a compliance review.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default BankPayrollSection;
