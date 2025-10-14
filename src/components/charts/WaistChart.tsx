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

export const WaistChartComponent = () => {
  const { waist, gender } = useStore();
  const { t } = useTranslation();

  if (!waist || !gender) {
    return null;
  }

  const breakPoint = gender === "male" ? 102 : 88;

  const data = [
    {
      name: t("waist"),
      waistUnderSize: breakPoint,
      waistOverSize: 200,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">{t("waistChartTitle")}</h3>
      <ChartContainer config={chartConfig} className="h-[80px] w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            type="number"
            domain={[0, 200]}
            interval={0}
            ticks={[breakPoint]}
          />
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
    </div>
  );
};
