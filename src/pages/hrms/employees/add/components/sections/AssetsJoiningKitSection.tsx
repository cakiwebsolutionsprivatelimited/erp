import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { KIT_ITEMS_LIST } from '../../constants/dropdowns';
import { Package } from 'lucide-react';

export const AssetsJoiningKitSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const laptopAssigned = watch('laptopAssigned') || false;
  const joiningKitIssued = watch('joiningKitIssued') || false;
  const kitItems = watch('kitItems') || [];

  const handleKitItemToggle = (item: string, checked: boolean) => {
    if (checked) {
      setValue('kitItems', [...kitItems, item], { shouldValidate: true });
    } else {
      setValue('kitItems', kitItems.filter((i: string) => i !== item), { shouldValidate: true });
    }
  };

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Assets & Joining Kit</CardTitle>
          <CardDescription className="text-xs">Allocate corporate hardware, welcome packs, and schedule asset deliveries</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Laptop Assignment Section */}
        <div className="bg-muted/10 border p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Allocate Corporate Workstation (Laptop)</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Assign a company-owned high-performance workstation for official duties.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="laptopAssigned"
              checked={laptopAssigned}
              onCheckedChange={(checked) => setValue('laptopAssigned', checked, { shouldValidate: true })}
            />
            <Label htmlFor="laptopAssigned" className="text-xs font-bold cursor-pointer">Laptop Allocated</Label>
          </div>
        </div>

        {/* Conditional Workstation Fields */}
        {laptopAssigned && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <div className="space-y-1.5">
              <Label htmlFor="laptopModel" className="font-semibold text-xs">Workstation Model <span className="text-destructive">*</span></Label>
              <Input
                id="laptopModel"
                placeholder="e.g. MacBook Pro 16-inch (M3 Max, 36GB RAM)"
                className="rounded-xl h-10 bg-background font-semibold"
                {...register('laptopModel')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="laptopSerial" className="font-semibold text-xs">Serial Number <span className="text-destructive">*</span></Label>
              <Input
                id="laptopSerial"
                placeholder="e.g. C02G998ZMD6M"
                className="rounded-xl h-10 bg-background font-mono uppercase font-semibold"
                {...register('laptopSerial')}
              />
              {errors.laptopSerial && <span className="text-[10px] text-destructive font-bold">{errors.laptopSerial.message as string}</span>}
            </div>
          </div>
        )}

        {/* Welcome Kit Items Issued */}
        <div className="bg-muted/10 border p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-foreground">Issue Corporate Welcome Kit</span>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Prepare standard company swag and hardware kit elements for handover on day one.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              id="joiningKitIssued"
              checked={joiningKitIssued}
              onCheckedChange={(checked) => setValue('joiningKitIssued', checked, { shouldValidate: true })}
            />
            <Label htmlFor="joiningKitIssued" className="text-xs font-bold cursor-pointer">Welcome Kit Prepared</Label>
          </div>
        </div>

        {/* Dynamic Kit Checklist Grid */}
        {joiningKitIssued && (
          <div className="space-y-3 p-5 border border-dashed rounded-3xl bg-muted/10 animate-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">Swag and Access Checklist</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KIT_ITEMS_LIST.map((item) => {
                const checked = kitItems.includes(item);
                return (
                  <div 
                    key={item} 
                    className={`flex items-center gap-3 border p-3 rounded-2xl bg-background transition-colors ${
                      checked ? "border-primary/20 bg-primary/5" : "border-muted"
                    }`}
                  >
                    <Checkbox
                      id={`kit-${item}`}
                      checked={checked}
                      onCheckedChange={(val) => handleKitItemToggle(item, !!val)}
                      className="cursor-pointer"
                    />
                    <Label 
                      htmlFor={`kit-${item}`} 
                      className={`text-xs font-semibold cursor-pointer ${checked ? "text-primary font-bold" : "text-muted-foreground"}`}
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Handover Schedule Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="assetHandoverDate" className="font-semibold text-xs">Asset Handover / Swag Deliver Date</Label>
            <Input
              id="assetHandoverDate"
              type="date"
              className="rounded-xl h-10 bg-background"
              {...register('assetHandoverDate')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default AssetsJoiningKitSection;
