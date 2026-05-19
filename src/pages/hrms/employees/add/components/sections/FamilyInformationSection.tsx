import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Trash2, Heart } from 'lucide-react';

export const FamilyInformationSection: React.FC = () => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents'
  });

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Family & Beneficiaries</CardTitle>
          <CardDescription className="text-xs">Specify immediate parent names, marital partners, and dependent lists</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Parents Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="fatherName" className="font-semibold text-xs">Father's Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="fatherName"
              placeholder="e.g. Gary Hendricks"
              className="rounded-xl h-10"
              {...register('fatherName')}
            />
            {errors.fatherName && <span className="text-[10px] text-destructive font-bold">{errors.fatherName.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="motherName" className="font-semibold text-xs">Mother's Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="motherName"
              placeholder="e.g. Laurie Hendricks"
              className="rounded-xl h-10"
              {...register('motherName')}
            />
            {errors.motherName && <span className="text-[10px] text-destructive font-bold">{errors.motherName.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spouseName" className="font-semibold text-xs">Spouse's Full Name (Optional)</Label>
            <Input
              id="spouseName"
              placeholder="e.g. Monica Hall"
              className="rounded-xl h-10"
              {...register('spouseName')}
            />
          </div>
        </div>

        {/* Dynamic Dependents List */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary block uppercase tracking-wider">Dependents & Beneficiary Declarations</span>
              <p className="text-[10px] text-muted-foreground font-semibold">Declare dependents for corporate group health insurance and statutory claim records.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', relationship: '', dob: '' })}
              className="h-8 text-xs font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Dependent
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-3xl bg-muted/10">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-foreground">No Dependents Declared</h5>
              <p className="text-[10px] text-muted-foreground">Click the button above to declare family dependents or emergency secondary beneficiaries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div 
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-muted/20 border border-muted/50 p-4 rounded-2xl relative"
                >
                  <div className="md:col-span-5 space-y-1.5">
                    <Label className="font-semibold text-xs">Dependent's Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="e.g. Thomas Hendricks"
                      className="rounded-xl h-10 bg-background"
                      {...register(`dependents.${index}.name`)}
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <Label className="font-semibold text-xs">Relationship <span className="text-destructive">*</span></Label>
                    <Select
                      onValueChange={(val) => setValue(`dependents.${index}.relationship`, val, { shouldValidate: true })}
                      value={watch(`dependents.${index}.relationship`)}
                    >
                      <SelectTrigger className="rounded-xl h-10 bg-background">
                        <SelectValue placeholder="Relationship" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Child">Child / Dependent</SelectItem>
                        <SelectItem value="Spouse">Spouse / Partner</SelectItem>
                        <SelectItem value="Parent">Parent / Ward</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <Label className="font-semibold text-xs">Date of Birth <span className="text-destructive">*</span></Label>
                    <Input
                      type="date"
                      className="rounded-xl h-10 bg-background"
                      {...register(`dependents.${index}.dob`)}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default FamilyInformationSection;
