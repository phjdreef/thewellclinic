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

export const BMIChartComponent = ({ bmi }: { bmi: number }) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("BMI"),
      underWeight: 18.5,
      normalWeight: 6.5,
      overWeight: 5.0,
      obeseClass1: 5.0,
      obeseClass2: 5.0,
      obeseClass3: 5.0,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[80px] w-full">
      <BarChart layout="vertical" data={data} margin={{ right: 10 }}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          domain={[0, 45]}
          interval={0}
          ticks={[0, 18.5, 25, 30, 35, 40, 45]}
        />
        <YAxis dataKey="name" type="category" />
        <Legend />

        <Bar
          dataKey="underWeight"
          stackId="a"
          fill="#BBC0C0"
          name={t("underWeight")}
        />
        <Bar
          dataKey="normalWeight"
          stackId="a"
          fill="#849190"
          name={t("normalWeight")}
        />
        <Bar
          dataKey="overWeight"
          stackId="a"
          fill="#EBE3DA"
          name={t("overWeight")}
        />
        <Bar
          dataKey="obeseClass1"
          stackId="a"
          fill="#A03F45"
          name={t("obeseClass1")}
        />
        <Bar
          dataKey="obeseClass2"
          stackId="a"
          fill="#4C2024"
          name={t("obeseClass2")}
        />
        <Bar
          dataKey="obeseClass3"
          stackId="a"
          fill="#281415"
          name={t("obeseClass3")}
        />
        <ReferenceLine x={bmi} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
