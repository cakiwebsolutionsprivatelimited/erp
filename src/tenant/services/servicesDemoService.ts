import type {
  FieldVisit,
  HelpdeskTicket,
  ServiceProject,
  ServicesStateShape,
  ServiceTask,
  TaskStatus,
  WorkOrder,
} from '@/tenant/services/types';

export const SERVICES_DEMO_TODAY = '2026-06-18';
export const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Done', 'Blocked'];
export const SERVICE_TEAM = ['Anita Das', 'Rakesh Sahoo', 'Priya Mishra', 'Debasis Rout', 'Sonal Patnaik'];
export const TECHNICIANS = ['Debasis Rout', 'Sonal Patnaik', 'Arjun Behera', 'Niharika Das'];

const projects: ServiceProject[] = [
  {
    id: 'SP-1', name: 'Apollo Retail ERP Rollout', customer: 'Apollo Retail', manager: 'Anita Das',
    startDate: '2026-04-10', deadline: '2026-07-15', progress: 68, status: 'Active',
    summary: 'Deploy inventory, billing, and purchase workflows across five retail outlets.', budget: 640000,
    milestones: ['Discovery complete', 'Master data imported', 'Pilot store live'],
    team: ['Anita Das', 'Rakesh Sahoo', 'Debasis Rout'], timeLogged: 326, notes: 'Pilot feedback is being incorporated before the multi-store rollout.',
  },
  {
    id: 'SP-2', name: 'Care Clinic Support Desk', customer: 'Care Clinic', manager: 'Priya Mishra',
    startDate: '2026-05-01', deadline: '2026-06-30', progress: 82, status: 'At Risk',
    summary: 'Configure support queues, SLAs, and appointment issue escalation.', budget: 185000,
    milestones: ['Ticket categories approved', 'SLA rules configured'], team: ['Priya Mishra', 'Sonal Patnaik'],
    timeLogged: 142, notes: 'Awaiting customer approval for the final escalation matrix.',
  },
  {
    id: 'SP-3', name: 'Fitness Hub Member Portal', customer: 'Fitness Hub', manager: 'Rakesh Sahoo',
    startDate: '2026-05-20', deadline: '2026-08-05', progress: 44, status: 'Active',
    summary: 'Deliver self-service membership renewals and attendance reporting.', budget: 410000,
    milestones: ['UX sign-off', 'Payment sandbox connected'], team: ['Rakesh Sahoo', 'Niharika Das'],
    timeLogged: 168, notes: 'Weekly demos run every Friday.',
  },
  {
    id: 'SP-4', name: 'Shree Distributor Automation', customer: 'Shree Traders', manager: 'Anita Das',
    startDate: '2026-03-01', deadline: '2026-06-12', progress: 100, status: 'Completed',
    summary: 'Automate dealer orders, dispatch planning, and stock reconciliation.', budget: 520000,
    milestones: ['Go-live complete', 'Hypercare closed'], team: ['Anita Das', 'Debasis Rout'], timeLogged: 404,
    notes: 'Moved to annual support contract.',
  },
  {
    id: 'SP-5', name: 'Odisha Foods Field Operations', customer: 'Odisha Foods Pvt. Ltd.', manager: 'Priya Mishra',
    startDate: '2026-06-10', deadline: '2026-09-20', progress: 12, status: 'Planned',
    summary: 'Digitise technician visits, work orders, and payment collection.', budget: 735000,
    milestones: ['Process mapping started'], team: ['Priya Mishra', 'Arjun Behera'], timeLogged: 34,
    notes: 'Kick-off completed with operations leadership.',
  },
  {
    id: 'SP-6', name: 'Mayurbhanj Clinic Data Migration', customer: 'Mayurbhanj Clinic', manager: 'Rakesh Sahoo',
    startDate: '2026-04-15', deadline: '2026-07-02', progress: 53, status: 'On Hold',
    summary: 'Clean and migrate legacy patient billing and service records.', budget: 240000,
    milestones: ['Source audit complete'], team: ['Rakesh Sahoo', 'Sonal Patnaik'], timeLogged: 96,
    notes: 'Paused pending corrected legacy exports.',
  },
];

