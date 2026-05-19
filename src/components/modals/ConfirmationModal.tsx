import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal } from '@/store/features/modalSlice';

export const ConfirmationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, type, config, data } = useAppSelector((state) => state.modal);

  if (type !== 'CONFIRM') return null;

  const confirmData = data as { onConfirm?: () => void; content?: React.ReactNode } | null;

  const onConfirm = () => {
    if (confirmData?.onConfirm) confirmData.onConfirm();
    dispatch(closeModal());
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={config.title || 'Confirm Action'}
      description={config.description || 'Are you sure you want to proceed?'}
      size={config.size || 'md'}
      footer={
        <>
          <Button variant="outline" onClick={() => dispatch(closeModal())}>
            {config.cancelLabel || 'Cancel'}
          </Button>
          <Button 
            variant={config.variant || 'default'} 
            onClick={onConfirm}
          >
            {config.confirmLabel || 'Confirm'}
          </Button>
        </>
      }
    >
      <div className="py-2">
        {/* Additional custom content from data if needed */}
        {confirmData?.content}
      </div>
    </BaseModal>
  );
};
