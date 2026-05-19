import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSuggestedUsername } from '../../utils/calculations';
import { checkPasswordStrength, generateSecurePassword } from '../../utils/employeeHelpers';
import { notify } from '@/services/notificationService';
import { Key, Sparkles, Copy, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Employee': [
    'Read self employment logs',
    'Submit check-in/out and timesheets',
    'Request leave applications',
    'Download self salary slips'
  ],
  'Manager': [
    'Read team attendance rosters',
    'Approve direct-report leaves',
    'Initiate team performance evaluations',
    'Submit departmental asset requests'
  ],
  'HR': [
    'Create and enroll new personnel folders',
    'Audit statutory PF/ESI documents',
    'Process employee salary dispatches',
    'Manage onboarding assets lifecycle'
  ],
  'Admin': [
    'Configure modules and billing setups',
    'Grant global role and security clearings',
    'Audit database checkouts and logs',
    'Modify system-wide static data structures'
  ]
};

export const SystemAccessSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const username = watch('username');
  const password = watch('password') || '';
  const role = watch('role') || 'Employee';

  // 1. Auto generate username if empty
  useEffect(() => {
    if (firstName && !username) {
      const suggested = generateSuggestedUsername(firstName, lastName);
      setValue('username', suggested, { shouldValidate: true });
    }
  }, [firstName, lastName, username, setValue]);

  // 2. Password strength verification
  const strength = checkPasswordStrength(password);

  const handleGeneratePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const securePass = generateSecurePassword();
    setValue('password', securePass, { shouldValidate: true });
    setShowPassword(true);
    notify.success('Password Generated', 'Created a highly secure credential code.');
  };

  const handleCopyCredentials = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username || !password) {
      notify.warning('Credentials Empty', 'Username or Password is empty.');
      return;
    }
    const txt = `Username: ${username}\nPassword: ${password}\nRole: ${role}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    notify.success('Credentials Copied', 'Username and Password copied to clipboard secure cache.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Key className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">System Credentials</CardTitle>
          <CardDescription className="text-xs">Establish database login tags, user roles, and security authorization models</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Username generation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="font-semibold text-xs">System Username <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="username"
                placeholder="e.g. richard.hendricks"
                className="rounded-xl h-10 font-semibold text-primary bg-background"
                {...register('username')}
              />
              {firstName && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('username', generateSuggestedUsername(firstName, lastName), { shouldValidate: true })}
                  className="h-10 text-[10px] font-bold rounded-xl border-primary/20 text-primary hover:bg-primary/5 shrink-0"
                >
                  Regenerate
                </Button>
              )}
            </div>
            {errors.username && <span className="text-[10px] text-destructive font-bold">{errors.username.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="font-semibold text-xs">Security Role <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('role', val, { shouldValidate: true })}
              value={watch('role') || 'Employee'}
            >
              <SelectTrigger className="rounded-xl h-10 bg-background font-semibold">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Employee">Employee (Standard Access)</SelectItem>
                <SelectItem value="Manager">Manager (Department Supervisor)</SelectItem>
                <SelectItem value="HR">HR Admin (Personnel Specialist)</SelectItem>
                <SelectItem value="Admin">System Administrator (Full Authority)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password and Strength Meter */}
        <div className="space-y-4 border p-5 rounded-3xl bg-muted/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-8 space-y-1.5">
              <Label htmlFor="password" className="font-semibold text-xs">Access Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave empty to send invite email, or set now"
                  className="rounded-xl h-10 pr-12 font-mono bg-background"
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="md:col-span-4 flex gap-2 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeneratePassword}
                className="h-10 text-[10px] font-bold rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 flex-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Secure
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyCredentials}
                disabled={!password}
                className="h-10 text-[10px] font-bold rounded-xl bg-background border hover:bg-muted text-muted-foreground shrink-0 w-11"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Strength Bar */}
          {password.length > 0 && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Password Security Strength</span>
                <span className="text-primary font-bold">{strength.label}</span>
              </div>
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-full rounded-full transition-colors duration-300 ${
                      step <= strength.score ? strength.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role-Based Permissions Preview Panel */}
        <div className="border border-dashed p-4 rounded-3xl bg-primary/5 border-primary/20 space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Role-Based Clearance Privileges: {role}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {(ROLE_PERMISSIONS[role] || []).map((perm, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold leading-relaxed">
                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2FA Toggle */}
        <div className="bg-muted/10 border p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Enforce Mandatory Multi-Factor Verification (2FA)</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Upon first logging in, the employee must enroll a personal phone or secure authenticator app (TOTP).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="enable2FA"
              checked={watch('enable2FA') || false}
              onCheckedChange={(checked: boolean) => setValue('enable2FA', checked, { shouldValidate: true })}
            />
            <Label htmlFor="enable2FA" className="text-xs font-bold cursor-pointer">Enforce 2FA</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default SystemAccessSection;
