"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GGR, useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export function GGRInput(): JSX.Element {
  const { ggr, setGgr } = useStore();

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("GGR")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <RadioGroup
            defaultValue={ggr || ""}
            onValueChange={(ggr) => setGgr(ggr as GGR)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="lightIncreased" id="r1" />
              <Label htmlFor="r1">{t("lightIncreased")}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="moderateIncreased" id="r2" />
              <Label htmlFor="r2">{t("moderateIncreased")}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="highIncreased" id="r3" />
              <Label htmlFor="r3">{t("highIncreased")}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="extremeIncreased" id="r4" />
              <Label htmlFor="r4">{t("extremeIncreased")}</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
