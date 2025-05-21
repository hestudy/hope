import { stock_basic } from "@/db/schema";

export async function stockBasic() {
  const result: (typeof stock_basic.$inferInsert)[] = [];

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
