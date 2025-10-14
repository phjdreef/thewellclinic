"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export function AscvdInput(): JSX.Element {
  const { ascvd, setAscvd } = useStore();

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ascvd")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldNumberLabel
          id="ascvd"
          placeholder={t("enterRisc")}
          value={ascvd || undefined}
          onChange={(e) => setAscvd(e)}
          label={t("ascvd")}
        />
      </CardContent>
    </Card>
  );
}

export default AscvdInput;
