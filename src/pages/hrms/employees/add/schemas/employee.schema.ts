import { z } from 'zod';
import { calculateAge } from '../utils/calculations';

// 1. Personal Information Schema
export const personalInfoSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required').refine((val) => {
    const age = calculateAge(val);
    return age >= 18;
  }, { message: 'Employee must be at least 18 years old' }),
  gender: z.string().min(1, 'Gender is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  avatarUrl: z.string().optional(),
});

// 2. Employment Details Schema
export const employmentDetailsSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  reportingManager: z.string().min(1, 'Reporting manager is required'),
  officialEmail: z.string().email('Please enter a valid official email address'),
  confirmationDate: z.string().min(1, 'Confirmation date is required'),
  workMode: z.enum(['Remote', 'Hybrid', 'Onsite']),
  hybridDetails: z.string().optional(),
  remoteCountry: z.string().optional(),
  employeeType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern']),
  isRehire: z.boolean().default(false),
  previousEmployeeId: z.string().optional(),
}).refine((data) => {
  if (data.workMode === 'Hybrid') {
    return !!data.hybridDetails && data.hybridDetails.length > 0;
  }
  return true;
}, {
  message: 'Hybrid schedule details are required',
  path: ['hybridDetails']
}).refine((data) => {
  if (data.workMode === 'Remote') {
    return !!data.remoteCountry && data.remoteCountry.length > 0;
  }
  return true;
}, {
  message: 'Remote country is required',
  path: ['remoteCountry']
}).refine((data) => {
  if (data.isRehire) {
    return !!data.previousEmployeeId && data.previousEmployeeId.length > 0;
  }
  return true;
}, {
  message: 'Previous Employee ID is required for rehires',
  path: ['previousEmployeeId']
});

// 3. Contact & Address Schema
export const contactAddressSchema = z.object({
  mobile: z.string().min(10, 'Mobile must be at least 10 digits').regex(/^[+0-9\s-]+$/, 'Invalid phone number format'),
  personalEmail: z.string().email('Please enter a valid personal email'),
  presentAddress: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    district: z.string().min(2, 'District is required'),
    pin: z.string().min(5, 'PIN code must be at least 5 digits').max(10, 'PIN code too long'),
  }),
  sameAsPresent: z.boolean().default(false),
  permanentAddress: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    district: z.string().min(2, 'District is required'),
    pin: z.string().min(5, 'PIN code must be at least 5 digits').max(10, 'PIN code too long'),
  }),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactRelation: z.string().min(1, 'Relationship is required'),
  emergencyContactPhone: z.string().min(10, 'Phone must be at least 10 digits'),
});

// 4. Family Info Schema
export const familyInfoSchema = z.object({
  fatherName: z.string().min(2, 'Father name is required'),
  motherName: z.string().min(2, 'Mother name is required'),
  spouseName: z.string().optional(),
  dependents: z.array(z.object({
    name: z.string().min(2, 'Name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    dob: z.string().min(1, 'Date of birth is required'),
  })).default([]),
});

// 5. Lists (Education, Experience, Skills, Certifications)
export const listsSchema = z.object({
  education: z.array(z.object({
    degree: z.string().min(2, 'Degree/Certification is required'),
    institution: z.string().min(2, 'Institution name is required'),
    passingYear: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year'),
    grade: z.string().min(1, 'Grade/GPA/Percentage is required'),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
  })).default([]),
  experience: z.array(z.object({
    company: z.string().min(2, 'Company name is required'),
    designation: z.string().min(2, 'Designation is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    responsibilities: z.string().min(5, 'Brief responsibilities description is required'),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
  })).default([]),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  certifications: z.array(z.object({
    name: z.string().min(2, 'Certificate name is required'),
    issuer: z.string().min(2, 'Issuing organization is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
  })).default([]),
});

// 6. Documents & KYC Schema
export const documentsKycSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Card number (e.g. ABCDE1234F)'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar Number must be exactly 12 digits'),
  passportNumber: z.string().optional(),
  panFileUrl: z.string().min(1, 'PAN Card document is required'),
  panFileName: z.string().optional(),
  aadhaarFileUrl: z.string().min(1, 'Aadhaar Card document is required'),
  aadhaarFileName: z.string().optional(),
  passportFileUrl: z.string().optional(),
  passportFileName: z.string().optional(),
});

// 7. Bank & Payroll Schema
export const bankPayrollSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  accountNumber: z.string().min(9, 'Account number must be at least 9 digits').max(18, 'Account number too long'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g. SBIN0001234)'),
  branchName: z.string().min(2, 'Branch name is required'),
  accountType: z.enum(['Savings', 'Current']),
});

// 8. Medical Information Schema
export const medicalInfoSchema = z.object({
  bloodGroup: z.string().min(1, 'Blood group is required'),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  insuranceOpted: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  sumInsured: z.number().optional(),
}).refine((data) => {
  if (data.insuranceOpted) {
    return !!data.insuranceProvider && data.insuranceProvider.length > 0;
  }
  return true;
}, {
  message: 'Insurance provider is required when opted-in',
  path: ['insuranceProvider']
});

