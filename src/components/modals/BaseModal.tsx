import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/utils';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[95vw] sm:h-[95vh]',
};

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(sizeClasses[size], "p-0 overflow-hidden rounded-2xl", className)}>
        {(title || description) && (
          <DialogHeader className="px-6 pt-6 pb-2">
            {title && <DialogTitle className="text-xl font-bold">{title}</DialogTitle>}
            {description && <DialogDescription className="text-muted-foreground">{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        <div className={cn("px-6 pb-6", !title && !description && "pt-6")}>
          {children}
        </div>

        {footer && (
          <DialogFooter className="px-6 py-4 bg-muted/30 border-t flex flex-row justify-end gap-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
