export type ProjectStatus = 'Planned' | 'Active' | 'At Risk' | 'On Hold' | 'Completed';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked';
export type ServicePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Waiting Customer' | 'Resolved' | 'Closed';
export type VisitStatus = 'Scheduled' | 'On the Way' | 'In Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Paid';

export interface ServiceProject {
  id: string;
  name: string;
  customer: string;
  manager: string;
  startDate: string;
  deadline: string;
  progress: number;
  status: ProjectStatus;
  summary: string;
  budget: number;
  milestones: string[];
  team: string[];
  timeLogged: number;
  notes: string;
}

export type ProjectDraft = Omit<ServiceProject, 'id' | 'progress' | 'milestones' | 'team' | 'timeLogged'>;

export interface TaskChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ServiceTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignedTo: string;
  priority: ServicePriority;
  dueDate: string;
  description: string;
  checklist: TaskChecklistItem[];
  status: TaskStatus;
  createdAt: string;
}

export type TaskDraft = Omit<ServiceTask, 'id' | 'projectName' | 'checklist' | 'createdAt'> & { checklist: string[] };

export interface TicketMessage {
  id: string;
  author: string;
  body: string;
  timestamp: string;
  internal?: boolean;
}

export interface HelpdeskTicket {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  category: string;
  priority: ServicePriority;
  assignedTo: string;
  status: TicketStatus;
  createdDate: string;
  slaDueAt: string;
  description: string;
  messages: TicketMessage[];
  relatedWorkOrderId?: string;
}

export type TicketDraft = Pick<HelpdeskTicket, 'customer' | 'customerEmail' | 'customerPhone' | 'subject' | 'category' | 'priority' | 'description'>;

export interface FieldVisit {
  id: string;
  requestNumber: string;
  serviceRequest: string;
  customer: string;
  location: string;
  technician: string;
  visitAt: string;
  serviceType: string;
  status: VisitStatus;
  materialsUsed: string;
  signatureCaptured: boolean;
  paymentCollected: number;
  notes: string;
}

export type FieldVisitDraft = Omit<FieldVisit, 'id' | 'requestNumber' | 'status' | 'materialsUsed' | 'signatureCaptured' | 'paymentCollected'>;

export interface WorkOrderItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface WorkOrder {
  id: string;
  number: string;
  customer: string;
  technician: string;
  visitId?: string;
  visitSummary: string;
  items: WorkOrderItem[];
  charges: number;
  paymentStatus: PaymentStatus;
  status: 'Open' | 'Completed' | 'Cancelled';
  completedDate?: string;
}

export interface ServicesStateShape {
  projects: ServiceProject[];
  tasks: ServiceTask[];
  tickets: HelpdeskTicket[];
  visits: FieldVisit[];
  workOrders: WorkOrder[];
}
