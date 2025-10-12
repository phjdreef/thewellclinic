"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export function DiabetesInput(): JSX.Element {
  const { diabetes, setDiabetes } = useStore();

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("diabetes")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="diabetes">{t("diabetes")}</Label>
          <Input
            id="diabetes"
            type="number"
            placeholder={t("enterRisc")}
            value={diabetes || ""}
            onChange={(e) => setDiabetes(Number(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default DiabetesInput;
