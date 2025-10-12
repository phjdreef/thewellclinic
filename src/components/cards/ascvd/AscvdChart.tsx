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

export const AscvdChartComponent = ({ ascvd }: { ascvd: number }) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("ascvdRisc"),
      lowRisc: 1,
      mediumRisc: 4,
      highRisc: 5,
      extremeRisc: 5,
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
          ticks={[1, 5, 10, 15]}
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

        <ReferenceLine x={ascvd} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
