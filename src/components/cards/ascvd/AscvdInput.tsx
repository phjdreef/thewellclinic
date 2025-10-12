"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="space-y-2">
          <Label htmlFor="ascvd">{t("ascvd")}</Label>
          <Input
            id="ascvd"
            type="number"
            placeholder={t("enterRisc")}
            value={ascvd || ""}
            onChange={(e) => setAscvd(Number(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default AscvdInput;
