import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal } from '@/store/features/modalSlice';
import { AlertTriangle } from 'lucide-react';

export const DeleteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, type, config, data } = useAppSelector((state) => state.modal);

  if (type !== 'DELETE') return null;

  const onConfirm = () => {
    if (data?.onDelete) data.onDelete();
    dispatch(closeModal());
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={config.title || 'Delete Item'}
      description={config.description || 'This action cannot be undone. Are you sure?'}
      size={config.size || 'md'}
      footer={
        <>
          <Button variant="outline" onClick={() => dispatch(closeModal())}>
            {config.cancelLabel || 'Cancel'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            {config.confirmLabel || 'Delete'}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="font-bold">Warning</p>
          <p className="opacity-90">
            Deleting this {data?.itemType || 'item'} will permanently remove all associated data from our servers.
          </p>
        </div>
      </div>
    </BaseModal>
  );
};
