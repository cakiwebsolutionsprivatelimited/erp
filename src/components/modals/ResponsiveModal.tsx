import * as React from "react"
import { Drawer } from "vaul"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/utils"

interface ResponsiveModalProps {
  children: React.ReactNode
  title?: string
  description?: string
  isOpen: boolean
  onClose: (open: boolean) => void
  className?: string
}

export function ResponsiveModal({
  children,
  title,
  description,
  isOpen,
  onClose,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn("sm:max-w-[425px]", className)}>
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className={cn("bg-background flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none", className)}>
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-md mx-auto">
              {(title || description) && (
                <div className="mb-4 text-center">
                  {title && <Drawer.Title className="font-bold text-xl">{title}</Drawer.Title>}
                  {description && <Drawer.Description className="text-muted-foreground">{description}</Drawer.Description>}
                </div>
              )}
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