const tasks: ServiceTask[] = [
  { id: 'ST-1', title: 'Validate outlet opening stock', projectId: 'SP-1', projectName: 'Apollo Retail ERP Rollout', assignedTo: 'Debasis Rout', priority: 'Urgent', dueDate: '2026-06-17', description: 'Reconcile imported stock against signed sheets.', checklist: [{ id: 'C-1', label: 'Import file', done: true }, { id: 'C-2', label: 'Variance review', done: false }], status: 'In Progress', createdAt: '2026-06-11' },
  { id: 'ST-2', title: 'Configure ticket SLA matrix', projectId: 'SP-2', projectName: 'Care Clinic Support Desk', assignedTo: 'Priya Mishra', priority: 'High', dueDate: '2026-06-18', description: 'Apply response targets by issue category.', checklist: [], status: 'Review', createdAt: '2026-06-08' },
  { id: 'ST-3', title: 'Build renewal checkout', projectId: 'SP-3', projectName: 'Fitness Hub Member Portal', assignedTo: 'Niharika Das', priority: 'High', dueDate: '2026-06-24', description: 'Complete the member renewal payment flow.', checklist: [{ id: 'C-3', label: 'Success state', done: true }, { id: 'C-4', label: 'Retry state', done: false }], status: 'In Progress', createdAt: '2026-06-10' },
  { id: 'ST-4', title: 'Archive hypercare checklist', projectId: 'SP-4', projectName: 'Shree Distributor Automation', assignedTo: 'Anita Das', priority: 'Low', dueDate: '2026-06-12', description: 'Close the completed project documentation.', checklist: [], status: 'Done', createdAt: '2026-06-05' },
  { id: 'ST-5', title: 'Map field visit journey', projectId: 'SP-5', projectName: 'Odisha Foods Field Operations', assignedTo: 'Arjun Behera', priority: 'Medium', dueDate: '2026-06-21', description: 'Document technician steps from dispatch to sign-off.', checklist: [], status: 'To Do', createdAt: '2026-06-16' },
  { id: 'ST-6', title: 'Request corrected billing export', projectId: 'SP-6', projectName: 'Mayurbhanj Clinic Data Migration', assignedTo: 'Rakesh Sahoo', priority: 'High', dueDate: '2026-06-16', description: 'Follow up on malformed legacy records.', checklist: [], status: 'Blocked', createdAt: '2026-06-12' },
  { id: 'ST-7', title: 'Train pilot store cashiers', projectId: 'SP-1', projectName: 'Apollo Retail ERP Rollout', assignedTo: 'Rakesh Sahoo', priority: 'Medium', dueDate: '2026-06-20', description: 'Run billing and returns training.', checklist: [], status: 'To Do', createdAt: '2026-06-14' },
  { id: 'ST-8', title: 'Test escalation notifications', projectId: 'SP-2', projectName: 'Care Clinic Support Desk', assignedTo: 'Sonal Patnaik', priority: 'High', dueDate: '2026-06-19', description: 'Verify breached SLA alerts.', checklist: [], status: 'Review', createdAt: '2026-06-13' },
  { id: 'ST-9', title: 'Publish attendance dashboard', projectId: 'SP-3', projectName: 'Fitness Hub Member Portal', assignedTo: 'Rakesh Sahoo', priority: 'Medium', dueDate: '2026-06-27', description: 'Release management attendance view.', checklist: [], status: 'To Do', createdAt: '2026-06-15' },
  { id: 'ST-10', title: 'Confirm spare inventory list', projectId: 'SP-5', projectName: 'Odisha Foods Field Operations', assignedTo: 'Debasis Rout', priority: 'Medium', dueDate: '2026-06-25', description: 'Agree the materials technicians can consume.', checklist: [], status: 'To Do', createdAt: '2026-06-17' },
  { id: 'ST-11', title: 'Resolve duplicate customer records', projectId: 'SP-1', projectName: 'Apollo Retail ERP Rollout', assignedTo: 'Anita Das', priority: 'High', dueDate: '2026-06-15', description: 'Merge duplicates before the next import.', checklist: [], status: 'Done', createdAt: '2026-06-07' },
  { id: 'ST-12', title: 'Review support knowledge base', projectId: 'SP-2', projectName: 'Care Clinic Support Desk', assignedTo: 'Priya Mishra', priority: 'Low', dueDate: '2026-06-22', description: 'Approve the first response templates.', checklist: [], status: 'In Progress', createdAt: '2026-06-16' },
];

