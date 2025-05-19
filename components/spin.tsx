import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import React, { ComponentProps } from "react";

export default function Spin(props: ComponentProps<typeof LoaderCircleIcon>) {
  return (
    <LoaderCircleIcon
      {...props}
      className={cn("-ms-1 animate-spin", props.className)}
      size={props.size ?? 16}
      aria-hidden={props["aria-hidden"] ?? "true"}
    />
  );
}
