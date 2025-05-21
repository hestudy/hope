"use server";

import { daily, daily_basic, stock, stock_basic } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { dailyBasic } from "@/tushare/daily_basic";
import { getDaily } from "@/tushare/get_daily";
import dayjs from "dayjs";
import { and, eq, like, or } from "drizzle-orm";
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

  const count = await db.$count(
    stock,
    and(eq(stock.userId, session.user.id), eq(stock.stockId, data.stockId))
  );

  if (count !== 0) {
    return {
      error: "Stock already exists",
    };
  }

  await db.transaction(async (db) => {
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
        const daily_count = await db.$count(
          daily,
          eq(daily.stockId, stockRecord.stockId)
        );

        if (daily_count === 0) {
          const end = dayjs();
          const start = end.subtract(1, "year");
          const res = await getDaily({
            ts_code: stockRecord.stock.ts_code,
            start_date: start.format("YYYYMMDD"),
            end_date: end.format("YYYYMMDD"),
          });

          const chunkList = chunk(res, 100);

          for (const chunk of chunkList) {
            await db.insert(daily).values(
              chunk.map((d) => {
                return {
                  ...d,
                  stockId: stockRecord.stockId,
                };
              })
            );
          }
        }

        const daily_basic_count = await db.$count(
          daily_basic,
          eq(daily_basic.stockId, stockRecord.stockId)
        );

        if (daily_basic_count === 0) {
          const end = dayjs();
          const start = end.subtract(1, "year");
          const res = await dailyBasic({
            ts_code: stockRecord.stock.ts_code,
            start_date: start.format("YYYYMMDD"),
            end_date: end.format("YYYYMMDD"),
          });

          const chunkList = chunk(res, 100);

          for (const chunk of chunkList) {
            await db.insert(daily_basic).values(
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
  });

  return {
    success: "Stock saved",
  };
}

export async function allStockOptions(keyword?: string) {
  const stocks = await db.query.stock_basic.findMany({
    limit: 20,
    where: keyword
      ? or(
          like(stock_basic.name, `%${keyword}%`),
          like(stock_basic.symbol, `%${keyword}%`)
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
