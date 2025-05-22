"use server";

import { daily, stock } from "@/db/schema";
import db from "@/lib/db";
import { asc, eq } from "drizzle-orm";

export async function getStockChartData(id: string) {
  const record = await db.query.stock.findFirst({
    where: eq(stock.id, id),
    with: {
      stock: {
        with: {
          daily_basic: true,
          daily: {
            orderBy: asc(daily.trade_date),
          },
        },
      },
    },
  });

  return record;
}
