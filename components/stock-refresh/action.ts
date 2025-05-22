"use server";

import { daily, stock } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { getDaily } from "@/tushare/get_daily";
import dayjs from "dayjs";
import { and, desc, eq } from "drizzle-orm";
import { isEmpty } from "lodash";
import { headers } from "next/headers";

export async function refreshStock(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const record = await db.query.stock.findFirst({
    where: and(eq(stock.id, id), eq(stock.userId, session.user.id)),
    with: {
      stock: {
        with: {
          daily: {
            orderBy: desc(daily.trade_date),
            limit: 1,
          },
        },
      },
    },
  });

  let lastTradeDate = record?.stock.daily[0]?.trade_date;

  if (!lastTradeDate) {
    lastTradeDate = dayjs().subtract(1, "year").format("YYYYMMDD");
  }

  const dailyData = await getDaily({
    ts_code: record?.stock.ts_code!,
    start_date: lastTradeDate,
    end_date: dayjs().format("YYYYMMDD"),
  });

  const newDailyData = dailyData.filter((item) =>
    dayjs(item.trade_date).isAfter(dayjs(lastTradeDate))
  );

  if (!isEmpty(newDailyData)) {
    await db.insert(daily).values(
      newDailyData.map((item) => ({
        ...item,
        stockId: record?.stock.id!,
      }))
    );
  }

  return {
    success: true,
  };
}
