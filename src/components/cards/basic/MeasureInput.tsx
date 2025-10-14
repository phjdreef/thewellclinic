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
  } = useStore();

  const { t } = useTranslation();

  const calculateMeasures = () => {
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
    } else {
      setBmi(undefined);
      setBmiCategory(undefined);
      setGgr(undefined);
    }
  };

  useEffect(() => {
    calculateMeasures();
  }, [weight, height, comorbidity, waist, gender]);

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
        {bmi && bmi > 0 && (
          <div className="pt-1 pb-4">
            <p className="text-lg font-semibold">
              {t("yourBMI")}: {bmi}
            </p>
            {bmiCategory && (
              <p className="text-muted-foreground text-sm">
                {t("category")}: {t(bmiCategory)}
              </p>
            )}
          </div>
        )}
        <WaistChartComponent />
        <BMIChartComponent />
        <GgrChartComponent />
      </CardContent>
    </Card>
  );
}

export default MeasureInput;
