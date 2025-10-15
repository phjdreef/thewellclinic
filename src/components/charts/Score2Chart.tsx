"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { useStore } from "@/hooks/useStore";

// Custom tick formatter for X-axis labels

export const Score2ChartComponent = () => {
  const { t } = useTranslation();
  const { score2 } = useStore();
  const { age } = useStore();

  if (score2 === undefined) {
    return null;
  }
  if (age === undefined) {
    return null;
  }

  const formatXAxisTick = (value: number) => {
    return `${value}%`;
  };

  // Determine maximum value and risk thresholds based on age
  const maxValue = age < 50 ? 11 : 19;
  const lowThreshold = age < 50 ? 2.5 : 5;
  const moderateThreshold = age < 50 ? 7.5 : 10;

  // Create tick array based on thresholds
  const ticks = [0, lowThreshold, moderateThreshold, maxValue];

  // Data representing stacked bars with age-appropriate risk segments
  const data = [
    {
      name: t("score2Risc"),
      lowRisc: lowThreshold,
      mediumRisc: moderateThreshold - lowThreshold,
      highRisc: maxValue - moderateThreshold,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">{t("score2ChartTitle")}</h3>
      <ChartContainer config={chartConfig} className="h-[80px] w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            type="number"
            tickFormatter={formatXAxisTick}
            domain={[0, maxValue]}
            ticks={ticks}
            interval={0}
          />
          <YAxis dataKey="name" type="category" />
          <Legend />

          <Bar
            dataKey="lowRisc"
            stackId="a"
            fill="#EBE3DA"
            name={t("lowRisc")}
          />
          <Bar
            dataKey="mediumRisc"
            stackId="a"
            fill="#A03F45"
            name={t("mediumRisc")}
          />
          <Bar
            dataKey="highRisc"
            stackId="a"
            fill="#4C2024"
            name={t("highRisc")}
          />

          <ReferenceLine
            x={score2.tableValue}
            strokeWidth={8}
            stroke="#106da6"
          />
        </BarChart>
      </ChartContainer>

      <p className="font-semibold">
        {t("yourscore2")}: {score2.tableValue} %
      </p>
    </div>
  );
};