// 9. System Access Schema
export const systemAccessSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain alphanumeric characters, dots, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  role: z.enum(['HR', 'Admin', 'Employee', 'Manager']),
  enable2FA: z.boolean().default(false),
});

// 10. Salary Structure Schema
export const salaryStructureSchema = z.object({
  basicSalary: z.number().min(0),
  hra: z.number().min(0),
  lta: z.number().min(0),
  specialAllowance: z.number().min(0),
  employerPf: z.number().min(0),
  employeePf: z.number().min(0),
  professionalTax: z.number().min(0),
  otherDeductions: z.number().min(0),
  grossSalary: z.number().min(5000, 'Gross salary must be at least $5,000 /yr'),
  netSalary: z.number().min(0),
});

// 11. PF / Statutory Schema
export const statutorySchema = z.object({
  uanNumber: z.string().regex(/^\d{12}$/, 'UAN must be exactly 12 digits').optional().or(z.literal('')),
  esiNumber: z.string().optional(),
  pfEnrolled: z.boolean().default(true),
  esiEnrolled: z.boolean().default(false),
  ptEnrolled: z.boolean().default(true),
  statutoryDeductionsEnrolled: z.boolean().default(true),
});

// 12. Assets & Joining Kit Schema
export const assetsSchema = z.object({
  laptopAssigned: z.boolean().default(false),
  laptopSerial: z.string().optional(),
  laptopModel: z.string().optional(),
  joiningKitIssued: z.boolean().default(false),
  kitItems: z.array(z.string()).default([]),
  assetHandoverDate: z.string().optional(),
}).refine((data) => {
  if (data.laptopAssigned) {
    return !!data.laptopSerial && data.laptopSerial.length > 0;
  }
  return true;
}, {
  message: 'Laptop serial number is required',
  path: ['laptopSerial']
});

// 13. Notes & Attachments Schema
export const notesAttachmentsSchema = z.object({
  notes: z.string().optional(),
  attachments: z.array(z.object({
    title: z.string().min(2, 'Attachment name is required'),
    fileUrl: z.string().min(1, 'File is required'),
    fileName: z.string().optional(),
  })).default([]),
});

// Merge all into one Master Schema
export const employeeOnboardingSchema = z.object({
  ...personalInfoSchema.shape,
  ...employmentDetailsSchema.shape,
  ...contactAddressSchema.shape,
  ...familyInfoSchema.shape,
  ...listsSchema.shape,
  ...documentsKycSchema.shape,
  ...bankPayrollSchema.shape,
  ...medicalInfoSchema.shape,
  ...systemAccessSchema.shape,
  ...salaryStructureSchema.shape,
  ...statutorySchema.shape,
  ...assetsSchema.shape,
  ...notesAttachmentsSchema.shape,
});

export type EmployeeOnboardingData = z.infer<typeof employeeOnboardingSchema>;

// Map tab value to its validation sub-schema or array of field keys
export const TAB_VALIDATION_FIELDS: Record<string, string[]> = {
  'Personal Information': ['employeeId', 'firstName', 'middleName', 'lastName', 'fullName', 'dob', 'gender', 'maritalStatus', 'nationality', 'avatarUrl'],
  'Employment Details': ['department', 'designation', 'joiningDate', 'reportingManager', 'officialEmail', 'confirmationDate', 'workMode', 'hybridDetails', 'remoteCountry', 'employeeType', 'isRehire', 'previousEmployeeId'],
  'Contact & Address': ['mobile', 'personalEmail', 'presentAddress', 'sameAsPresent', 'permanentAddress', 'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone'],
  'Family Information': ['fatherName', 'motherName', 'spouseName', 'dependents'],
  'Education': ['education'],
  'Work Experience': ['experience'],
  'Skills & Certifications': ['skills', 'certifications'],
  'Documents & KYC': ['panNumber', 'aadhaarNumber', 'passportNumber', 'panFileUrl', 'aadhaarFileUrl', 'passportFileUrl'],
  'Bank & Payroll': ['bankName', 'accountHolderName', 'accountNumber', 'ifscCode', 'branchName', 'accountType'],
  'Medical Information': ['bloodGroup', 'allergies', 'medicalConditions', 'insuranceOpted', 'insuranceProvider', 'sumInsured'],
  'System Access': ['username', 'password', 'role', 'enable2FA'],
  'Salary Structure': ['basicSalary', 'hra', 'lta', 'specialAllowance', 'employerPf', 'employeePf', 'professionalTax', 'otherDeductions', 'grossSalary', 'netSalary'],
  'PF / ESI / Statutory': ['uanNumber', 'esiNumber', 'pfEnrolled', 'esiEnrolled', 'ptEnrolled', 'statutoryDeductionsEnrolled'],
  'Assets & Joining Kit': ['laptopAssigned', 'laptopSerial', 'laptopModel', 'joiningKitIssued', 'kitItems', 'assetHandoverDate'],
  'Notes & Attachments': ['notes', 'attachments'],
  'Review & Submit': []
};