const tickets: HelpdeskTicket[] = [
  { id: 'HT-1', number: 'HD-2026-1042', customer: 'Apollo Retail', customerEmail: 'ops@apollo-retail.example', customerPhone: '+91 98765 40101', subject: 'Invoice printer disconnects after idle', category: 'Hardware', priority: 'Urgent', assignedTo: 'Debasis Rout', status: 'In Progress', createdDate: '2026-06-18T08:10:00', slaDueAt: '2026-06-18T12:10:00', description: 'Pilot counter printer disconnects after fifteen minutes of inactivity.', messages: [{ id: 'M-1', author: 'Apollo Retail', body: 'The issue affects the main checkout counter.', timestamp: '2026-06-18T08:10:00' }, { id: 'M-2', author: 'Debasis Rout', body: 'Remote diagnostics completed. Scheduling an onsite check.', timestamp: '2026-06-18T09:02:00' }] },
  { id: 'HT-2', number: 'HD-2026-1041', customer: 'Care Clinic', customerEmail: 'admin@careclinic.example', customerPhone: '+91 98765 40102', subject: 'Appointment reminder not delivered', category: 'Notification', priority: 'High', assignedTo: 'Sonal Patnaik', status: 'Waiting Customer', createdDate: '2026-06-17T15:30:00', slaDueAt: '2026-06-18T11:30:00', description: 'SMS reminders failed for yesterday appointments.', messages: [{ id: 'M-3', author: 'Sonal Patnaik', body: 'Requested two sample patient IDs for tracing.', timestamp: '2026-06-17T16:00:00' }] },
  { id: 'HT-3', number: 'HD-2026-1039', customer: 'Fitness Hub', customerEmail: 'manager@fitnesshub.example', customerPhone: '+91 98765 40103', subject: 'Renewal payment shown twice', category: 'Billing', priority: 'Urgent', assignedTo: 'Priya Mishra', status: 'Assigned', createdDate: '2026-06-17T10:20:00', slaDueAt: '2026-06-17T14:20:00', description: 'A member reports a duplicate renewal charge.', messages: [] },
  { id: 'HT-4', number: 'HD-2026-1036', customer: 'Shree Traders', customerEmail: 'sales@shreetraders.example', customerPhone: '+91 98765 40104', subject: 'Dealer statement export formatting', category: 'Report', priority: 'Medium', assignedTo: 'Rakesh Sahoo', status: 'Resolved', createdDate: '2026-06-15T12:00:00', slaDueAt: '2026-06-16T12:00:00', description: 'Dealer statement PDF columns were wrapping.', messages: [], relatedWorkOrderId: 'WO-2' },
  { id: 'HT-5', number: 'HD-2026-1033', customer: 'Odisha Foods Pvt. Ltd.', customerEmail: 'service@odishafoods.example', customerPhone: '+91 98765 40105', subject: 'Cold room sensor offline', category: 'Field Service', priority: 'High', assignedTo: 'Arjun Behera', status: 'Open', createdDate: '2026-06-14T09:10:00', slaDueAt: '2026-06-14T17:10:00', description: 'Warehouse cold room temperature sensor is not reporting.', messages: [] },
  { id: 'HT-6', number: 'HD-2026-1029', customer: 'Mayurbhanj Clinic', customerEmail: 'it@mayurbhanjclinic.example', customerPhone: '+91 98765 40106', subject: 'Legacy import rejects date values', category: 'Data Migration', priority: 'High', assignedTo: 'Sonal Patnaik', status: 'In Progress', createdDate: '2026-06-13T11:40:00', slaDueAt: '2026-06-13T19:40:00', description: 'Several records contain dates in inconsistent formats.', messages: [] },
  { id: 'HT-7', number: 'HD-2026-1022', customer: 'Apollo Retail', customerEmail: 'ops@apollo-retail.example', customerPhone: '+91 98765 40101', subject: 'Add new tax category', category: 'Configuration', priority: 'Low', assignedTo: 'Anita Das', status: 'Closed', createdDate: '2026-06-10T10:00:00', slaDueAt: '2026-06-11T10:00:00', description: 'Configure a new packaged goods tax category.', messages: [] },
  { id: 'HT-8', number: 'HD-2026-1018', customer: 'Fitness Hub', customerEmail: 'manager@fitnesshub.example', customerPhone: '+91 98765 40103', subject: 'Member access QR not refreshing', category: 'Portal', priority: 'Medium', assignedTo: 'Niharika Das', status: 'Resolved', createdDate: '2026-06-08T14:20:00', slaDueAt: '2026-06-09T14:20:00', description: 'Member QR remains stale after plan renewal.', messages: [] },
];

