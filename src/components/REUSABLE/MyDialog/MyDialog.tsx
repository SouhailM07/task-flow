import { ReactElement, ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
export default function MyDialog({
  children,
  trigger,
  triggerStyle = undefined,
}: {
  children: ReactNode;
  trigger: ReactElement;
  triggerStyle?: string | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger className={triggerStyle}>{trigger}</DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
