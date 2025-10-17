"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldCheckLabel } from "@/components/ui/custom/fieldCheckLabel";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { FieldStringLabel } from "@/components/ui/custom/fieldStringLabel";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export function BasicInput(): JSX.Element {
  const {
    gender,
    setGender,
    name,
    setName,
    age,
    setAge,
    comorbidity,
    setComorbidity,
    smoking,
    setSmoking,
  } = useStore();

  const { t } = useTranslation();

  return (
    <Card data-testid="basic-input-card">
      <CardHeader>
        <CardTitle>{t("tabBasic")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldStringLabel
          id="name"
          placeholder={t("enterName")}
          value={name || ""}
          onChange={(e) => setName(e)}
          label={t("name")}
          width="24rem"
        />
        <FieldNumberLabel
          id="age"
          placeholder={t("enterAge")}
          value={age || undefined}
          onChange={(e) => setAge(e)}
          label={t("age")}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("gender")}</span>
          <RadioGroup
            defaultValue={gender}
            onValueChange={(genderValue) =>
              setGender(genderValue as "male" | "female")
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                checked={gender === "male"}
                value="male"
                id="r2"
                data-testid="gender-male"
              />
              <Label htmlFor="r2">{t("male")}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem
                checked={gender === "female"}
                value="female"
                id="r1"
                data-testid="gender-female"
              />
              <Label htmlFor="r1">{t("female")}</Label>
            </div>
          </RadioGroup>
        </div>

        <FieldCheckLabel
          id="comorbidity"
          label={t("comorbidity")}
          checked={comorbidity}
          onCheckedChange={(e) => setComorbidity(e)}
        />
        <FieldCheckLabel
          id="smoking"
          label={t("smoking")}
          checked={smoking}
          onCheckedChange={(e) => setSmoking(e)}
        />
      </CardContent>
    </Card>
  );
}
