import Echarts from "@/components/echarts";
import { daily, stock } from "@/db/schema";
import db from "@/lib/db";
import { asc, desc, eq } from "drizzle-orm";

export default async function page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;

  const upColor = "#ec0000";
  const upBorderColor = "#8A0000";
  const downColor = "#00da3c";
  const downBorderColor = "#008F28";

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

  return (
    <Echarts
      option={{
        title: {
          text: `${record?.stock.name}[${record?.stock.ts_code}]`,
          left: 0,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["日K", "MA5", "MA10", "MA20", "MA30"],
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          data: record?.stock.daily.map((d) => d.trade_date),
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 50,
            end: 100,
          },
          {
            show: true,
            type: "slider",
            top: "90%",
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            name: "日K",
            type: "candlestick",
            data: record?.stock.daily.map((d) => [
              d.open,
              d.close,
              d.low,
              d.high,
            ]),
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor,
            },
            markPoint: {
              label: {
                formatter: async function (param) {
                  "use server";
                  return param != null ? Math.round(param.value) + "" : "";
                },
              },
              data: [
                {
                  name: "Mark",
                  coord: ["2013/5/31", 2300],
                  value: 2300,
                  itemStyle: {
                    color: "rgb(41,60,85)",
                  },
                },
                {
                  name: "highest value",
                  type: "max",
                  valueDim: "highest",
                },
                {
                  name: "lowest value",
                  type: "min",
                  valueDim: "lowest",
                },
                {
                  name: "average value on close",
                  type: "average",
                  valueDim: "close",
                },
              ],
              tooltip: {
                formatter: async function (param) {
                  "use server";
                  return param.name + "<br>" + (param.data.coord || "");
                },
              },
            },
            markLine: {
              symbol: ["none", "none"],
              data: [
                [
                  {
                    name: "from lowest to highest",
                    type: "min",
                    valueDim: "lowest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                  {
                    type: "max",
                    valueDim: "highest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                ],
                {
                  name: "min line on close",
                  type: "min",
                  valueDim: "close",
                },
                {
                  name: "max line on close",
                  type: "max",
                  valueDim: "close",
                },
              ],
            },
          },
          // {
          //   name: 'MA5',
          //   type: 'line',
          //   data: calculateMA(5),
          //   smooth: true,
          //   lineStyle: {
          //     opacity: 0.5
          //   }
          // },
          // {
          //   name: 'MA10',
          //   type: 'line',
          //   data: calculateMA(10),
          //   smooth: true,
          //   lineStyle: {
          //     opacity: 0.5
          //   }
          // },
          // {
          //   name: 'MA20',
          //   type: 'line',
          //   data: calculateMA(20),
          //   smooth: true,
          //   lineStyle: {
          //     opacity: 0.5
          //   }
          // },
          // {
          //   name: 'MA30',
          //   type: 'line',
          //   data: calculateMA(30),
          //   smooth: true,
          //   lineStyle: {
          //     opacity: 0.5
          //   }
          // }
        ],
      }}
      className="h-full"
    />
  );
}