const visits: FieldVisit[] = [
  { id: 'FV-1', requestNumber: 'FS-2026-071', serviceRequest: 'Inspect checkout printer', customer: 'Apollo Retail', location: 'Patia Pilot Store, Bhubaneswar', technician: 'Debasis Rout', visitAt: '2026-06-18T14:00', serviceType: 'Hardware Repair', status: 'Scheduled', materialsUsed: '', signatureCaptured: false, paymentCollected: 0, notes: 'Carry spare USB cable and printer adapter.' },
  { id: 'FV-2', requestNumber: 'FS-2026-070', serviceRequest: 'Replace cold room sensor', customer: 'Odisha Foods Pvt. Ltd.', location: 'Mancheswar Warehouse, Bhubaneswar', technician: 'Arjun Behera', visitAt: '2026-06-18T10:30', serviceType: 'Installation', status: 'In Progress', materialsUsed: 'Temperature sensor x1', signatureCaptured: false, paymentCollected: 0, notes: 'Coordinate with warehouse supervisor.' },
  { id: 'FV-3', requestNumber: 'FS-2026-069', serviceRequest: 'Network audit', customer: 'Care Clinic', location: 'Jaydev Vihar, Bhubaneswar', technician: 'Sonal Patnaik', visitAt: '2026-06-18T09:00', serviceType: 'Preventive Maintenance', status: 'Completed', materialsUsed: 'CAT6 connector x4', signatureCaptured: true, paymentCollected: 3500, notes: 'Re-terminated two access point cables.' },
  { id: 'FV-4', requestNumber: 'FS-2026-068', serviceRequest: 'Scanner calibration', customer: 'Shree Traders', location: 'Link Road, Cuttack', technician: 'Debasis Rout', visitAt: '2026-06-17T11:00', serviceType: 'Maintenance', status: 'Completed', materialsUsed: 'Cleaning kit', signatureCaptured: true, paymentCollected: 2200, notes: 'Calibration and test scans completed.' },
  { id: 'FV-5', requestNumber: 'FS-2026-067', serviceRequest: 'Access terminal setup', customer: 'Fitness Hub', location: 'Saheed Nagar, Bhubaneswar', technician: 'Niharika Das', visitAt: '2026-06-19T15:30', serviceType: 'Installation', status: 'Scheduled', materialsUsed: '', signatureCaptured: false, paymentCollected: 0, notes: 'New reception access terminal.' },
  { id: 'FV-6', requestNumber: 'FS-2026-066', serviceRequest: 'Router replacement', customer: 'Mayurbhanj Clinic', location: 'Baripada, Odisha', technician: 'Arjun Behera', visitAt: '2026-06-16T13:00', serviceType: 'Hardware Repair', status: 'Cancelled', materialsUsed: '', signatureCaptured: false, paymentCollected: 0, notes: 'Customer requested rescheduling.' },
];

