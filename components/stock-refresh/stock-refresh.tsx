"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { refreshStock } from "./action";

export default function StockRefresh(props: { id: string; onOk?: () => void }) {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await refreshStock(props.id);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Refresh success");
      setOpen(false);
      props.onOk?.();
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Refresh</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <div>
          <p>Refresh the stock data from the lastest trade date to today.</p>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate();
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
