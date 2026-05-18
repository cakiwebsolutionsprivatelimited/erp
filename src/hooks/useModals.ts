import { useAppDispatch } from '@/store';
import { openModal, closeModal, type ModalType } from '@/store/features/modalSlice';

interface ModalOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const useModals = () => {
  const dispatch = useAppDispatch();

  const confirm = (options: ModalOptions & { onConfirm: () => void; content?: React.ReactNode }) => {
    dispatch(openModal({
      type: 'CONFIRM',
      data: { onConfirm: options.onConfirm, content: options.content },
      config: options
    }));
  };

  const remove = (options: ModalOptions & { onDelete: () => void; itemType?: string }) => {
    dispatch(openModal({
      type: 'DELETE',
      data: { onDelete: options.onDelete, itemType: options.itemType },
      config: options
    }));
  };

  const close = () => dispatch(closeModal());

  return { confirm, remove, close };
};
