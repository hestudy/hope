"use client";

import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDebouncedState } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { allStockOptions, saveStock } from "./action";

export default function StockForm(props: { onOk?: () => void }) {
  const form = useForm<Parameters<typeof saveStock>[0]>({
    defaultValues: {},
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const res = await saveStock(values);
          if (res.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Stock saved");
          props.onOk?.();
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="stockId"
          rules={{
            required: "Stock is required",
          }}
          render={({ field }) => {
            const [search, setSearch] = useDebouncedState("", {
              wait: 300,
            });

            const { data: options, isLoading } = useQuery({
              queryKey: ["stock", search],
              queryFn: async ({ queryKey }) => {
                return await allStockOptions(queryKey[1] as string);
              },
            });

            return (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    shouldFilter={false}
                    onSearch={setSearch}
                    options={options}
                    loading={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
