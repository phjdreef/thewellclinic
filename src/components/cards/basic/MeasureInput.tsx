"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { useStore } from "@/hooks/useStore";
import { JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { calcGgrCategory } from "../../measures/calcGGR";
import { calcBmi, determineBmiCategory } from "@/components/measures/calcBmi";
import { GgrChartComponent } from "@/components/charts/GGRChart";
import { BMIChartComponent } from "@/components/charts/BMIChart";
import { WaistChartComponent } from "@/components/charts/WaistChart";
import { Score2ChartComponent } from "@/components/charts/Score2Chart";
import { calcScore2Unified } from "@/components/measures/calcScore2";

export function MeasureInput(): JSX.Element {
  const {
    weight,
    setWeight,
    height,
    setHeight,
    waist,
    setWaist,
    bmi,
    setBmi,
    bmiCategory,
    setBmiCategory,
    setGgr,
    gender,
    comorbidity,
    systolic,
    setSystolic,
    nonHdl,
    setNonHdl,
    age,
    smoking,
    score2,
    setScore2,
  } = useStore();

  const { t } = useTranslation();

  const calculateMeasures = () => {
    const sbp = systolic && systolic > 0 ? systolic : undefined;
    if (gender && age && sbp && nonHdl && nonHdl > 0) {
      const score2 = calcScore2Unified({
        age: age,
        sbp: sbp,
        nonHdl: nonHdl,
        smoker: smoking,
        sex: gender,
        region: "low",
      });
      if (!score2) return;
      setScore2(score2);
    }
    if (weight && weight > 0 && height && height > 0) {
      const bmiValue = calcBmi(weight, height);
      setBmi(bmiValue);
      const bmiCategory = determineBmiCategory(bmiValue);
      setBmiCategory(bmiCategory);

      // Determine BMI category

      if (waist && gender && bmiValue > 0 && waist > 0) {
        const ggrCategory = calcGgrCategory({
          bmi: bmiValue,
          bmiCategory: bmiCategory,
          gender: gender,
          waist: waist,
          hasComorbidity: comorbidity,
        });
        setGgr(ggrCategory.GgrCategory);
      }

      // calculate Score2 risk
    } else {
      setBmi(undefined);
      setBmiCategory(undefined);
      setGgr(undefined);
    }
  };

  useEffect(() => {
    calculateMeasures();
  }, [
    weight,
    height,
    comorbidity,
    waist,
    gender,
    nonHdl,
    systolic,
    age,
    smoking,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tabMeasures")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldNumberLabel
          id="weight"
          label={t("weight")}
          placeholder={t("enterWeight")}
          value={weight || undefined}
          onChange={(e) => setWeight(e)}
        />
        <FieldNumberLabel
          id="height"
          placeholder={t("enterHeight")}
          value={height || undefined}
          onChange={(e) => setHeight(e)}
          label={t("height")}
        />
        <FieldNumberLabel
          id="waist"
          placeholder={t("enterWaist")}
          value={waist || undefined}
          onChange={(e) => setWaist(e)}
          label={t("waist")}
        />

        <FieldNumberLabel
          id="systolic"
          placeholder={t("enterSystolic")}
          value={systolic || undefined}
          onChange={(e) => setSystolic(e)}
          label={t("systolicBloodPressure")}
        />
        <FieldNumberLabel
          id="nonHdl"
          placeholder={t("enterNonHdl")}
          value={nonHdl || undefined}
          onChange={(e) => setNonHdl(e)}
          label={t("nonHdlCholesterol")}
        />

        <WaistChartComponent />
        <BMIChartComponent />
        <GgrChartComponent />
        <Score2ChartComponent />
      </CardContent>
    </Card>
  );
}

export default MeasureInput;
