import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'CONFIRM' | 'DELETE' | 'FORM' | 'CUSTOM';

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data: unknown;
  config: {
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
}

const initialState: ModalState = {
  type: null,
  isOpen: false,
  data: null,
  config: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data?: unknown; config?: ModalState['config'] }>
    ) => {
      state.type = action.payload.type;
      state.isOpen = true;
      state.data = action.payload.data || null;
      state.config = action.payload.config || {};
    },
    closeModal: (state) => {
      state.type = null;
      state.isOpen = false;
      state.data = null;
      state.config = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
