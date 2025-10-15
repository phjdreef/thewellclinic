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

export const BMIChartComponent = () => {
  const { t } = useTranslation();
  const { bmi, bmiCategory, height, weight } = useStore();

  if (bmi === undefined) {
    return null;
  }

  const data = [
    {
      name: t("BMI"),
      underWeight: 8.5, // 18.5 - 10 = 8.5 (adjusted for starting at 10)
      normalWeight: 6.5,
      overWeight: 5.0,
      obeseClass1: 5.0,
      obeseClass2: 5.0,
      obeseClass3: 5.0,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="w-full">
      {/* <h3 className="mb-4 text-lg font-semibold">{t("bmiChartTitle")}</h3> */}
      <ChartContainer config={chartConfig} className="h-[80px] w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            type="number"
            domain={[0, 35]}
            interval={0}
            ticks={[0, 8.5, 15, 20, 25, 30, 35]}
            tickFormatter={(value) => (value + 10).toString()}
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
          <ReferenceLine x={bmi - 10} strokeWidth={8} stroke="#106da6" />
        </BarChart>
      </ChartContainer>

      {bmi && bmi > 0 && (
        <div className="mt-4 mb-4">
          <span className="font-semibold">
            {t("yourBMI")}: {bmi}
          </span>

          <span className="ml-2">
            ({t("heightDescr")} {height} cm, {t("weightDescr")} {weight} kg)
          </span>

          {bmiCategory && (
            <p className="font-semibold">
              {t("category")}: {t(bmiCategory)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
