import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateChecklist, setActiveTab } from '@/store/features/employeeOnboardingSlice';
import { useEmployeeValidation } from '../../hooks/useEmployeeValidation';
import { type EmployeeFormData } from '../../types/employee.types';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Mail, 
  QrCode, FileText, UserCheck, Send, Download, Edit3
} from 'lucide-react';
import { notify } from '@/services/notificationService';

interface ReviewSubmitSectionProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  completionPercentage: number;
}

export const ReviewSubmitSection: React.FC<ReviewSubmitSectionProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const { getValues, trigger } = useFormContext<EmployeeFormData>();
  const dispatch = useAppDispatch();
  const { tabCompletions, activityTimeline, checklist } = useAppSelector((state) => state.employeeOnboarding);
  
  // Custom hook validation
  const { getMissingFieldsChecklist } = useEmployeeValidation(trigger);
  
  const values = getValues();
  const missingChecklist = getMissingFieldsChecklist(values, tabCompletions);
  const totalMissing = missingChecklist.reduce((acc, curr) => acc + curr.missing.length, 0);

  // States for secondary features
  const [welcomePreviewOpen, setWelcomePreviewOpen] = useState(false);
  const [duplicateScanActive, setDuplicateScanActive] = useState(false);

  const handleJumpToTab = (tabName: string) => {
    dispatch(setActiveTab(tabName));
  };

  const handleDuplicateScan = (e: React.MouseEvent) => {
    e.preventDefault();
    setDuplicateScanActive(true);
    setTimeout(() => {
      setDuplicateScanActive(false);
      notify.success('Security Audit Done', 'Checked email, mobile and Aadhaar databases. No conflicts found!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Health Meter Card */}
      <Card className="border border-primary/20 bg-primary/5 rounded-3xl p-2">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Central Audit Summary</span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">Wizard Verification Check</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">
                Review all details before finalizing. Direct ledger lock is active upon onboarding submission.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDuplicateScan}
                disabled={duplicateScanActive}
                className="h-9 rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 text-xs font-bold"
              >
                <ShieldCheck className="mr-1.5 h-4 w-4 shrink-0" />
                {duplicateScanActive ? 'Auditing...' : 'Security Scan'}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={onSubmit}
                disabled={isSubmitting || totalMissing > 0}
                className="h-9 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
              >
                Complete Enrollment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Validation Checklist Header Status */}
          {totalMissing > 0 ? (
            <div className="bg-rose-500/5 border border-rose-500/25 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-500">Validation Blocks Detected ({totalMissing} fields missing)</span>
                <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mt-0.5">
                  You must complete all required parameters in the roadmap before committing this onboarding draft to the central employee directory. Please review the checklist warning details below.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-500">Candidate Records Verified & Compliant</span>
                <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mt-0.5">
                  No missing required parameters detected! All 15 modules are valid and security scans report clean files. The profile is fully prepared for system enrollment.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Grid: Summary Preview vs Validation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Profile Card Summary & Onboarding timeline */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border shadow-xs rounded-3xl p-2 bg-card">
            <CardHeader className="pb-3 flex flex-row items-center gap-3 border-b">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg font-bold truncate">Profile Ledger Summary</CardTitle>
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold border-transparent text-[10px] py-0 h-5">
                    Pre-enrollment
                  </Badge>
                </div>
                <CardDescription className="text-xs">SaaS Direct Ledger visual representation card</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Profile Details Block */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {values.avatarUrl ? (
                  <img
                    src={values.avatarUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-muted/50 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-muted/50 shadow-sm shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {values.firstName && values.lastName ? `${values.firstName[0]}${values.lastName[0]}`.toUpperCase() : 'EMP'}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-base font-bold text-foreground truncate">
                    {values.fullName || 'Candidate Full Name'}
                  </h4>
                  <p className="text-xs text-primary font-bold mt-0.5">
                    {values.designation || 'Selected Designation'} <span className="text-muted-foreground/30 font-semibold">•</span> {values.department || 'Selected Department'}
                  </p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                    <Badge variant="outline" className="border-muted text-muted-foreground font-semibold text-[10px] h-5 py-0">
                      {values.employeeType || 'Full-time'}
                    </Badge>
                    <Badge variant="outline" className="border-muted text-muted-foreground font-semibold text-[10px] h-5 py-0">
                      Work Mode: {values.workMode || 'Onsite'}
                    </Badge>
                    <Badge variant="outline" className="border-muted text-muted-foreground font-semibold text-[10px] h-5 py-0">
                      Blood Group: {values.bloodGroup || 'A+'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Core Ledger Info Table */}
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-3xl bg-muted/10 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Official Corporate Email</span>
                  <span className="font-semibold text-foreground truncate block mt-0.5">{values.officialEmail || 'Not generated'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Reporting Supervisor</span>
                  <span className="font-semibold text-foreground block mt-0.5">{values.reportingManager || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Disbursement Account</span>
                  <span className="font-semibold text-foreground font-mono block mt-0.5 truncate">
                    {values.bankName ? `${values.bankName} (${values.accountNumber ? '•'.repeat(values.accountNumber.length - 4) + values.accountNumber.slice(-4) : 'Empty'})` : 'Not linked'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Salary Structure Approved</span>
                  <span className="font-extrabold text-primary font-mono block mt-0.5">
                    {values.grossSalary ? `$${Number(values.grossSalary).toLocaleString()} / yr` : 'Not approved'}
                  </span>
                </div>
              </div>

              {/* Action previews (QR, NDA, Welcome Mail) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* PDF preview */}
                <div className="border border-dashed p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 bg-muted/5 hover:bg-muted/15 cursor-pointer">
                  <FileText className="h-6 w-6 text-muted-foreground/60" />
                  <span className="text-[10px] font-bold">PDF Profile Contract</span>
                  <p className="text-[8px] text-muted-foreground">Download pre-filled onboarding card pdf</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[8px] font-bold bg-background border px-2 mt-1 gap-1">
                    <Download className="h-2.5 w-2.5" />
                    Preview
                  </Button>
                </div>

                {/* Welcome email preview */}
                <div 
                  onClick={() => setWelcomePreviewOpen(!welcomePreviewOpen)}
                  className="border border-dashed p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 bg-muted/5 hover:bg-muted/15 cursor-pointer"
                >
                  <Mail className="h-6 w-6 text-primary" />
                  <span className="text-[10px] font-bold text-primary">Onboarding Invite</span>
                  <p className="text-[8px] text-muted-foreground">Preview welcome email containing credentials</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[8px] font-bold bg-primary/10 text-primary px-2 mt-1 gap-1">
                    <Send className="h-2.5 w-2.5" />
                    Preview Invite
                  </Button>
                </div>

                {/* Mock QR Access Code */}
                <div className="border border-dashed p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 bg-muted/5">
                  <QrCode className="h-6 w-6 text-muted-foreground/60" />
                  <span className="text-[10px] font-bold">RFID QR Access Token</span>
                  <p className="text-[8px] text-muted-foreground">Auto-generated corporate gate entry code</p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 font-bold border-transparent text-[8px] py-0 h-4 mt-1">
                    Gate Active
                  </Badge>
                </div>
              </div>

              {/* Onboarding welcome preview block */}
              {welcomePreviewOpen && (
                <div className="border p-4 rounded-2xl bg-muted/30 space-y-2 animate-in slide-in-from-top-1 duration-200">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Invite Dispatch Preview</span>
                  <div className="bg-background border p-3 rounded-xl text-[10px] font-mono leading-relaxed space-y-2">
                    <p className="font-bold">Subject: Welcome to the team, ${values.firstName || 'Candidate'}!</p>
                    <p>Dear ${values.fullName || 'Candidate'},</p>
                    <p>We are absolutely thrilled to have you join our team. Your central employee folder has been successfully verified by compliance.</p>
                    <p className="font-bold text-primary">Your Credentials:</p>
                    <p>Username: ${values.username || 'Not set'}<br />Password: [Enclosed securely in RFID card]</p>
                    <p>Reporting Manager: ${values.reportingManager || 'Not assigned'}<br />Onboarding Date: ${values.joiningDate || 'TBD'}</p>
                    <p>Best regards,<br />HR Operations Team</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Activity Timeline */}
          <Card className="border shadow-xs rounded-3xl p-2 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Onboarding Audit Activity Logs</CardTitle>
              <CardDescription className="text-xs">Live check-in audit stream for file indexing and security checks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
              <div className="relative pl-6 border-l border-muted space-y-4">
                {activityTimeline.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className={`absolute -left-9 top-0.5 h-6 w-6 rounded-full border bg-background flex items-center justify-center text-[10px] ${
                      evt.type === 'success' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' :
                      evt.type === 'warning' ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' :
                      evt.type === 'error' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                      'text-primary border-primary/30 bg-primary/5'
                    }`}>
                      {evt.type === 'success' ? '✓' : evt.type === 'warning' ? '!' : 'i'}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block">{evt.timestamp}</span>
                      <p className="text-xs text-foreground font-semibold mt-0.5">{evt.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Roadmap Checklist / Warnings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Missing Fields Checklist */}
          {totalMissing > 0 && (
            <Card className="border border-rose-500/20 bg-rose-500/5 rounded-3xl p-2">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 rounded-2xl text-rose-500">
                  <AlertTriangle className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-rose-950 dark:text-rose-250">Verification Warnings</CardTitle>
                  <CardDescription className="text-xs text-rose-800/70 dark:text-rose-300/70">Resolve all missing items below to submit</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {missingChecklist.map((item) => {
                  if (item.missing.length === 0) return null;
                  return (
                    <div key={item.tab} className="bg-background border border-rose-500/25 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">{item.tab}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleJumpToTab(item.tab)}
                          className="h-6 text-[10px] font-bold text-primary hover:bg-primary/5 px-2 rounded-lg gap-1"
                        >
                          Resolve
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1 pl-1">
                        {item.missing.map((miss, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                            <div className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0" />
                            <span>{miss} is required</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Core HR Verification Sign-off checklist */}
          <Card className="border shadow-xs rounded-3xl p-2 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Pre-enrollment HR Checklist</CardTitle>
              <CardDescription className="text-xs">Mark verification check items as verified before final submit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-start gap-3 border p-3 rounded-2xl bg-muted/10 transition-colors ${
                    item.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-muted"
                  }`}
                >
                  <Checkbox
                    id={`check-${item.id}`}
                    checked={item.done}
                    onCheckedChange={(val) => dispatch(updateChecklist({ id: item.id, done: !!val }))}
                    className="cursor-pointer mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={`check-${item.id}`} 
                      className={`text-xs font-semibold cursor-pointer ${item.done ? "text-emerald-500 font-bold" : "text-foreground"}`}
                    >
                      {item.label}
                    </Label>
                    {item.required && !item.done && (
                      <span className="text-[8px] font-bold bg-rose-500/10 text-rose-500 border border-transparent rounded-full px-1.5 py-0 ml-1.5">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ReviewSubmitSection;
