"use client";

import { BMIChartComponent } from "@/components/charts/BMIChart";
import { GgrChartComponent } from "@/components/charts/GGRChart";
import { Score2ChartComponent } from "@/components/charts/Score2Chart";
import { WaistChartComponent } from "@/components/charts/WaistChart";
import { calcBmi, determineBmiCategory } from "@/components/measures/calcBmi";
import { calcScore2Unified } from "@/components/measures/calcScore2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { useStore } from "@/hooks/useStore";
import { JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { calcGgrCategory } from "../../measures/calcGGR";

export function MeasureInput(): JSX.Element {
  const {
    weight,
    setWeight,
    height,
    setHeight,
    waist,
    setWaist,
    bmi,
    ggr,
    setBmi,
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
    // Calculate BMI and related metrics
    let bmiValue: number | undefined;
    let bmiCategory: ReturnType<typeof determineBmiCategory> | undefined;

    if (weight && weight > 0 && height && height > 0) {
      bmiValue = calcBmi(weight, height);
      bmiCategory = determineBmiCategory(bmiValue);
      setBmi(bmiValue);
      setBmiCategory(bmiCategory);

      // Calculate GGR if we have all required data
      if (waist && waist > 0 && gender && bmiValue > 0) {
        const ggrCategory = calcGgrCategory({
          bmi: bmiValue,
          bmiCategory: bmiCategory,
          gender: gender,
          waist: waist,
          hasComorbidity: comorbidity,
        });
        setGgr(ggrCategory.GgrCategory);
      } else {
        setGgr(undefined);
      }
    } else {
      // Clear BMI-related values when inputs are invalid
      setBmi(undefined);
      setBmiCategory(undefined);
      setGgr(undefined);
    }

    // Calculate Score2 risk
    if (gender && age && systolic && systolic > 0 && nonHdl) {
      const score2Result = calcScore2Unified({
        age: age,
        sbp: systolic,
        nonHdl: nonHdl,
        smoker: smoking,
        sex: gender,
        region: "low",
      });
      setScore2(score2Result || undefined);
    } else {
      setScore2(undefined);
    }
  };

  useEffect(() => {
    calculateMeasures();
  }, [
    weight,
    height,
    waist,
    gender,
    comorbidity,
    age,
    systolic,
    nonHdl,
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

        {!!waist && <hr />}
        <WaistChartComponent />
        {!!bmi && <hr />}
        <BMIChartComponent />
        {!!ggr && <hr />}
        <GgrChartComponent />
        {!!score2 && <hr />}
        <Score2ChartComponent />
      </CardContent>
    </Card>
  );
}

export default MeasureInput;
