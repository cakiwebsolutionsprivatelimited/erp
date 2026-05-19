import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TimelineEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  required: boolean;
}

interface OnboardingState {
  activeTab: string;
  tabCompletions: Record<string, boolean>;
  activityTimeline: TimelineEvent[];
  checklist: ChecklistItem[];
  clonedData: any | null;
  lastSaved: string | null;
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'personal', label: 'Verify personal identity (DOB, Name)', done: false, required: true },
  { id: 'email', label: 'Generate official corporate email', done: false, required: true },
  { id: 'kyc', label: 'Validate PAN & Aadhaar documents', done: false, required: true },
  { id: 'bank', label: 'Verify IFSC & bank account details', done: false, required: true },
  { id: 'salary', label: 'Calculate & approve salary breakup', done: false, required: true },
  { id: 'access', label: 'Configure role-based system access', done: false, required: true },
];

const initialState: OnboardingState = {
  activeTab: 'Personal Information',
  tabCompletions: {},
  activityTimeline: [
    {
      id: 'init',
      message: 'Onboarding wizard initialized. Draft created.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info'
    }
  ],
  checklist: DEFAULT_CHECKLIST,
  clonedData: null,
  lastSaved: null,
  hasUnsavedChanges: false,
  isAutoSaving: false,
};

const employeeOnboardingSlice = createSlice({
  name: 'employeeOnboarding',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    markTabComplete: (state, action: PayloadAction<{ tabName: string; complete: boolean }>) => {
      state.tabCompletions[action.payload.tabName] = action.payload.complete;
    },
    addTimelineEvent: (
      state,
      action: PayloadAction<{ message: string; type?: TimelineEvent['type'] }>
    ) => {
      state.activityTimeline.unshift({
        id: Math.random().toString(36).substr(2, 9),
        message: action.payload.message,
        timestamp: new Date().toLocaleTimeString(),
        type: action.payload.type || 'info',
      });
    },
    updateChecklist: (state, action: PayloadAction<{ id: string; done: boolean }>) => {
      const item = state.checklist.find(i => i.id === action.payload.id);
      if (item) {
        item.done = action.payload.done;
      }
    },
    setLastSaved: (state, action: PayloadAction<string | null>) => {
      state.lastSaved = action.payload;
      state.hasUnsavedChanges = false;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
    setIsAutoSaving: (state, action: PayloadAction<boolean>) => {
      state.isAutoSaving = action.payload;
    },
    setClonedData: (state, action: PayloadAction<any | null>) => {
      state.clonedData = action.payload;
      state.activityTimeline.unshift({
        id: Math.random().toString(36).substr(2, 9),
        message: 'Employee template cloned into current draft.',
        timestamp: new Date().toLocaleTimeString(),
        type: 'success'
      });
    },
    resetOnboardingState: (state) => {
      state.activeTab = 'Personal Information';
      state.tabCompletions = {};
      state.activityTimeline = [
        {
          id: 'init',
          message: 'Onboarding wizard reset.',
          timestamp: new Date().toLocaleTimeString(),
          type: 'info'
        }
      ];
      state.checklist = DEFAULT_CHECKLIST;
      state.clonedData = null;
      state.lastSaved = null;
      state.hasUnsavedChanges = false;
      state.isAutoSaving = false;
    }
  },
});

export const {
  setActiveTab,
  markTabComplete,
  addTimelineEvent,
  updateChecklist,
  setLastSaved,
  setHasUnsavedChanges,
  setIsAutoSaving,
  setClonedData,
  resetOnboardingState,
} = employeeOnboardingSlice.actions;

export default employeeOnboardingSlice.reducer;
