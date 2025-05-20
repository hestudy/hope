import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComponentProps, PropsWithChildren } from "react";
import StockForm from "./stock-form";

export default function StockFormDialog({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof StockForm>>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogDescription>
            Add a new stock to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <StockForm {...props} />
      </DialogContent>
    </Dialog>
  );
}
