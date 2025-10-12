"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export function NameAge(): JSX.Element {
  const { gender, setGender } = useStore();
  const { name, setName } = useStore();
  const { age, setAge } = useStore();

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("nameAge")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("enterName")}
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">{t("age")}</Label>
          <Input
            id="age"
            type="number"
            placeholder={t("enterAge")}
            value={age || ""}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <RadioGroup
            defaultValue={gender || ""}
            onValueChange={(genderValue) =>
              setGender(genderValue as "male" | "female")
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="female" id="r1" />
              <Label htmlFor="r1">{t("female")}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="male" id="r2" />
              <Label htmlFor="r2">{t("male")}</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
