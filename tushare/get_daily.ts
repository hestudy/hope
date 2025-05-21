import { daily } from "@/db/schema";

export async function getDaily(params: {
  ts_code: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}) {
  const result: (typeof daily.$inferInsert)[] = [];

  const res = await fetch("http://api.tushare.pro", {
    body: JSON.stringify({
      api_name: "daily",
      token: process.env.TUSHARE_TOKEN,
      params: {
        ts_code: params.ts_code,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
        offset: "",
        limit: "",
      },
      fields: [
        "ts_code",
        "trade_date",
        "open",
        "high",
        "low",
        "close",
        "pre_close",
        "change",
        "pct_chg",
        "vol",
        "amount",
      ],
    }),
    method: "POST",
  }).then((res) => res.json());

  if (res.code === 0) {
    res.data.items.forEach((item: any[]) => {
      const data: any = {};
      item.forEach((d, index) => {
        data[res.data.fields[index]] = d;
      });
      result.push(data);
    });
  }

  return result;
}
