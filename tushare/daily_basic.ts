import { stockDaily } from "@/db/schema";

export async function daily(params: {
  ts_code: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}) {
  const result: (typeof stockDaily.$inferInsert)[] = [];

  const res = await fetch("http://api.tushare.pro", {
    body: JSON.stringify({
      api_name: "daily_basic",
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
        "close",
        "turnover_rate",
        "turnover_rate_f",
        "volume_ratio",
        "pe",
        "pe_ttm",
        "pb",
        "ps",
        "ps_ttm",
        "dv_ratio",
        "dv_ttm",
        "total_share",
        "float_share",
        "free_share",
        "total_mv",
        "circ_mv",
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
