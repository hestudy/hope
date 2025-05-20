import { allStock, initRecord } from "@/db/schema";
import db from "@/lib/db";
import { stockBasic } from "@/tushare/stock_basic";
import { eq } from "drizzle-orm";
import { chunk } from "lodash";
import { PropsWithChildren } from "react";

export default async function layout(props: PropsWithChildren) {
  const record = await db
    .select()
    .from(initRecord)
    .where(eq(initRecord.name, "allStocks"));
  const result = record[0];

  if (!result) {
    const res = await stockBasic();
    const chunkList = chunk(res, 100);
    for (const item of chunkList) {
      await db.insert(allStock).values(item);
    }
    await db.insert(initRecord).values({
      name: "allStocks",
    });
  }

  return <>{props.children}</>;
}
