"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { WaistChartComponent } from "./WaistHipChart";

export function WaistHipInput(): JSX.Element {
  const { waist, setWaist } = useStore();
  const { hip, setHip } = useStore();
  const { waistHip, setWaistHip } = useStore();

  const { t } = useTranslation();

  const calculateWaistHip = () => {
    if (hip && hip > 0 && waist && waist > 0) {
      const ggr = waist / hip;
      setWaistHip(ggr);
    } else {
      setWaistHip(null);
    }
  };

  useEffect(() => {
    calculateWaistHip();
  }, [waist, hip]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("waistHipCalculator")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="waist">{t("waist")}</Label>
          <Input
            id="waist"
            type="number"
            placeholder={t("enterWaist")}
            value={waist || ""}
            onChange={(e) => setWaist(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hip">{t("hip")}</Label>
          <Input
            id="hip"
            type="number"
            placeholder={t("enterHip")}
            value={hip || ""}
            onChange={(e) => setHip(Number(e.target.value))}
          />
        </div>
        {waistHip && waistHip > 0 && (
          <div className="pt-1 pb-4">
            <p className="text-lg font-semibold">
              {t("yourWaistHip")}: {Math.round(waistHip * 100) / 100}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
