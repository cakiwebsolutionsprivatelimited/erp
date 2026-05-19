import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../shared/FileUpload';
import { History, Plus, Trash2, ShieldCheck } from 'lucide-react';

export const WorkExperienceSection: React.FC = () => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <History className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Professional Experience</CardTitle>
          <CardDescription className="text-xs">Document corporate work history, previous roles, and relief documents</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary block uppercase tracking-wider">Employment History</span>
            <p className="text-[10px] text-muted-foreground font-semibold">List past companies starting from the most recent. Background audits reference these dates.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ company: '', designation: '', startDate: '', endDate: '', responsibilities: '', fileUrl: '', fileName: '' })}
            className="h-8 text-xs font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Employment
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-3xl bg-muted/10">
            <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-foreground">No Prior Experience Added</h5>
            <p className="text-[10px] text-muted-foreground">Click the button above to add previous corporate roles or check-ins (e.g. for fresher profiles leave empty).</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => {
              const fileUrl = watch(`experience.${index}.fileUrl`);
              const fileName = watch(`experience.${index}.fileName`);

              return (
                <div 
                  key={field.id}
                  className="bg-muted/10 border border-muted/50 p-6 rounded-3xl relative space-y-4 shadow-2xs animate-in fade-in-30"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Corporate Tenancy #{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg px-2 gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Company Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Pied Piper Inc."
                        className="rounded-xl h-10 bg-background"
                        {...register(`experience.${index}.company`)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(errors.experience as any)?.[index]?.company && (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <span className="text-[10px] text-destructive font-bold">{(errors.experience as any)[index].company.message as string}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Designation / Role <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Senior Software Specialist"
                        className="rounded-xl h-10 bg-background"
                        {...register(`experience.${index}.designation`)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(errors.experience as any)?.[index]?.designation && (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <span className="text-[10px] text-destructive font-bold">{(errors.experience as any)[index].designation.message as string}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Start Date <span className="text-destructive">*</span></Label>
                      <Input
                        type="date"
                        className="rounded-xl h-10 bg-background"
                        {...register(`experience.${index}.startDate`)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(errors.experience as any)?.[index]?.startDate && (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <span className="text-[10px] text-destructive font-bold">{(errors.experience as any)[index].startDate.message as string}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">End Date <span className="text-destructive">*</span></Label>
                      <Input
                        type="date"
                        className="rounded-xl h-10 bg-background"
                        {...register(`experience.${index}.endDate`)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(errors.experience as any)?.[index]?.endDate && (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <span className="text-[10px] text-destructive font-bold">{(errors.experience as any)[index].endDate.message as string}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Key Responsibilities & Project Contributions <span className="text-destructive">*</span></Label>
                    <Textarea
                      placeholder="e.g. Maintained middle-out compression algorithms, migrated private server rooms to AWS clouds..."
                      rows={3}
                      className="rounded-xl bg-background"
                      {...register(`experience.${index}.responsibilities`)}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(errors.experience as any)?.[index]?.responsibilities && (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <span className="text-[10px] text-destructive font-bold">{(errors.experience as any)[index].responsibilities.message as string}</span>
                    )}
                  </div>

                  {/* Attachment Upload inside repeat loop */}
                  <div className="pt-2">
                    <FileUpload
                      label="Upload Experience Letter / Relieving Certificate (Optional)"
                      accept=".pdf,.png,.jpg,.jpeg"
                      value={fileUrl}
                      fileName={fileName}
                      onChange={(url, name) => {
                        setValue(`experience.${index}.fileUrl`, url, { shouldValidate: true });
                        setValue(`experience.${index}.fileName`, name, { shouldValidate: true });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default WorkExperienceSection;
