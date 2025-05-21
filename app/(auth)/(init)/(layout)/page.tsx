import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const stocks = await db.query.stock.findMany({
    where: eq(stock.userId, session?.user.id!),
    with: {
      stock: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <StockFormDialog
          onOk={async () => {
            "use server";
            revalidatePath("/");
          }}
        >
          <Button>Add Stock</Button>
        </StockFormDialog>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stocks.map((stock) => {
          return (
            <Card key={stock.id}>
              <CardHeader>
                <CardTitle>
                  {stock.stock.name}[{stock.stock.symbol}]
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-2">
                  <Badge>{stock.stock.industry}</Badge>
                  <Badge>{stock.stock.area}</Badge>
                  {stock.stock.act_name && (
                    <Badge>{stock.stock.act_name}</Badge>
                  )}
                  {stock.stock.act_ent_type && (
                    <Badge>{stock.stock.act_ent_type}</Badge>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
