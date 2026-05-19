import React from 'react';
import { 
  User, Briefcase, MapPin, Users, GraduationCap, History, Award, 
  FileText, Landmark, HeartPulse, ShieldAlert, Key, ClipboardList, 
  Scale, Package, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setActiveTab } from '@/store/features/employeeOnboardingSlice';
import { cn } from '@/utils';

// Helper list of tabs and their corresponding icons
export const TABS_LIST = [
  { name: 'Personal Information', icon: User },
  { name: 'Employment Details', icon: Briefcase },
  { name: 'Contact & Address', icon: MapPin },
  { name: 'Family Information', icon: Users },
  { name: 'Education', icon: GraduationCap },
  { name: 'Work Experience', icon: History },
  { name: 'Skills & Certifications', icon: Award },
  { name: 'Documents & KYC', icon: FileText },
  { name: 'Bank & Payroll', icon: Landmark },
  { name: 'Medical Information', icon: HeartPulse },
  { name: 'System Access', icon: Key },
  { name: 'Salary Structure', icon: ClipboardList },
  { name: 'PF / ESI / Statutory', icon: Scale },
  { name: 'Assets & Joining Kit', icon: Package },
  { name: 'Notes & Attachments', icon: ShieldAlert },
  { name: 'Review & Submit', icon: CheckCircle2 }
];

interface TabNavigationProps {
  onTabChange: (tabName: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ onTabChange, errors }) => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.employeeOnboarding.activeTab);
  const tabCompletions = useAppSelector((state) => state.employeeOnboarding.tabCompletions);

  // Check if a tab has error elements based on React Hook Form errors
  const getTabErrorState = (tabName: string): boolean => {
    switch (tabName) {
      case 'Personal Information':
        return !!(errors.firstName || errors.lastName || errors.dob || errors.gender || errors.maritalStatus || errors.nationality);
      case 'Employment Details':
        return !!(errors.department || errors.designation || errors.joiningDate || errors.reportingManager || errors.officialEmail || errors.confirmationDate || errors.hybridDetails || errors.remoteCountry || errors.previousEmployeeId);
      case 'Contact & Address':
        return !!(errors.mobile || errors.personalEmail || errors.presentAddress || errors.permanentAddress || errors.emergencyContactName || errors.emergencyContactPhone);
      case 'Family Information':
        return !!(errors.fatherName || errors.motherName || errors.dependents);
      case 'Education':
        return !!errors.education;
      case 'Work Experience':
        return !!errors.experience;
      case 'Skills & Certifications':
        return !!(errors.skills || errors.certifications);
      case 'Documents & KYC':
        return !!(errors.panNumber || errors.aadhaarNumber || errors.panFileUrl || errors.aadhaarFileUrl);
      case 'Bank & Payroll':
        return !!(errors.bankName || errors.accountHolderName || errors.accountNumber || errors.ifscCode || errors.branchName);
      case 'Medical Information':
        return !!(errors.bloodGroup || errors.insuranceProvider);
      case 'System Access':
        return !!(errors.username || errors.password);
      case 'Salary Structure':
        return !!errors.grossSalary;
      case 'PF / ESI / Statutory':
        return !!errors.uanNumber;
      case 'Assets & Joining Kit':
        return !!errors.laptopSerial;
      case 'Notes & Attachments':
        return !!errors.attachments;
      default:
        return false;
    }
  };

  const handleTabClick = (tabName: string) => {
    dispatch(setActiveTab(tabName));
    onTabChange(tabName);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Mobile Select Dropdown Navigation */}
      <div className="md:hidden">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Active Section</label>
        <select
          value={activeTab}
          onChange={(e) => handleTabClick(e.target.value)}
          className="w-full h-11 px-3 border border-muted bg-background rounded-xl font-semibold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {TABS_LIST.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name} {tabCompletions[tab.name] ? '✓' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Sticky Sidebar Navigation */}
      <div className="hidden md:flex flex-col gap-1 border-r pr-4 max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Onboarding Roadmap</span>
        {TABS_LIST.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          const isComplete = tabCompletions[tab.name];
          const hasError = getTabErrorState(tab.name);

          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => handleTabClick(tab.name)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-200 group border border-transparent",
                isActive 
                  ? "bg-primary/10 text-primary border-primary/20 font-bold scale-[1.02]" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon 
                  size={16} 
                  className={cn(
                    "shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <span className="truncate">{tab.name}</span>
              </div>
              
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {isComplete && !hasError && (
                  <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500/10" />
                )}
                {hasError && (
                  <AlertCircle size={14} className="text-destructive fill-destructive/10 animate-bounce" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
