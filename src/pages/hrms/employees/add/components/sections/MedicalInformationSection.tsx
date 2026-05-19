import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS } from '../../constants/dropdowns';
import { HeartPulse, ShieldAlert, Award } from 'lucide-react';

export const MedicalInformationSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const insuranceOpted = watch('insuranceOpted') || false;

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Medical & Health Insurance</CardTitle>
          <CardDescription className="text-xs">Provide blood groups, allergies, and establish health care covers</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Blood Group and Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="bloodGroup" className="font-semibold text-xs">Blood Group <span className="text-destructive">*</span></Label>
            <Select 
              onValueChange={(val) => setValue('bloodGroup', val, { shouldValidate: true })}
              value={watch('bloodGroup')}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bloodGroup && <span className="text-[10px] text-destructive font-bold">{errors.bloodGroup.message as string}</span>}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="allergies" className="font-semibold text-xs">Known Allergies / Food restrictions (Optional)</Label>
            <Input
              id="allergies"
              placeholder="e.g. Peanuts, Penicillin, Lactose intolerant"
              className="rounded-xl h-10 bg-background"
              {...register('allergies')}
            />
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="space-y-1.5">
          <Label htmlFor="medicalConditions" className="font-semibold text-xs">Chronic Medical Conditions or Key History (Optional)</Label>
          <Input
            id="medicalConditions"
            placeholder="e.g. Hypertension, Type 1 Diabetes, none"
            className="rounded-xl h-10 bg-background"
            {...register('medicalConditions')}
          />
        </div>

        {/* Corporate Insurance Coverage Options */}
        <div className="bg-muted/10 border p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Opt-in to corporate health insurance policy</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Activate direct medical coverage claims with secondary beneficiary mappings under our group policy.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="insuranceOpted"
              checked={insuranceOpted}
              onCheckedChange={(checked) => setValue('insuranceOpted', checked, { shouldValidate: true })}
            />
            <Label htmlFor="insuranceOpted" className="text-xs font-bold cursor-pointer">Activate Coverage</Label>
          </div>
        </div>

        {/* Conditional Insurance Fields */}
        {insuranceOpted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <div className="space-y-1.5">
              <Label htmlFor="insuranceProvider" className="font-semibold text-xs">Preferred Health Insurance Provider <span className="text-destructive">*</span></Label>
              <Select 
                onValueChange={(val) => setValue('insuranceProvider', val, { shouldValidate: true })}
                value={watch('insuranceProvider')}
              >
                <SelectTrigger className="rounded-xl h-10 bg-background">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Allianz Care">Allianz Care</SelectItem>
                  <SelectItem value="Cigna Global">Cigna Global</SelectItem>
                  <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
                  <SelectItem value="Aetna International">Aetna International</SelectItem>
                </SelectContent>
              </Select>
              {errors.insuranceProvider && <span className="text-[10px] text-destructive font-bold">{errors.insuranceProvider.message as string}</span>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sumInsured" className="font-semibold text-xs">Preferred Sum Insured Cover ($)</Label>
              <Select 
                onValueChange={(val) => setValue('sumInsured', parseInt(val, 10), { shouldValidate: true })}
                value={watch('sumInsured')?.toString()}
              >
                <SelectTrigger className="rounded-xl h-10 bg-background">
                  <SelectValue placeholder="Select Coverage Sum" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="100000">$100,000 Cover (Standard)</SelectItem>
                  <SelectItem value="250000">$250,000 Cover (Premium)</SelectItem>
                  <SelectItem value="500000">$500,000 Cover (Executive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* HIPAA Compliancy Alert */}
        <div className="flex items-start gap-2.5 bg-muted/30 border p-3 rounded-2xl text-[11px] text-muted-foreground leading-relaxed font-semibold">
          <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>All health profile parameters are protected under HIPAA/GDPR health compliance frameworks. Medical records are solely accessed by the emergency health desk in case of accidents.</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default MedicalInformationSection;
