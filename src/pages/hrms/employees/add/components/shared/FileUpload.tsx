import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { employeeService } from '../../services/employee.service';
import { cn } from '@/utils';
import { notify } from '@/services/notificationService';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  value?: string; // URL
  fileName?: string;
  onChange: (url: string, name: string) => void;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 5,
  value,
  fileName,
  onChange,
  required = false
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      notify.error('File Too Large', `Document exceeds the maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    setUploadProgress(0);
    try {
      const res = await employeeService.uploadDocument(file, (percent) => {
        setUploadProgress(percent);
      });
      onChange(res.fileUrl, res.fileName);
      setUploadProgress(null);
      notify.success('Upload Successful', `Successfully uploaded ${file.name}`);
    } catch (err) {
      setUploadProgress(null);
      notify.error('Upload Failed', 'Failed to upload document. Please retry.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        {value && (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent font-medium text-xs">
            OCR Ready
          </Badge>
        )}
      </div>

      {!value && uploadProgress === null ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-muted/20 hover:bg-muted/40 hover:border-primary/50",
            isDragActive ? "border-primary bg-primary/5" : "border-muted"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="p-3 bg-background rounded-full border shadow-xs text-muted-foreground group-hover:text-primary transition-colors">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-center mt-1">
            <span className="text-primary hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-[10px] text-muted-foreground text-center">
            Supported formats: PDF, PNG, JPG, JPEG (Max {maxSizeMB}MB)
          </p>
        </div>
      ) : uploadProgress !== null ? (
        <div className="border border-dashed rounded-2xl p-6 flex flex-col justify-center gap-3 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary animate-pulse">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Uploading Document...</p>
              <p className="text-[10px] text-muted-foreground">Encryption and OCR sync active</p>
            </div>
            <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-150" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-2xl p-4 flex items-center justify-between gap-3 bg-emerald-500/5 border-emerald-500/25">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-foreground">{fileName || 'document.pdf'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-[10px] text-muted-foreground font-semibold">Verified Secure</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick helper badge import for FileUpload
import { Badge } from '@/components/ui/badge';
