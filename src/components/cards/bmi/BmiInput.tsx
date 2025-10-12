"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BMIChartComponent } from "./BMIChart";

export function BmiInput(): JSX.Element {
  const { weight, setWeight } = useStore();
  const { height, setHeight } = useStore();
  const { bmi, setBmi } = useStore();
  const { bmiCategory, setBmiCategory } = useStore();

  const { t } = useTranslation();

  const calculateBmi = () => {
    if (weight && weight > 0 && height && height > 0) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));

      // Determine BMI category
      if (bmiValue < 18.5) setBmiCategory("underWeight");
      else if (bmiValue >= 18.5 && bmiValue < 25)
        setBmiCategory("normalWeight");
      else if (bmiValue >= 25 && bmiValue < 30) setBmiCategory("overWeight");
      else if (bmiValue >= 30 && bmiValue < 35) setBmiCategory("obeseClass1");
      else if (bmiValue >= 35 && bmiValue < 40) setBmiCategory("obeseClass2");
      else setBmiCategory("obeseClass3");
    } else {
      setBmi(null);
      setBmiCategory(null);
    }
  };

  useEffect(() => {
    calculateBmi();
  }, [weight, height]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bmiCalculator")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">{t("weight")}</Label>
          <Input
            id="weight"
            type="number"
            placeholder={t("enterWight")}
            value={weight || ""}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">{t("height")}</Label>
          <Input
            id="height"
            type="number"
            placeholder={t("enterHeight")}
            value={height || ""}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
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
      </CardContent>
    </Card>
  );
}

export default BmiInput;