const workOrders: WorkOrder[] = [
  { id: 'WO-1', number: 'WO-2026-212', customer: 'Care Clinic', technician: 'Sonal Patnaik', visitId: 'FV-3', visitSummary: 'Audited network and restored reliable access point connectivity.', items: [{ id: 'WI-1', description: 'Network service charge', quantity: 1, rate: 2800 }, { id: 'WI-2', description: 'CAT6 connector', quantity: 4, rate: 175 }], charges: 3500, paymentStatus: 'Paid', status: 'Completed', completedDate: '2026-06-18' },
  { id: 'WO-2', number: 'WO-2026-211', customer: 'Shree Traders', technician: 'Debasis Rout', visitId: 'FV-4', visitSummary: 'Calibrated scanner and verified dealer dispatch labels.', items: [{ id: 'WI-3', description: 'Calibration service', quantity: 1, rate: 2200 }], charges: 2200, paymentStatus: 'Paid', status: 'Completed', completedDate: '2026-06-17' },
  { id: 'WO-3', number: 'WO-2026-210', customer: 'Odisha Foods Pvt. Ltd.', technician: 'Arjun Behera', visitId: 'FV-2', visitSummary: 'Cold room sensor replacement in progress.', items: [{ id: 'WI-4', description: 'Temperature sensor', quantity: 1, rate: 6800 }, { id: 'WI-5', description: 'Installation', quantity: 1, rate: 1600 }], charges: 8400, paymentStatus: 'Pending', status: 'Open' },
  { id: 'WO-4', number: 'WO-2026-209', customer: 'Apollo Retail', technician: 'Debasis Rout', visitId: 'FV-1', visitSummary: 'Printer inspection scheduled.', items: [{ id: 'WI-6', description: 'Onsite diagnosis', quantity: 1, rate: 1800 }], charges: 1800, paymentStatus: 'Pending', status: 'Open' },
  { id: 'WO-5', number: 'WO-2026-205', customer: 'Fitness Hub', technician: 'Niharika Das', visitSummary: 'Reconfigured entry scanner firmware.', items: [{ id: 'WI-7', description: 'Firmware service', quantity: 1, rate: 3200 }], charges: 3200, paymentStatus: 'Partially Paid', status: 'Completed', completedDate: '2026-06-12' },
  { id: 'WO-6', number: 'WO-2026-201', customer: 'Mayurbhanj Clinic', technician: 'Arjun Behera', visitId: 'FV-6', visitSummary: 'Router replacement cancelled before dispatch.', items: [], charges: 0, paymentStatus: 'Pending', status: 'Cancelled' },
];

export const createServicesInitialState = (): ServicesStateShape => ({ projects, tasks, tickets, visits, workOrders });

export const createProjectNumber = (count: number) => `SP-${String(count + 1).padStart(3, '0')}`;
export const createTicketNumber = (count: number) => `HD-2026-${String(1043 + count).padStart(4, '0')}`;
export const createVisitNumber = (count: number) => `FS-2026-${String(72 + count).padStart(3, '0')}`;

export const isTaskOverdue = (task: ServiceTask) => task.status !== 'Done' && task.dueDate < SERVICES_DEMO_TODAY;
export const isSlaBreached = (ticket: HelpdeskTicket) => !['Resolved', 'Closed'].includes(ticket.status) && ticket.slaDueAt < `${SERVICES_DEMO_TODAY}T23:59:59`;

export const getServicesMetrics = (state: ServicesStateShape) => ({
  activeProjects: state.projects.filter((project) => ['Active', 'At Risk'].includes(project.status)).length,
  openTasks: state.tasks.filter((task) => task.status !== 'Done').length,
  overdueTasks: state.tasks.filter(isTaskOverdue).length,
  openTickets: state.tickets.filter((ticket) => !['Resolved', 'Closed'].includes(ticket.status)).length,
  visitsToday: state.visits.filter((visit) => visit.visitAt.startsWith(SERVICES_DEMO_TODAY) && visit.status !== 'Cancelled').length,
  completedWorkOrders: state.workOrders.filter((order) => order.status === 'Completed').length,
  slaBreached: state.tickets.filter(isSlaBreached).length,
});

export const getTechnicianWorkload = (visitsList: FieldVisit[]) => TECHNICIANS.map((technician) => ({
  technician,
  count: visitsList.filter((visit) => visit.technician === technician && visit.status !== 'Cancelled').length,
}));

export const getProjectProgress = (projectsList: ServiceProject[]) => [...projectsList].sort((a, b) => b.progress - a.progress);
export const getWorkOrderRevenue = (orders: WorkOrder[]) => orders.filter((order) => order.status === 'Completed').reduce((sum, order) => sum + order.charges, 0);
