import { ReactElement, ReactNode } from "react";
import "./mydialog.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
export default function MyDialog({
  children,
  trigger,
  triggerStyle = null,
}: {
  children: ReactNode;
  trigger: ReactElement;
  triggerStyle?: string | null;
}) {
  return (
    <Dialog>
      <DialogTrigger className={triggerStyle}>{trigger}</DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
