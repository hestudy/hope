import { allStock, initRecord } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { chunk } from "lodash";
import React, { PropsWithChildren } from "react";

export default async function layout(props: PropsWithChildren) {
  const record = await db
    .select()
    .from(initRecord)
    .where(eq(initRecord.name, "allStocks"));
  const result = record[0];

  if (!result) {
    const res = await fetch("http://api.tushare.pro", {
      body: JSON.stringify({
        api_name: "stock_basic",
        token: process.env.TUSHARE_TOKEN,
        params: {
          ts_code: "",
          name: "",
          exchange: "",
          market: "",
          is_hs: "",
          list_status: "",
          limit: "",
          offset: "",
        },
        fields: [
          "ts_code",
          "symbol",
          "name",
          "area",
          "industry",
          "cnspell",
          "market",
          "list_date",
          "act_name",
          "act_ent_type",
        ],
      }),
      method: "POST",
    }).then((res) => res.json());
    if (res.code === 0) {
      const result: (typeof allStock.$inferInsert)[] = [];
      res.data.items.forEach((item: any[]) => {
        const data: any = {};
        item.forEach((d, index) => {
          data[res.data.fields[index]] = d;
        });
        result.push(data);
      });
      const chunkList = chunk(result, 100);
      for (const item of chunkList) {
        await db.insert(allStock).values(item);
      }
      await db.insert(initRecord).values({
        name: "allStocks",
      });
    }
  }

  return <>{props.children}</>;
}
