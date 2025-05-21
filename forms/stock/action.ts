"use server";

import { allStock, stock, stockDaily } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { daily } from "@/tushare/daily_basic";
import dayjs from "dayjs";
import { eq, like, or } from "drizzle-orm";
import { chunk } from "lodash";
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

  const stockInsertResult = await db
    .insert(stock)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();

  const stockInsertRecord = stockInsertResult.at(0);

  if (stockInsertRecord) {
    const stockRecord = await db.query.stock.findFirst({
      where: eq(stock.id, stockInsertRecord.id),
      with: {
        stock: true,
      },
    });

    if (stockRecord?.stock.ts_code) {
      const count = await db.$count(
        stockDaily,
        eq(stockDaily.stockId, stockRecord.stockId)
      );

      if (count === 0) {
        const end = dayjs();
        const start = end.subtract(1, "year");
        const res = await daily({
          ts_code: stockRecord.stock.ts_code,
          start_date: start.format("YYYYMMDD"),
          end_date: end.format("YYYYMMDD"),
        });

        const chunkList = chunk(res, 100);

        for (const chunk of chunkList) {
          await db.insert(stockDaily).values(
            chunk.map((d) => {
              return {
                ...d,
                stockId: stockRecord.stockId,
              };
            })
          );
        }
      }
    }
  }

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
