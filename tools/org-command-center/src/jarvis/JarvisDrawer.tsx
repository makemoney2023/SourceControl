import { useRef, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../components/ui/dialog";

export function JarvisDrawer({
  open,
  title,
  onOpenChange,
  children,
  wide = false,
}: {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        theme="jarvis"
        className={wide ? "j-console-drawer-content--wide" : undefined}
        onOpenAutoFocus={() => {
          restoreFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          if (!restoreFocusRef.current) return;
          event.preventDefault();
          restoreFocusRef.current.focus();
        }}
      >
        <div className="j-console-drawer-header">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <button type="button" className="j-btn">
              Close
            </button>
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
