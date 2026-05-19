import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '../shared/FileUpload';
import { SKILLS_LIST } from '../../constants/dropdowns';
import { Award, Plus, Trash2, Check, Star } from 'lucide-react';

export const SkillsCertificationsSection: React.FC = () => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const [customSkill, setCustomSkill] = useState('');

  // Watch skills array
  const activeSkills = watch('skills') || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications'
  });

  const toggleSkill = (skill: string) => {
    if (activeSkills.includes(skill)) {
      setValue('skills', activeSkills.filter((s: string) => s !== skill), { shouldValidate: true });
    } else {
      setValue('skills', [...activeSkills, skill], { shouldValidate: true });
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = customSkill.trim();
      if (val && !activeSkills.includes(val)) {
        setValue('skills', [...activeSkills, val], { shouldValidate: true });
        setCustomSkill('');
      }
    }
  };

  const handleAddCustomSkillClick = () => {
    const val = customSkill.trim();
    if (val && !activeSkills.includes(val)) {
      setValue('skills', [...activeSkills, val], { shouldValidate: true });
      setCustomSkill('');
    }
  };

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Skills & Certifications</CardTitle>
          <CardDescription className="text-xs">Specify functional competencies and verify third-party certifications</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Skills Tag Section */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">Personnel Capabilities Tagging <span className="text-destructive">*</span></span>
            <span className="text-[10px] text-muted-foreground font-semibold">Select from standard capabilities below or add custom ones by typing.</span>
          </div>

          {/* Core pre-defined tags picker */}
          <div className="flex flex-wrap gap-2 border p-4 rounded-3xl bg-muted/10 max-h-48 overflow-y-auto custom-scrollbar">
            {SKILLS_LIST.map((skill) => {
              const selected = activeSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                    selected 
                      ? "bg-primary text-primary-foreground border-primary shadow-xs" 
                      : "bg-background border-muted hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {selected && <Check className="h-3 w-3 shrink-0" />}
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom tag input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g. OpenCV, Solidity, Figma Advanced (Press Enter)"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              className="rounded-xl h-10 flex-1 bg-background"
            />
            <Button
              type="button"
              onClick={handleAddCustomSkillClick}
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
            >
              Add Skill
            </Button>
          </div>
          {errors.skills && <span className="text-[10px] text-destructive font-bold">{errors.skills.message as string}</span>}
        </div>

        {/* Dynamic Certifications List */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary block uppercase tracking-wider">Professional Licenses & Certifications</span>
              <p className="text-[10px] text-muted-foreground font-semibold">Declare AWS, Scrum, PMI, Google, or other corporate licenses here.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', fileUrl: '', fileName: '' })}
              className="h-8 text-xs font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Certification
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-3xl bg-muted/10">
              <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-foreground">No Certifications Enrolled</h5>
              <p className="text-[10px] text-muted-foreground">Click the button above to add credential verification details.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => {
                const fileUrl = watch(`certifications.${index}.fileUrl`);
                const fileName = watch(`certifications.${index}.fileName`);

                return (
                  <div 
                    key={field.id}
                    className="bg-muted/10 border border-muted/50 p-6 rounded-3xl relative space-y-4 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Certification Item #{index + 1}</span>
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
                        <Label className="font-semibold text-xs">Certificate Name <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="rounded-xl h-10 bg-background"
                          {...register(`certifications.${index}.name`)}
                        />
                        {(errors.certifications as any)?.[index]?.name && (
                          <span className="text-[10px] text-destructive font-bold">{(errors.certifications as any)[index].name.message as string}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-xs">Issuing Authority / Organization <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="e.g. Amazon Web Services"
                          className="rounded-xl h-10 bg-background"
                          {...register(`certifications.${index}.issuer`)}
                        />
                        {(errors.certifications as any)?.[index]?.issuer && (
                          <span className="text-[10px] text-destructive font-bold">{(errors.certifications as any)[index].issuer.message as string}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-xs">Issue Date <span className="text-destructive">*</span></Label>
                        <Input
                          type="date"
                          className="rounded-xl h-10 bg-background"
                          {...register(`certifications.${index}.issueDate`)}
                        />
                        {(errors.certifications as any)?.[index]?.issueDate && (
                          <span className="text-[10px] text-destructive font-bold">{(errors.certifications as any)[index].issueDate.message as string}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-xs">Expiry Date (Optional)</Label>
                        <Input
                          type="date"
                          className="rounded-xl h-10 bg-background"
                          {...register(`certifications.${index}.expiryDate`)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-xs">Credential ID (Optional)</Label>
                        <Input
                          placeholder="e.g. AWS-ASA-4929"
                          className="rounded-xl h-10 bg-background"
                          {...register(`certifications.${index}.credentialId`)}
                        />
                      </div>
                    </div>

                    {/* Certificate File Upload */}
                    <div className="pt-2">
                      <FileUpload
                        label="Upload Certificate (Optional)"
                        accept=".pdf,.png,.jpg,.jpeg"
                        value={fileUrl}
                        fileName={fileName}
                        onChange={(url, name) => {
                          setValue(`certifications.${index}.fileUrl`, url, { shouldValidate: true });
                          setValue(`certifications.${index}.fileName`, name, { shouldValidate: true });
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default SkillsCertificationsSection;
