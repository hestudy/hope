"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComponentProps, PropsWithChildren, useState } from "react";
import StockForm from "./stock-form";

export default function StockFormDialog({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof StockForm>>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogDescription>
            Add a new stock to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <StockForm
          {...props}
          onOk={(...args) => {
            setOpen(false);
            props.onOk?.(...args);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
