export interface Dependent {
  name: string;
  relationship: string;
  dob: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  passingYear: string;
  grade: string;
  fileUrl?: string;
  fileName?: string;
}

export interface ExperienceEntry {
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  fileUrl?: string;
  fileName?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface AttachmentEntry {
  title: string;
  fileUrl: string;
  fileName?: string;
}

export interface EmployeeFormData {
  // Personal Info
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  avatarUrl?: string;
  
  // Employment Details
  department: string;
  designation: string;
  joiningDate: string;
  reportingManager: string;
  officialEmail: string;
  confirmationDate: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  hybridDetails?: string;
  remoteCountry?: string;
  employeeType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  isRehire: boolean;
  previousEmployeeId?: string;

  // Contact & Address
  mobile: string;
  personalEmail: string;
  presentAddress: {
    street: string;
    city: string;
    state: string;
    district: string;
    pin: string;
  };
  sameAsPresent: boolean;
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    district: string;
    pin: string;
  };
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Family Info
  fatherName: string;
  motherName: string;
  spouseName?: string;
  dependents: Dependent[];

  // Lists
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  certifications: CertificationEntry[];

  // Documents & KYC
  panNumber: string;
  aadhaarNumber: string;
  passportNumber?: string;
  panFileUrl: string;
  panFileName?: string;
  aadhaarFileUrl: string;
  aadhaarFileName?: string;
  passportFileUrl?: string;
  passportFileName?: string;

  // Bank & Payroll
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'Savings' | 'Current';

  // Medical
  bloodGroup: string;
  allergies?: string;
  medicalConditions?: string;
  insuranceOpted: boolean;
  insuranceProvider?: string;
  sumInsured?: number;

  // System Access
  username: string;
  password?: string;
  role: 'HR' | 'Admin' | 'Employee' | 'Manager';
  enable2FA: boolean;

  // Salary
  basicSalary: number;
  hra: number;
  lta: number;
  specialAllowance: number;
  employerPf: number;
  employeePf: number;
  professionalTax: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;

  // PF/Statutory
  uanNumber?: string;
  esiNumber?: string;
  pfEnrolled: boolean;
  esiEnrolled: boolean;
  ptEnrolled: boolean;
  statutoryDeductionsEnrolled: boolean;

  // Assets
  laptopAssigned: boolean;
  laptopSerial?: string;
  laptopModel?: string;
  joiningKitIssued: boolean;
  kitItems: string[]; // e.g., 'T-Shirt', 'Notebook', 'Bottle', 'Pen', 'ID Badge'
  assetHandoverDate?: string;

  // Notes
  notes?: string;
  attachments: AttachmentEntry[];
}
