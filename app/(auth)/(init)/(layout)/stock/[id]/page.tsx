import { stock } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export default async function page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;

  const record = await db.query.stock.findFirst({
    where: eq(stock.id, id),
    with: {
      stock: {
        with: {
          daily_basic: true,
          daily: true,
        },
      },
    },
  });

  return <div>{id}</div>;
}
