"use client";

import { useCallback } from "react";
import Echarts from "../echarts";
import { getStockChartData } from "./action";

const upColor = "#ec0000";
const upBorderColor = "#8A0000";
const downColor = "#00da3c";
const downBorderColor = "#008F28";

export default function StockChart(props: {
  srockChartData: Awaited<ReturnType<typeof getStockChartData>>;
}) {
  const record = props.srockChartData;

  const calculateMA = useCallback(
    (dayCount: number) => {
      const result = [];
      for (let i = 0, len = record?.stock.daily.length || 0; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += +(record?.stock.daily?.[i - j]?.open || 0);
        }
        result.push(sum / dayCount);
      }
      return result;
    },
    [record?.stock.daily]
  );

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
          data: ["日K", "MA5", "MA10", "MA20", "MA30", "MA144"],
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
            start: 90,
            end: 100,
          },
          {
            show: true,
            type: "slider",
            top: "90%",
            start: 90,
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
                formatter: function (param) {
                  return param.value as string;
                },
              },
              data: [
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
                formatter: function (param: any) {
                  return param.name + "<br>" + (param.data.coord || "");
                },
              },
            },
            markLine: {
              symbol: ["none", "none"],
              data: [
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
                {
                  name: "average line on open",
                  type: "average",
                  valueDim: "close",
                },
              ],
            },
          },
          {
            name: "MA5",
            type: "line",
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA10",
            type: "line",
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA30",
            type: "line",
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA144",
            type: "line",
            data: calculateMA(144),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
        ],
      }}
      className="h-full"
    />
  );
}
