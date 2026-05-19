export const DEPARTMENTS = [
  'Engineering',
  'Product Design',
  'Sales & Marketing',
  'Human Resources',
  'Information Security',
  'Finance & Accounts',
  'Operations',
  'Legal'
];

export const DESIGNATIONS_BY_DEPT: Record<string, string[]> = {
  'Engineering': [
    'Junior Software Engineer',
    'Software Engineer',
    'Senior Software Engineer',
    'Lead Software Architect',
    'Engineering Manager',
    'DevOps Engineer',
    'QA Analyst'
  ],
  'Product Design': [
    'UI/UX Designer',
    'Senior UX Designer',
    'Product Designer',
    'UX Researcher',
    'Design Lead'
  ],
  'Sales & Marketing': [
    'Sales Executive',
    'Business Development Representative',
    'Marketing Associate',
    'Sales Manager',
    'SEO Specialist',
    'Content Writer'
  ],
  'Human Resources': [
    'HR Associate',
    'HR Generalist',
    'Talent Acquisition Specialist',
    'HR Manager',
    'HR Director'
  ],
  'Information Security': [
    'Security Analyst',
    'Senior Security Specialist',
    'CISO',
    'Network Security Engineer'
  ],
  'Finance & Accounts': [
    'Accountant',
    'Senior Accountant',
    'Finance Analyst',
    'Finance Manager'
  ],
  'Operations': [
    'Operations Executive',
    'Operations Manager',
    'Facilities Coordinator'
  ],
  'Legal': [
    'Legal Associate',
    'Legal Counsel',
    'Compliance Officer'
  ]
};

export const REPORTING_MANAGERS = [
  { id: 'EMP001', name: 'Sarah Jenkins', role: 'Lead Software Architect', department: 'Engineering' },
  { id: 'EMP004', name: 'Emma Stone', role: 'HR Generalist', department: 'Human Resources' },
  { id: 'MGR001', name: 'Alok Sharma', role: 'Director of Engineering', department: 'Engineering' },
  { id: 'MGR002', name: 'John Doe', role: 'VP of Product', department: 'Product Design' },
  { id: 'MGR003', name: 'Jane Smith', role: 'Chief Marketing Officer', department: 'Sales & Marketing' }
];

export const STATES_AND_DISTRICTS: Record<string, { districts: string[]; cities: Record<string, string[]> }> = {
  'California': {
    districts: ['Los Angeles County', 'Bay Area', 'San Diego County'],
    cities: {
      'Los Angeles County': ['Los Angeles', 'Pasadena', 'Long Beach'],
      'Bay Area': ['San Francisco', 'San Jose', 'Oakland'],
      'San Diego County': ['San Diego', 'Chula Vista', 'Oceanside']
    }
  },
  'Delhi': {
    districts: ['New Delhi', 'South Delhi', 'North Delhi'],
    cities: {
      'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Dwarka'],
      'South Delhi': ['Saket', 'Hauz Khas', 'Vasant Kunj'],
      'North Delhi': ['Rohini', 'Model Town', 'Civil Lines']
    }
  },
  'Karnataka': {
    districts: ['Bengaluru Urban', 'Mysuru', 'Dakshina Kannada'],
    cities: {
      'Bengaluru Urban': ['Bengaluru', 'Yelahanka', 'Kengeri'],
      'Mysuru': ['Mysuru', 'Nanjangud', 'Hunsur'],
      'Dakshina Kannada': ['Mangaluru', 'Ullal', 'Puttur']
    }
  },
  'Maharashtra': {
    districts: ['Mumbai City', 'Pune', 'Nagpur'],
    cities: {
      'Mumbai City': ['Mumbai', 'Colaba', 'Bandra'],
      'Pune': ['Pune', 'Pimpri-Chinchwad', 'Baramati'],
      'Nagpur': ['Nagpur', 'Kamptee', 'Umred']
    }
  }
};

export const SKILLS_LIST = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Go', 'Ruby', 'Java',
  'Tailwind CSS', 'Figma', 'UX Research', 'System Design', 'AWS', 'Docker',
  'Kubernetes', 'CI/CD', 'Git', 'SQL', 'MongoDB', 'Redis', 'GraphQL',
  'Excel', 'Negotiation', 'CRM Logistics', 'Conflict Resolution', 'Compliance',
  'Talent Acquisition', 'Encryption Keys', 'Penetration Testing', 'Agile/Scrum'
];

export const KIT_ITEMS_LIST = [
  'MacBook Pro / ThinkPad Laptop',
  'Company T-Shirt',
  'Premium Notebook & Stylus Pen',
  'Thermal Coffee Mug / Water Bottle',
  'RFID Access Card & ID Lanyard',
  'Noise Cancelling Headphones',
  'Ergonomic Mouse & Keyboard',
  'Welcome Desk Plant'
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BANK_NAMES = [
  'Silicon Valley Bank',
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Chase Bank',
  'Bank of America',
  'HSBC',
  'Barclays'
];
