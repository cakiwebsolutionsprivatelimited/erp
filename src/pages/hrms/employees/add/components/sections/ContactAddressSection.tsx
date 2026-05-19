import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATES_AND_DISTRICTS } from '../../constants/dropdowns';
import { MapPin, Phone, HelpCircle } from 'lucide-react';

export const ContactAddressSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const sameAsPresent = watch('sameAsPresent') || false;
  
  // Present Address State / District / City Watchers
  const presentState = watch('presentAddress.state');
  const presentDistrict = watch('presentAddress.district');
  const presentCity = watch('presentAddress.city');
  const presentStreet = watch('presentAddress.street');
  const presentPin = watch('presentAddress.pin');

  // Permanent Address State / District / City Watchers
  const permanentState = watch('permanentAddress.state');
  const permanentDistrict = watch('permanentAddress.district');

  // 1. Cascading dropdown lists for Present Address
  const presentDistrictsList = presentState ? STATES_AND_DISTRICTS[presentState]?.districts || [] : [];
  const presentCitiesList = (presentState && presentDistrict) 
    ? STATES_AND_DISTRICTS[presentState]?.cities[presentDistrict] || [] 
    : [];

  // Cascading dropdown lists for Permanent Address
  const permanentDistrictsList = permanentState ? STATES_AND_DISTRICTS[permanentState]?.districts || [] : [];
  const permanentCitiesList = (permanentState && permanentDistrict) 
    ? STATES_AND_DISTRICTS[permanentState]?.cities[permanentDistrict] || [] 
    : [];

  // Reset dependent fields on parent changes for Present Address
  useEffect(() => {
    if (presentState && !STATES_AND_DISTRICTS[presentState]?.districts.includes(presentDistrict)) {
      setValue('presentAddress.district', '', { shouldValidate: false });
      setValue('presentAddress.city', '', { shouldValidate: false });
    }
  }, [presentState, presentDistrict, setValue]);

  useEffect(() => {
    if (presentState && presentDistrict && !STATES_AND_DISTRICTS[presentState]?.cities[presentDistrict]?.includes(presentCity)) {
      setValue('presentAddress.city', '', { shouldValidate: false });
    }
  }, [presentDistrict, presentState, presentCity, setValue]);

  // 2. Same as Present Address Sync Logic
  useEffect(() => {
    if (sameAsPresent) {
      setValue('permanentAddress.street', presentStreet || '', { shouldValidate: true });
      setValue('permanentAddress.state', presentState || '', { shouldValidate: true });
      setValue('permanentAddress.district', presentDistrict || '', { shouldValidate: true });
      setValue('permanentAddress.city', presentCity || '', { shouldValidate: true });
      setValue('permanentAddress.pin', presentPin || '', { shouldValidate: true });
    }
  }, [sameAsPresent, presentStreet, presentState, presentDistrict, presentCity, presentPin, setValue]);

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Contact & Location sync</CardTitle>
          <CardDescription className="text-xs">Provide emergency details, personal coordinate points, and residency records</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Core Mobile & Personal Email Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="mobile" className="font-semibold text-xs">Mobile Number <span className="text-destructive">*</span></Label>
            <Input
              id="mobile"
              placeholder="e.g. +1 555 0192"
              className="rounded-xl h-10"
              {...register('mobile')}
            />
            {errors.mobile && <span className="text-[10px] text-destructive font-bold">{errors.mobile.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="personalEmail" className="font-semibold text-xs">Personal Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="personalEmail"
              type="email"
              placeholder="e.g. richard.hendricks@gmail.com"
              className="rounded-xl h-10"
              {...register('personalEmail')}
            />
            {errors.personalEmail && <span className="text-[10px] text-destructive font-bold">{errors.personalEmail.message as string}</span>}
          </div>
        </div>

        {/* Present Address Header */}
        <div className="border-t pt-4">
          <span className="text-xs font-bold text-primary block mb-3 uppercase tracking-wider">Present Address</span>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-semibold text-xs">Street Details <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. 523 Evacuation Road, Apt 4B"
                className="rounded-xl h-10"
                {...register('presentAddress.street')}
              />
              {(errors.presentAddress as any)?.street && (
                <span className="text-[10px] text-destructive font-bold">{(errors.presentAddress as any).street.message as string}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <Label className="font-semibold text-xs">State <span className="text-destructive">*</span></Label>
                <Select
                  onValueChange={(val) => setValue('presentAddress.state', val, { shouldValidate: true })}
                  value={watch('presentAddress.state')}
                >
                  <SelectTrigger className="rounded-xl h-10 bg-background">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(errors.presentAddress as any)?.state && (
                  <span className="text-[10px] text-destructive font-bold">{(errors.presentAddress as any).state.message as string}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold text-xs">District <span className="text-destructive">*</span></Label>
                <Select
                  onValueChange={(val) => setValue('presentAddress.district', val, { shouldValidate: true })}
                  value={watch('presentAddress.district')}
                  disabled={!presentState}
                >
                  <SelectTrigger className="rounded-xl h-10 bg-background">
                    <SelectValue placeholder={presentState ? "Select District" : "Select State First"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {presentDistrictsList.map((dist) => (
                      <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(errors.presentAddress as any)?.district && (
                  <span className="text-[10px] text-destructive font-bold">{(errors.presentAddress as any).district.message as string}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold text-xs">City <span className="text-destructive">*</span></Label>
                <Select
                  onValueChange={(val) => setValue('presentAddress.city', val, { shouldValidate: true })}
                  value={watch('presentAddress.city')}
                  disabled={!presentDistrict}
                >
                  <SelectTrigger className="rounded-xl h-10 bg-background">
                    <SelectValue placeholder={presentDistrict ? "Select City" : "Select District First"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {presentCitiesList.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(errors.presentAddress as any)?.city && (
                  <span className="text-[10px] text-destructive font-bold">{(errors.presentAddress as any).city.message as string}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold text-xs">PIN Code <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. 560001"
                  className="rounded-xl h-10"
                  {...register('presentAddress.pin')}
                />
                {(errors.presentAddress as any)?.pin && (
                  <span className="text-[10px] text-destructive font-bold">{(errors.presentAddress as any).pin.message as string}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Sync Toggle */}
        <div className="bg-muted/10 border p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Permanent address is same as present address</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Check this to copy all present address parameters into the permanent field structure and lock them.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="sameAsPresent"
              checked={sameAsPresent}
              onCheckedChange={(checked) => setValue('sameAsPresent', checked, { shouldValidate: true })}
            />
            <Label htmlFor="sameAsPresent" className="text-xs font-bold cursor-pointer">Synchronize Address</Label>
          </div>
        </div>

        {/* Permanent Address Fields */}
        {!sameAsPresent && (
          <div className="border-t pt-4 animate-in slide-in-from-top-1 duration-200">
            <span className="text-xs font-bold text-primary block mb-3 uppercase tracking-wider">Permanent Address</span>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-semibold text-xs">Street Details <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. 523 Evacuation Road, Apt 4B"
                  className="rounded-xl h-10"
                  {...register('permanentAddress.street')}
                />
                {(errors.permanentAddress as any)?.street && (
                  <span className="text-[10px] text-destructive font-bold">{(errors.permanentAddress as any).street.message as string}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <Label className="font-semibold text-xs">State <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(val) => setValue('permanentAddress.state', val, { shouldValidate: true })}
                    value={watch('permanentAddress.state')}
                  >
                    <SelectTrigger className="rounded-xl h-10 bg-background">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                        <SelectItem key={st} value={st}>{st}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(errors.permanentAddress as any)?.state && (
                    <span className="text-[10px] text-destructive font-bold">{(errors.permanentAddress as any).state.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold text-xs">District <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(val) => setValue('permanentAddress.district', val, { shouldValidate: true })}
                    value={watch('permanentAddress.district')}
                    disabled={!permanentState}
                  >
                    <SelectTrigger className="rounded-xl h-10 bg-background">
                      <SelectValue placeholder={permanentState ? "Select District" : "Select State First"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {permanentDistrictsList.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(errors.permanentAddress as any)?.district && (
                    <span className="text-[10px] text-destructive font-bold">{(errors.permanentAddress as any).district.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold text-xs">City <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(val) => setValue('permanentAddress.city', val, { shouldValidate: true })}
                    value={watch('permanentAddress.city')}
                    disabled={!permanentDistrict}
                  >
                    <SelectTrigger className="rounded-xl h-10 bg-background">
                      <SelectValue placeholder={permanentDistrict ? "Select City" : "Select District First"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {permanentCitiesList.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(errors.permanentAddress as any)?.city && (
                    <span className="text-[10px] text-destructive font-bold">{(errors.permanentAddress as any).city.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold text-xs">PIN Code <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g. 560001"
                    className="rounded-xl h-10"
                    {...register('permanentAddress.pin')}
                  />
                  {(errors.permanentAddress as any)?.pin && (
                    <span className="text-[10px] text-destructive font-bold">{(errors.permanentAddress as any).pin.message as string}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact Information */}
        <div className="border-t pt-4">
          <span className="text-xs font-bold text-destructive block mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="h-4 w-4" />
            Emergency Contact Information
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="emergencyContactName" className="font-semibold text-xs">Contact Name <span className="text-destructive">*</span></Label>
              <Input
                id="emergencyContactName"
                placeholder="e.g. Monica Hall"
                className="rounded-xl h-10"
                {...register('emergencyContactName')}
              />
              {errors.emergencyContactName && (
                <span className="text-[10px] text-destructive font-bold">{errors.emergencyContactName.message as string}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergencyContactRelation" className="font-semibold text-xs">Relationship <span className="text-destructive">*</span></Label>
              <Select 
                onValueChange={(val) => setValue('emergencyContactRelation', val, { shouldValidate: true })}
                value={watch('emergencyContactRelation')}
              >
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Select Relation" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.emergencyContactRelation && (
                <span className="text-[10px] text-destructive font-bold">{errors.emergencyContactRelation.message as string}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergencyContactPhone" className="font-semibold text-xs">Contact Phone <span className="text-destructive">*</span></Label>
              <Input
                id="emergencyContactPhone"
                placeholder="e.g. +1 555 0134"
                className="rounded-xl h-10"
                {...register('emergencyContactPhone')}
              />
              {errors.emergencyContactPhone && (
                <span className="text-[10px] text-destructive font-bold">{errors.emergencyContactPhone.message as string}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ContactAddressSection;
