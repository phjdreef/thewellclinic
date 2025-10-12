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

export const WaistChartRatioComponent = ({
  waist,
  hip,
  gender,
}: {
  waist: number;
  hip: number;
  gender: "male" | "female" | null;
}) => {
  const { t } = useTranslation();

  const waistHipRatio = waist / hip;
  const waistHipRatioOk = gender === "male" ? 0.95 : 0.8;

  const data = [
    {
      name: t("waistRatio"),
      waistRatioOk: waistHipRatioOk,
      waistRatioNok: 1.8,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[80px] w-full">
      <BarChart layout="vertical" data={data} margin={{ right: 10, left: 15 }}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          domain={[0, 1, 8]}
          interval={0}
          ticks={[waistHipRatioOk]}
        />
        <YAxis dataKey="name" type="category" />
        <Legend />

        <Bar
          dataKey="waistRatioOk"
          stackId="a"
          fill="#849190"
          name={t("waistRatioOk")}
        />
        <Bar
          dataKey="waistRatioNok"
          stackId="a"
          fill="#2D1415"
          name={t("waistRatioNok")}
        />
        <ReferenceLine x={waistHipRatio} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
