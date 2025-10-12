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

export const WaistChartComponent = ({ waist }: { waist: number }) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("waist"),
      waistUnderSize: 88,
      waistOverSize: 200,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[80px] w-full">
      <BarChart layout="vertical" data={data} margin={{ right: 10 }}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" domain={[0, 200]} interval={0} ticks={[88]} />
        <YAxis dataKey="name" type="category" />
        <Legend />

        <Bar
          dataKey="waistUnderSize"
          stackId="a"
          fill="#849190"
          name={t("waistUnderSize")}
        />
        <Bar
          dataKey="waistOverSize"
          stackId="a"
          fill="#281415"
          name={t("waistOverSize")}
        />
        <ReferenceLine x={waist} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
