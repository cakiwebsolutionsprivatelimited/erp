import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  SERVICES_DEMO_TODAY,
  createProjectNumber,
  createServicesInitialState,
  createTicketNumber,
  createVisitNumber,
} from '@/tenant/services/servicesDemoService';
import type {
  FieldVisit,
  FieldVisitDraft,
  HelpdeskTicket,
  ProjectDraft,
  ServiceProject,
  ServicesStateShape,
  ServiceTask,
  TaskDraft,
  TaskStatus,
  TicketDraft,
  TicketStatus,
  VisitStatus,
} from '@/tenant/services/types';

interface ServicesDataState extends ServicesStateShape {
  createProject: (draft: ProjectDraft) => string;
  createTask: (draft: TaskDraft) => string;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  createTicket: (draft: TicketDraft) => string;
  assignTicket: (id: string, assignedTo: string) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  scheduleVisit: (draft: FieldVisitDraft) => string;
  updateVisitStatus: (id: string, status: VisitStatus) => void;
  completeWorkOrder: (id: string) => void;
  resetServicesData: () => void;
}

const STORAGE_KEY = 'services-demo-state-v1';
const initialState = createServicesInitialState();

const readInitialState = (): ServicesStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
  } catch {
    return initialState;
  }
};

const ServicesDataContext = createContext<ServicesDataState | null>(null);

export const ServicesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ServicesStateShape>(readInitialState);

  const persist = (next: ServicesStateShape) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<ServicesDataState>(() => ({
    ...state,
    createProject: (draft) => {
      const id = createProjectNumber(state.projects.length);
      const project: ServiceProject = { ...draft, id, progress: 0, milestones: [], team: [draft.manager], timeLogged: 0 };
      persist({ ...state, projects: [project, ...state.projects] });
      return id;
    },
    createTask: (draft) => {
      const project = state.projects.find((item) => item.id === draft.projectId);
      const id = `ST-${Date.now()}`;
      const task: ServiceTask = {
        ...draft,
        id,
        projectName: project?.name || 'Unassigned project',
        createdAt: SERVICES_DEMO_TODAY,
        checklist: draft.checklist.filter(Boolean).map((label, index) => ({ id: `${id}-C${index + 1}`, label, done: false })),
      };
      persist({ ...state, tasks: [task, ...state.tasks] });
      return id;
    },
    updateTaskStatus: (id, status) => persist({
      ...state,
      tasks: state.tasks.map((task) => task.id === id ? { ...task, status } : task),
    }),
    createTicket: (draft) => {
      const id = `HT-${Date.now()}`;
      const ticket: HelpdeskTicket = {
        ...draft,
        id,
        number: createTicketNumber(state.tickets.length),
        assignedTo: 'Unassigned',
        status: 'Open',
        createdDate: `${SERVICES_DEMO_TODAY}T10:00:00`,
        slaDueAt: `${SERVICES_DEMO_TODAY}T18:00:00`,
        messages: [],
      };
      persist({ ...state, tickets: [ticket, ...state.tickets] });
      return id;
    },
    assignTicket: (id, assignedTo) => persist({
      ...state,
      tickets: state.tickets.map((ticket) => ticket.id === id ? { ...ticket, assignedTo, status: ticket.status === 'Open' ? 'Assigned' : ticket.status } : ticket),
    }),
    updateTicketStatus: (id, status) => persist({
      ...state,
      tickets: state.tickets.map((ticket) => ticket.id === id ? { ...ticket, status } : ticket),
    }),
    scheduleVisit: (draft) => {
      const id = `FV-${Date.now()}`;
      const visit: FieldVisit = {
        ...draft,
        id,
        requestNumber: createVisitNumber(state.visits.length),
        status: 'Scheduled',
        materialsUsed: '',
        signatureCaptured: false,
        paymentCollected: 0,
      };
      persist({ ...state, visits: [visit, ...state.visits] });
      return id;
    },
    updateVisitStatus: (id, status) => persist({
      ...state,
      visits: state.visits.map((visit) => visit.id === id ? { ...visit, status, signatureCaptured: status === 'Completed' ? true : visit.signatureCaptured } : visit),
    }),
    completeWorkOrder: (id) => persist({
      ...state,
      workOrders: state.workOrders.map((order) => order.id === id ? { ...order, status: 'Completed', completedDate: SERVICES_DEMO_TODAY } : order),
    }),
    resetServicesData: () => {
      const next = createServicesInitialState();
      persist(next);
    },
  }), [state]);

  return <ServicesDataContext.Provider value={value}>{children}</ServicesDataContext.Provider>;
};

export const useServicesData = () => {
  const context = useContext(ServicesDataContext);
  if (!context) throw new Error('useServicesData must be used within ServicesDataProvider');
  return context;
};
