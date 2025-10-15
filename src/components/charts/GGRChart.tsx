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
import { GgrCategory } from "../measures/calcGGR";
import { useStore } from "@/hooks/useStore";

export const GgrChartComponent = () => {
  const { t } = useTranslation();
  const { ggr } = useStore();

  if (!ggr) {
    return null;
  }

  const ggrValueMap: Record<Exclude<GgrCategory, undefined>, number> = {
    normal: 0,
    lightIncreased: 0.5,
    moderateIncreased: 1.5,
    stronglyIncreased: 2.5,
    extremeIncreased: 3.5,
  };

  const data = [
    {
      name: t("ggr"),
      lightIncreased: 1,
      moderateIncreased: 1,
      highIncreased: 1,
      extremeIncreased: 1,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="w-full">
      {/* <h3 className="mb-4 text-lg font-semibold">{t("ggrChartTitle")}</h3> */}
      <ChartContainer config={chartConfig} className="h-[80px] w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" domain={[0, 4]} ticks={[0]} />
          <YAxis dataKey="name" type="category" />
          <Legend />

          <Bar
            dataKey="lightIncreased"
            stackId="a"
            fill="#849190"
            name={t("lightIncreased")}
          />
          <Bar
            dataKey="moderateIncreased"
            stackId="a"
            fill="#EBE3DA"
            name={t("moderateIncreased")}
          />
          <Bar
            dataKey="highIncreased"
            stackId="a"
            fill="#A03F45"
            name={t("highIncreased")}
          />
          <Bar
            dataKey="extremeIncreased"
            stackId="a"
            fill="#4C2024"
            name={t("extremeIncreased")}
          />
          {ggr && (
            <ReferenceLine
              x={ggrValueMap[ggr]}
              strokeWidth={8}
              stroke="#106da6"
            />
          )}
        </BarChart>
      </ChartContainer>
      <p className="font-semibold">
        {t("yourGGR")}: {t(ggr)}
      </p>
    </div>
  );
};
