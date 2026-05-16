import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { DeleteModal } from './DeleteModal';

export const ModalProvider: React.FC = () => {
  return (
    <>
      <ConfirmationModal />
      <DeleteModal />
      {/* Add other modal types here as they are created */}
    </>
  );
};
