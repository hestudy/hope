import { Button } from "@/components/ui/button";
import { stock } from "@/db/schema";
import StockFormDialog from "@/forms/stock/stock-form-dialog";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const count = await db.$count(
    stock,
    eq(stock.userId, session?.user.id || "")
  );

  if (count === 0) {
    return (
      <StockFormDialog
        onOk={async () => {
          "use server";
          revalidatePath("/");
        }}
      >
        <Button>Add Stock</Button>
      </StockFormDialog>
    );
  }

  return <div>demo</div>;
}
