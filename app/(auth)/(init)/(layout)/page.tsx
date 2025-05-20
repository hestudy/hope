import { Button } from "@/components/ui/button";
import StockFormDialog from "@/forms/stock/stock-form-dialog";
import { revalidatePath } from "next/cache";

export default async function Home() {
  return (
    <div>
      <div>
        <StockFormDialog
          onOk={async () => {
            "use server";
            revalidatePath("/");
          }}
        >
          <Button>Add Stock</Button>
        </StockFormDialog>
      </div>
    </div>
  );
}
