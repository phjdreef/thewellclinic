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

export const DiabetesChartComponent = () => {
  const { t } = useTranslation();
  const { diabetesRisc, diabetes } = useStore();

  if (!diabetesRisc || !diabetes) {
    return null;
  }

  // Data from https://www.diabetes.org.uk/resources-s3/2019-09/diabetes-prevalence-2019.pdf
  // Page 7, Table 1: Estimated percentage of people with diabetes by age group, England, 2019
  // Low risk: <3.5%
  // Medium risk: 3.5% - 6.4%
  // High risk: 6.5% - 11.4%
  // Extreme risk: 11.5% - 19.2%
  // Very high risk: >19.3%
  // We use the midpoints of these ranges for the chart segments.
  // Low risk: 3.5%
  // Medium risk: 2.9% (6.4 - 3.5)
  // High risk: 5.1% (11.4 - 6.5)
  // Extreme risk: 7.8% (19.2 - 11.5)
  // Very high risk: 26.8% (100 - 19.3)
  // Total: 45.1%
  // We set the chart max to 15% to focus on the lower risk categories where most users will fall.
  // The reference line will show the actual risk, even if it's above the chart max.
  // The chart is therefore not to scale for risks above 15%, but still gives a good visual indication of risk level.
  // Users with very high risk will see the reference line at the far right of the chart. This is acceptable for our purposes.

  // Custom tick formatter for X-axis labels
  const formatXAxisTick = (value: number) => {
    switch (value) {
      case 0:
        return "0%";
      case 1:
        return "3,5%";
      case 2:
        return "6,4%";
      case 3:
        return "11,5%";
      case 4:
        return "19,3%";
      case 5:
        return "46,1%";
      default:
        return value.toString();
    }
  };

  // Map diabetes risk percentage to chart position
  const mapRiskToChartPosition = (riskRatio: number) => {
    const riskPercent = riskRatio * 100; // Convert ratio to percentage

    if (riskPercent < 3.5) {
      // Low risk: 0% to 3.5% maps to position 0.5-1.5 (center of first bar)
      return -0.9 + (riskPercent / 3.5) * 1;
    } else if (riskPercent < 6.4) {
      // Medium risk: 3.5% to 6.4% maps to position 1.5-2.5 (center of second bar)
      return 0.9 + ((riskPercent - 3.5) / (6.4 - 3.5)) * 1;
    } else if (riskPercent < 11.4) {
      // High risk: 6.4% to 11.4% maps to position 2.5-3.5 (center of third bar)
      return 1.9 + ((riskPercent - 6.4) / (11.4 - 6.4)) * 1;
    } else if (riskPercent < 19.2) {
      // Extreme risk: 11.4% to 19.2% maps to position 3.5-4.5 (center of fourth bar)
      return 2.9 + ((riskPercent - 11.4) / (19.2 - 11.4)) * 1;
    } else {
      // Very high risk: 19.2%+ maps to position 4.5-5.5 (center of fifth bar)
      return 3.9 + ((riskPercent - 19.2) / (46.0 - 19.2)) * 1;
    }
  };

  const chartPosition = mapRiskToChartPosition(diabetesRisc);

  const data = [
    {
      name: t("diabetesRisc"),
      lowRisc: 1,
      mediumRisc: 1,
      highRisc: 1,
      extremeRisc: 1,
      highextremeRisc: 1,
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[80px] w-full"
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, bottom: 5, left: 5 }}
        height={80}
      >
        <XAxis
          type="number"
          interval={0}
          ticks={[0, 1, 2, 3, 4, 5]}
          domain={[0, 5]}
          tickFormatter={formatXAxisTick}
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
        <ReferenceLine x={chartPosition} strokeWidth={8} stroke="#106da6" />
      </BarChart>
    </ChartContainer>
  );
};
