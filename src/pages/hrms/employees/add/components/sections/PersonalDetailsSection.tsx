import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '../shared/FileUpload';
import { calculateAge } from '../../utils/calculations';
import { Users, Info } from 'lucide-react';

export const PersonalDetailsSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const firstName = watch('firstName');
  const middleName = watch('middleName');
  const lastName = watch('lastName');
  const dob = watch('dob');
  const avatarUrl = watch('avatarUrl');

  // 1. Auto full-name generation
  useEffect(() => {
    const fn = firstName || '';
    const mn = middleName ? ` ${middleName}` : '';
    const ln = lastName ? ` ${lastName}` : '';
    const full = `${fn}${mn}${ln}`.trim();
    setValue('fullName', full, { shouldValidate: true });
  }, [firstName, middleName, lastName, setValue]);

  // 2. Real-time age auto calculation
  const calculatedAge = dob ? calculateAge(dob) : null;

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Personal Profile Details</CardTitle>
          <CardDescription className="text-xs">Fill out the legal identification information of the employee</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Avatar Upload Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-muted/20 border border-dashed rounded-3xl relative min-h-[160px]">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile Preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-md">
                <span className="text-xl font-bold text-primary tracking-wider">
                  {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'EMP'}
                </span>
              </div>
            )}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-3">Avatar Fallback</span>
          </div>

          <div className="md:col-span-3">
            <FileUpload
              label="Upload Profile Photo"
              accept=".png,.jpg,.jpeg"
              value={avatarUrl}
              fileName="profile_picture.png"
              onChange={(url) => setValue('avatarUrl', url, { shouldValidate: true })}
            />
          </div>
        </div>

        {/* Dynamic Name and DOB Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="font-semibold text-xs">First Name <span className="text-destructive">*</span></Label>
            <Input
              id="firstName"
              placeholder="e.g. Richard"
              className="rounded-xl h-10"
              {...register('firstName')}
            />
            {errors.firstName && <span className="text-[10px] text-destructive font-bold">{errors.firstName.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="middleName" className="font-semibold text-xs">Middle Name (Optional)</Label>
            <Input
              id="middleName"
              placeholder="e.g. Gary"
              className="rounded-xl h-10"
              {...register('middleName')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="font-semibold text-xs">Last Name <span className="text-destructive">*</span></Label>
            <Input
              id="lastName"
              placeholder="e.g. Hendricks"
              className="rounded-xl h-10"
              {...register('lastName')}
            />
            {errors.lastName && <span className="text-[10px] text-destructive font-bold">{errors.lastName.message as string}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="font-semibold text-xs">Generated Full Name</Label>
            <Input
              id="fullName"
              readOnly
              placeholder="Auto Generates Name..."
              className="rounded-xl h-10 bg-muted/30 font-semibold cursor-not-allowed"
              {...register('fullName')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dob" className="font-semibold text-xs">Date of Birth <span className="text-destructive">*</span></Label>
            <div className="flex gap-3">
              <Input
                id="dob"
                type="date"
                max={new Date().toISOString().split('T')[0]} // prevent future dates
                className="rounded-xl h-10 flex-1"
                {...register('dob')}
              />
              {calculatedAge !== null && calculatedAge > 0 && (
                <div className="bg-primary/5 border border-primary/25 rounded-xl px-4 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                  {calculatedAge} Yrs Old
                </div>
              )}
            </div>
            {errors.dob && <span className="text-[10px] text-destructive font-bold">{errors.dob.message as string}</span>}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="gender" className="font-semibold text-xs">Gender <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('gender', val, { shouldValidate: true })}
              value={watch('gender')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                <SelectItem value="Prefer Not to Say">Prefer Not to Say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <span className="text-[10px] text-destructive font-bold">{errors.gender.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maritalStatus" className="font-semibold text-xs">Marital Status <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('maritalStatus', val, { shouldValidate: true })}
              value={watch('maritalStatus')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {errors.maritalStatus && <span className="text-[10px] text-destructive font-bold">{errors.maritalStatus.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nationality" className="font-semibold text-xs">Nationality <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('nationality', val, { shouldValidate: true })}
              value={watch('nationality')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Nationality" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="British">British</SelectItem>
                <SelectItem value="Canadian">Canadian</SelectItem>
                <SelectItem value="Australian">Australian</SelectItem>
              </SelectContent>
            </Select>
            {errors.nationality && <span className="text-[10px] text-destructive font-bold">{errors.nationality.message as string}</span>}
          </div>
        </div>

        {/* Informative Alert */}
        <div className="flex items-start gap-2.5 bg-muted/30 border p-3 rounded-2xl text-[11px] text-muted-foreground leading-relaxed font-semibold">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>Please double check that names match official identification documents (Passport, PAN, or Aadhaar) to avoid future payroll or KYC compliance conflicts during automated audits.</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default PersonalDetailsSection;
