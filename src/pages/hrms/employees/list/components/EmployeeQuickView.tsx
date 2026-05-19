import React from 'react';
import type { Employee } from '../types/employee.types';
import { maskSensitiveData } from '../utils/employeeHelpers';
import { 
  X, Briefcase, Calendar, Phone, Mail, 
  ShieldCheck, QrCode, CreditCard, Clock, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeQuickViewProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeQuickView: React.FC<EmployeeQuickViewProps> = ({ employee, isOpen, onClose }) => {
  if (!employee || !isOpen) return null;

  const initials = employee.firstName[0] + (employee.lastName ? employee.lastName[0] : '');

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xs cursor-pointer transition-opacity" 
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-xl h-full bg-card border-l shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-350 ease-out">
        
        {/* Sticky Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-base font-bold text-foreground">Personnel folder</h3>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
              Secure HRMS ledger file ID: {employee.id}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* visual profile summary cards */}
          <div className="border rounded-3xl p-5 bg-muted/15 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <EmployeeStatusBadge status={employee.status} />
            </div>

            <div className="w-20 h-20 rounded-full border-4 border-muted/50 bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
              {employee.photoUrl ? (
                <img src={employee.photoUrl} alt={employee.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{initials.toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h4 className="text-base font-bold text-foreground truncate">{employee.fullName}</h4>
              <p className="text-xs font-bold text-primary mt-0.5">
                {employee.designation} <span className="text-muted-foreground/30 font-semibold">•</span> {employee.department}
              </p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                <Badge variant="outline" className="text-[9px] font-bold border-muted text-muted-foreground h-5 py-0 px-2 rounded-full">
                  {employee.employmentType}
                </Badge>
                <Badge variant="outline" className="text-[9px] font-bold border-muted text-muted-foreground h-5 py-0 px-2 rounded-full">
                  {employee.workMode}
                </Badge>
              </div>
            </div>
          </div>

          {/* Onboarding Directory completeness checklist */}
          <div className="border border-dashed p-4 rounded-3xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Ledger profile completeness
              </span>
              <span className="text-xs font-extrabold text-foreground">{employee.profileCompleteness}%</span>
            </div>
            
            <Progress 
              value={employee.profileCompleteness} 
              className="h-2" 
              indicatorClassName={employee.profileCompleteness < 60 ? 'bg-rose-500' : employee.profileCompleteness < 85 ? 'bg-amber-500' : 'bg-emerald-500'} 
            />

            <div className="grid grid-cols-2 gap-2 pt-1 text-[9px] text-muted-foreground font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                KYC Identity checks: {employee.documentVerificationStatus === 'Verified' ? 'Passed' : 'Pending'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                Background check: {employee.backgroundVerificationStatus === 'Approved' ? 'Cleared' : 'In Progress'}
              </div>
            </div>
          </div>

          {/* Tabular Directory Categories */}
          <div className="space-y-4">
            
            {/* 1. Official Corporate Info */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Official employment coordinates</span>
              <div className="grid grid-cols-2 gap-3 border p-4 rounded-3xl bg-muted/5 text-xs">
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Reporting Manager</span>
                  <span className="font-bold text-foreground block mt-0.5 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    {employee.reportingManager || 'Not assigned'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Joining Date</span>
                  <span className="font-bold text-foreground block mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {employee.joiningDate}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Work Location</span>
                  <span className="font-bold text-foreground block mt-0.5 truncate">{employee.workLocation}</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Shift Timings</span>
                  <span className="font-bold text-foreground block mt-0.5 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {employee.shiftTiming}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Contact Details */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Contact parameters</span>
              <div className="grid grid-cols-2 gap-3 border p-4 rounded-3xl bg-muted/5 text-xs">
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Corporate Email</span>
                  <span className="font-bold text-foreground block mt-0.5 truncate flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    {employee.email}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Mobile number</span>
                  <span className="font-bold text-foreground block mt-0.5 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {employee.mobile}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Emergency Contact sync</span>
                  <span className="font-bold text-foreground block mt-0.5">
                    {employee.emergencyContactName ? `${employee.emergencyContactName} (${employee.emergencyContactRelation}) • ${employee.emergencyContactPhone}` : 'No emergency data'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Payroll and Security details */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Payroll & Masked sensitive credentials</span>
              <div className="grid grid-cols-2 gap-3 border p-4 rounded-3xl bg-muted/5 text-xs">
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Annual gross salary</span>
                  <span className="font-extrabold text-primary font-mono block mt-0.5 text-sm">
                    {employee.grossSalary ? `$${employee.grossSalary.toLocaleString()} / yr` : 'Not approved'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Bank account ledger</span>
                  <span className="font-bold text-foreground font-mono block mt-0.5 truncate flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-primary shrink-0" />
                    {employee.bankName ? `${employee.bankName} (${employee.accountNumber})` : 'Not linked'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Universal Account Number (UAN)</span>
                  <span className="font-bold text-foreground font-mono block mt-0.5">
                    {maskSensitiveData(employee.uanNumber)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">National PAN Code</span>
                  <span className="font-bold text-foreground font-mono block mt-0.5">
                    {maskSensitiveData(employee.panNumber)}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary features: QR Access Code card */}
            <div className="border border-primary/20 bg-primary/5 rounded-3xl p-5 flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-zinc-900 border rounded-2xl shrink-0 shadow-sm">
                <QrCode className="h-14 w-14 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">RFID QR Corporate Badge</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">Automated Door Entry Token</span>
                <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold leading-relaxed">
                  Gate clearance matches attendance shift timings. Handover is active on central database synchronization checkin.
                </p>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-transparent hover:bg-emerald-500/20 font-bold text-[8px] py-0 h-4 mt-2 px-2.5 rounded-full">
                  Turnstile Clearance Active
                </Badge>
              </div>
            </div>

            {/* 4. Live Audit Logs timeline */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Onboarding activity timeline audit</span>
              <div className="border p-4 rounded-3xl bg-muted/5 max-h-48 overflow-y-auto custom-scrollbar space-y-4">
                {employee.timelineActivity && employee.timelineActivity.length > 0 ? (
                  <div className="relative pl-5 border-l border-muted space-y-4">
                    {employee.timelineActivity.map(evt => (
                      <div key={evt.id} className="relative text-xs">
                        <div className={`absolute -left-7 top-0.5 h-4 w-4 rounded-full border bg-background flex items-center justify-center text-[7px] ${
                          evt.type === 'success' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' :
                          evt.type === 'warning' ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' :
                          evt.type === 'error' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                          'text-primary border-primary/30 bg-primary/5'
                        }`}>
                          {evt.type === 'success' ? '✓' : 'i'}
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground block">{evt.timestamp}</span>
                          <p className="font-semibold text-foreground mt-0.5">{evt.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground font-semibold">No audit timeline log captured.</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EmployeeQuickView;
