import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../shared/FileUpload';
import { ShieldAlert, Plus, Trash2, FileText } from 'lucide-react';

export const NotesAttachmentsSection: React.FC = () => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const attachmentErrors = errors.attachments as Array<Record<string, { message?: string }>> | undefined;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attachments'
  });

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Tenure Notes & NDA Attachments</CardTitle>
          <CardDescription className="text-xs">Include custom HR notes, sign-off files, and non-disclosure contracts</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Onboarding Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="font-semibold text-xs">Onboarding / Interview Evaluation Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="e.g. Excellent communication skills, cleared system design interview, recommended by the executive board..."
            rows={5}
            className="rounded-2xl bg-background"
            {...register('notes')}
          />
        </div>

        {/* Dynamic Attachments List */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary block uppercase tracking-wider">Extra Contractual Attachments</span>
              <p className="text-[10px] text-muted-foreground font-semibold">Attach fully signed Non-Disclosure Agreements, medical check confirmations, or custom sign-offs.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', fileUrl: '', fileName: '' })}
              className="h-8 text-xs font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Attachment
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-3xl bg-muted/10">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-foreground">No Extra Attachments Uploaded</h5>
              <p className="text-[10px] text-muted-foreground">Click the button above to upload signed contracts or references (standard documents PAN/Aadhaar belong in the KYC tab).</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const fileUrl = watch(`attachments.${index}.fileUrl`);
                const fileName = watch(`attachments.${index}.fileName`);

                return (
                  <div 
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-muted/20 border border-muted/50 p-4 rounded-2xl relative"
                  >
                    <div className="md:col-span-5 space-y-1.5">
                      <Label className="font-semibold text-xs">Attachment Label / Title <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="e.g. Signed NDA Agreement"
                        className="rounded-xl h-10 bg-background font-semibold"
                        {...register(`attachments.${index}.title`)}
                      />
                      {attachmentErrors?.[index] && (
                        <span className="text-[10px] text-destructive font-bold">Label is required</span>
                      )}
                    </div>

                    <div className="md:col-span-6">
                      <FileUpload
                        label="Upload Signed Document"
                        accept=".pdf,.png,.jpg,.jpeg"
                        value={fileUrl}
                        fileName={fileName}
                        onChange={(url, name) => {
                          setValue(`attachments.${index}.fileUrl`, url, { shouldValidate: true });
                          setValue(`attachments.${index}.fileName`, name, { shouldValidate: true });
                        }}
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
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default NotesAttachmentsSection;
