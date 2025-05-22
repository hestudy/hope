"use client";

import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";

export default function Echarts(props: {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(props.option);
      window.addEventListener("resize", () => {
        chart.resize();
      });
      return () => {
        window.removeEventListener("resize", () => {
          chart.resize();
        });
        chart.dispose();
      };
    }
  }, [props.option]);

  return <div ref={chartRef} style={props.style} className={props.className} />;
}
