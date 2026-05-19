export interface SalaryBreakdown {
  basic: number;
  hra: number;
  lta: number;
  specialAllowance: number;
  employerPf: number;
  employeePf: number;
  professionalTax: number;
  grossSalary: number;
  netSalary: number;
}

/**
 * Calculates a complete salary structure based on the provided Gross Annual Salary.
 * Follows a standard enterprise structure:
 * - Basic Salary: 50% of Gross
 * - HRA: 40% of Basic
 * - LTA: 10% of Basic
 * - Special Allowance: Remainder of Gross
 * - Employer PF: 12% of Basic
 * - Employee PF: 12% of Basic
 * - Professional Tax: Fixed $200 (or equivalent)
 * - Net Salary: Gross - Employee PF - Professional Tax
 */
export const calculateSalaryFromGross = (grossAnnual: number, ptSelected: boolean = true, pfSelected: boolean = true): SalaryBreakdown => {
  const annualGross = Math.max(0, grossAnnual);
  
  // Base components
  const basic = Math.round(annualGross * 0.5);
  const hra = Math.round(basic * 0.4);
  const lta = Math.round(basic * 0.1);
  
  // PF Contributions (12% of Basic, capped at standard thresholds if desired, but let's do straight 12% of basic)
  const employeePf = pfSelected ? Math.round(basic * 0.12) : 0;
  const employerPf = pfSelected ? Math.round(basic * 0.12) : 0;
  
  // PT is $200 per month ($2400 per year)
  const professionalTax = ptSelected ? 2400 : 0;
  
  // Special Allowance is the remaining portion
  const basicComponentsTotal = basic + hra + lta;
  const specialAllowance = Math.max(0, annualGross - basicComponentsTotal);
  
  // Net salary is Gross minus employee statutory deductions
  const netSalary = Math.max(0, annualGross - employeePf - professionalTax);
  
  return {
    basic,
    hra,
    lta,
    specialAllowance,
    employerPf,
    employeePf,
    professionalTax,
    grossSalary: annualGross,
    netSalary
  };
};

/**
 * Calculates the age of a person given their Date of Birth.
 * Prevents future dates.
 */
export const calculateAge = (dobString: string): number => {
  if (!dobString) return 0;
  
  const dob = new Date(dobString);
  const today = new Date();
  
  if (dob > today) return 0;
  
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Generates official email recommendations based on name and company domain.
 */
export const generateSuggestedEmails = (firstName: string, lastName: string): string[] => {
  if (!firstName) return [];
  
  const f = firstName.toLowerCase().replace(/\s+/g, '');
  const l = (lastName || '').toLowerCase().replace(/\s+/g, '');
  const domain = 'enterprise-erp.com';
  
  if (!l) {
    return [`${f}@${domain}`];
  }
  
  return [
    `${f}.${l}@${domain}`,
    `${f[0]}${l}@${domain}`,
    `${f}${l[0]}@${domain}`,
    `${f}_${l}@${domain}`
  ];
};

/**
 * Generates a clean auto-suggested username based on name.
 */
export const generateSuggestedUsername = (firstName: string, lastName: string): string => {
  if (!firstName) return '';
  const f = firstName.toLowerCase().replace(/\s+/g, '');
  const l = (lastName || '').toLowerCase().replace(/\s+/g, '');
  const randomNum = Math.floor(100 + Math.random() * 900);
  
  return l ? `${f}.${l}` : `${f}${randomNum}`;
};
