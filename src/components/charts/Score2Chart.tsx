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
  if (score2.risk10yr === null) {
    return null;
  }

  const formatXAxisTick = (value: number) => {
    switch (value) {
      case 1:
        if (age < 50) {
          return "<2,5%";
        } else if (age >= 50 && age < 69) {
          return "<5,0%";
        }
      case 2:
        if (age < 50) {
          return ">7,5%";
        } else if (age >= 50 && age < 69) {
          return ">10%";
        }

      default:
        return "";
    }
  };

  // Data from https://www.bhf.org.uk/informationsupport/risk-factors/atherosclerotic-cardiovascular-disease-score2-risk

  const data = [
    {
      name: t("score2Risc"),
      mediumRisc: 1,
      highRisc: 1,
      extremeRisc: 1,
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
            domain={[0, 3]}
            interval={0}
            ticks={[1, 2, 3]}
          />
          <YAxis dataKey="name" type="category" />
          <Legend />

          <Bar
            dataKey="mediumRisc"
            stackId="a"
            fill="#EBE3DA"
            name={t("mediumRisc")}
          />
          <Bar
            dataKey="highRisc"
            stackId="a"
            fill="#A03F45"
            name={t("highRisc")}
          />
          <Bar
            dataKey="extremeRisc"
            stackId="a"
            fill="#4C2024"
            name={t("extremeRisc")}
          />

          <ReferenceLine
            x={-0.5 + score2.risk10yr.step}
            strokeWidth={8}
            stroke="#106da6"
          />
        </BarChart>
      </ChartContainer>

      <p className="font-semibold">
        {t("yourscore2")}: {score2.risk10yr.description}
      </p>
    </div>
  );
};
