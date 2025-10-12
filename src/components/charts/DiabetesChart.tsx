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

export const DiabetesChartComponent = ({ diabetes }: { diabetes: number }) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("diabetesRisc"),
      lowRisc: 3.5,
      mediumRisc: 2.9,
      highRisc: 5.1,
      extremeRisc: 7.8,
      highextremeRisc: 26.8,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[80px] w-full">
      <BarChart layout="vertical" data={data} margin={{ right: 10 }}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          tickFormatter={(tick) => `${tick}%`}
          domain={[0, 15]}
          interval={0}
          ticks={[3.5, 6.4, 11.5, 19.3, 46.1]}
        />
        <YAxis dataKey="name" type="category" />
        <Legend />

        <Bar dataKey="lowRisc" stackId="a" fill="#849190" name={t("lowRisc")} />
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

        <Bar
          dataKey="highextremeRisc"
          stackId="a"
          fill="#281415"
          name={t("highextremeRisc")}
        />
        <ReferenceLine x={diabetes} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
