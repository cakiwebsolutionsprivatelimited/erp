import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '../shared/FileUpload';
import { FileText, ShieldAlert, EyeOff } from 'lucide-react';

export const DocumentsKycSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const panFileUrl = watch('panFileUrl');
  const panFileName = watch('panFileName');
  const aadhaarFileUrl = watch('aadhaarFileUrl');
  const aadhaarFileName = watch('aadhaarFileName');
  const passportFileUrl = watch('passportFileUrl');
  const passportFileName = watch('passportFileName');

  return (
    <Card className="border shadow-xs rounded-3xl p-2 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold">Documents & KYC Verification</CardTitle>
          <CardDescription className="text-xs">Provide government-mandated tax identifiers and identity documents</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-3">
        {/* Core Government Identification Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="panNumber" className="font-semibold text-xs">PAN Card Number <span className="text-destructive">*</span></Label>
            <Input
              id="panNumber"
              placeholder="e.g. ABCDE1234F"
              className="rounded-xl h-10 uppercase font-semibold tracking-wider bg-background"
              {...register('panNumber')}
            />
            {errors.panNumber && <span className="text-[10px] text-destructive font-bold">{errors.panNumber.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aadhaarNumber" className="font-semibold text-xs">Aadhaar Card Number (12 Digits) <span className="text-destructive">*</span></Label>
            <Input
              id="aadhaarNumber"
              placeholder="e.g. 562389104523"
              maxLength={12}
              className="rounded-xl h-10 font-semibold tracking-wider bg-background"
              {...register('aadhaarNumber')}
            />
            {errors.aadhaarNumber && <span className="text-[10px] text-destructive font-bold">{errors.aadhaarNumber.message as string}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passportNumber" className="font-semibold text-xs">Passport Number (Optional)</Label>
            <Input
              id="passportNumber"
              placeholder="e.g. Z1234567"
              className="rounded-xl h-10 font-semibold uppercase tracking-wider bg-background"
              {...register('passportNumber')}
            />
          </div>
        </div>

        {/* KYC Document Uploads */}
        <div className="border-t pt-4 space-y-6">
          <span className="text-xs font-bold text-primary block mb-3 uppercase tracking-wider">KYC Document Attachments</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FileUpload
                label="Upload PAN Card Copy"
                accept=".pdf,.png,.jpg,.jpeg"
                required={true}
                value={panFileUrl}
                fileName={panFileName}
                onChange={(url, name) => {
                  setValue('panFileUrl', url, { shouldValidate: true });
                  setValue('panFileName', name, { shouldValidate: true });
                }}
              />
              {errors.panFileUrl && <span className="text-[10px] text-destructive font-bold">{errors.panFileUrl.message as string}</span>}
            </div>

            <div className="space-y-2">
              <FileUpload
                label="Upload Aadhaar Card Copy (Front & Back)"
                accept=".pdf,.png,.jpg,.jpeg"
                required={true}
                value={aadhaarFileUrl}
                fileName={aadhaarFileName}
                onChange={(url, name) => {
                  setValue('aadhaarFileUrl', url, { shouldValidate: true });
                  setValue('aadhaarFileName', name, { shouldValidate: true });
                }}
              />
              {errors.aadhaarFileUrl && <span className="text-[10px] text-destructive font-bold">{errors.aadhaarFileUrl.message as string}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <FileUpload
              label="Upload Passport Document (Optional)"
              accept=".pdf,.png,.jpg,.jpeg"
              value={passportFileUrl}
              fileName={passportFileName}
              onChange={(url, name) => {
                setValue('passportFileUrl', url, { shouldValidate: true });
                setValue('passportFileName', name, { shouldValidate: true });
              }}
            />
          </div>
        </div>

        {/* Informative Security Alert */}
        <div className="flex items-start gap-2.5 bg-muted/30 border border-amber-500/25 p-3 rounded-2xl text-[11px] text-muted-foreground leading-relaxed font-semibold">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span>All uploaded identification numbers and copies are masked under AES-256 standard and parsed dynamically by our OCR processor. They are only viewable by authorized payroll auditors and system compliance staff.</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default DocumentsKycSection;
