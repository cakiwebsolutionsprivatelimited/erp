import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../shared/FileUpload';
import { GraduationCap, Plus, Trash2, BookOpen } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const eduErrors = errors.education as Array<Record<string, { message?: string }>> | undefined;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Academic Records</CardTitle>
          <CardDescription className="text-xs">Add undergraduate degrees, post-graduate credentials, and secondary schooling data</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary block uppercase tracking-wider">Educational Roster</span>
            <p className="text-[10px] text-muted-foreground font-semibold">Enter academic credentials chronologically. PDF transcripts are encrypted on save.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ degree: '', institution: '', passingYear: '', grade: '', fileUrl: '', fileName: '' })}
            className="h-8 text-xs font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Credential
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-3xl bg-muted/10">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-foreground">No Credentials Added</h5>
            <p className="text-[10px] text-muted-foreground">Click the button above to add the candidate's highest educational qualification details.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => {
              const fileUrl = watch(`education.${index}.fileUrl`);
              const fileName = watch(`education.${index}.fileName`);

              return (
                <div 
                  key={field.id}
                  className="bg-muted/10 border border-muted/50 p-6 rounded-3xl relative space-y-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Qualification Item #{index + 1}</span>
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
                      <Label className="font-semibold text-xs">Degree / Certification Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. B.Tech Computer Science"
                        className="rounded-xl h-10 bg-background"
                        {...register(`education.${index}.degree`)}
                      />
                      {eduErrors?.[index]?.degree && (
                        <span className="text-[10px] text-destructive font-bold">{eduErrors[index].degree.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Institution / University Name <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Stanford University"
                        className="rounded-xl h-10 bg-background"
                        {...register(`education.${index}.institution`)}
                      />
                      {eduErrors?.[index]?.institution && (
                        <span className="text-[10px] text-destructive font-bold">{eduErrors[index].institution.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Passing Year (YYYY) <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. 2022"
                        className="rounded-xl h-10 bg-background"
                        {...register(`education.${index}.passingYear`)}
                      />
                      {eduErrors?.[index]?.passingYear && (
                        <span className="text-[10px] text-destructive font-bold">{eduErrors[index].passingYear.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-xs">Grade / Percentage / GPA <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. 3.8/4.0 or 92%"
                        className="rounded-xl h-10 bg-background"
                        {...register(`education.${index}.grade`)}
                      />
                      {eduErrors?.[index]?.grade && (
                        <span className="text-[10px] text-destructive font-bold">{eduErrors[index].grade.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Certificate Upload inside repeat loop */}
                  <div className="pt-2">
                    <FileUpload
                      label="Upload Graduation Degree / Transcript (Optional)"
                      accept=".pdf,.png,.jpg,.jpeg"
                      value={fileUrl}
                      fileName={fileName}
                      onChange={(url, name) => {
                        setValue(`education.${index}.fileUrl`, url, { shouldValidate: true });
                        setValue(`education.${index}.fileName`, name, { shouldValidate: true });
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
export default EducationSection;
