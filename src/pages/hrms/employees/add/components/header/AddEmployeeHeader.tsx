import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle, ArrowLeft, RefreshCw, Sparkles, FileClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/store';
import { cn } from '@/utils';

interface AddEmployeeHeaderProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  onRestoreDraft: () => void;
  hasDraft: boolean;
  isSubmitting: boolean;
  completionPercentage: number;
  employeeId: string;
}

export const AddEmployeeHeader: React.FC<AddEmployeeHeaderProps> = ({
  onSaveDraft,
  onSubmit,
  onRestoreDraft,
  hasDraft,
  isSubmitting,
  completionPercentage,
  employeeId
}) => {
  const navigate = useNavigate();
  const { lastSaved, isAutoSaving, hasUnsavedChanges } = useAppSelector((state) => state.employeeOnboarding);

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b pb-4 pt-2 px-1 flex flex-col gap-4">
      {/* Top Breadcrumb and Meta Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/hrms')}
            className="h-9 w-9 rounded-full border-muted bg-background hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Personnel Onboarding</h1>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent font-bold text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                SaaS Workflows
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-medium">
              HRMS Module <span className="text-muted-foreground/30">•</span> New Hire Enrollment
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {hasDraft && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRestoreDraft}
              className="h-9 rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Restore Draft
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            className="h-9 rounded-xl bg-background border-muted hover:bg-muted text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5 text-muted-foreground" />
            Save Draft
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-9 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-primary shadow-sm hover:bg-primary/90"
          >
            {isSubmitting ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
          </Button>
        </div>
      </div>

      {/* Stats and Progress Tracker Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 bg-muted/20 border border-muted/50 p-3 rounded-2xl">
        {/* Employee ID & Status Badge */}
        <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Employee ID</span>
            <span className="text-sm font-bold text-primary tracking-wide">{employeeId || 'Generating...'}</span>
          </div>
          <div className="h-6 w-[1px] bg-muted hidden md:block" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Onboarding Badge</span>
            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold border-transparent text-xs py-0 h-5 mt-0.5">
              Drafting Setup
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="md:col-span-5 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Wizard Completion</span>
              <span className="text-primary font-bold">{completionPercentage}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Saving Status Indicator */}
        <div className="md:col-span-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-semibold">
          {isAutoSaving ? (
            <span className="flex items-center gap-1.5 text-primary animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Auto-saving draft...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-emerald-500">
              <FileClock className="h-3.5 w-3.5" />
              Saved at {lastSaved}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-muted-foreground/60">
              No draft saved yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
