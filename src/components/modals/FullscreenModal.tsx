import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="p-0 sm:max-w-none sm:h-screen sm:rounded-none border-none"
    >
      <div className="flex flex-col h-full bg-background">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-4">
            {actions}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
