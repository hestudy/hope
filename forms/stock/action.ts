"use server";

import { allStock, stock } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { like, or } from "drizzle-orm";
import { headers } from "next/headers";

export async function saveStock(
  data: Omit<typeof stock.$inferInsert, "userId">
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await db.insert(stock).values({
    ...data,
    userId: session.user.id,
  });

  return {
    success: "Stock saved",
  };
}

export async function allStockOptions(keyword?: string) {
  const stocks = await db.query.allStock.findMany({
    limit: 20,
    where: keyword
      ? or(
          like(allStock.name, `%${keyword}%`),
          like(allStock.symbol, `%${keyword}%`)
        )
      : undefined,
  });

  return stocks.map((d) => {
    return {
      label: `${d.name} (${d.symbol})`,
      value: d.id,
    };
  });
}
