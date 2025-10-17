"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/useStore";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
type Props = {
  element:
    | "overall_result_header"
    | "bmi_result_header"
    | "waist_result_header"
    | "hip_result_header"
    | "ggr_result_header"
    | "biologicAge_result_header"
    | "score2_result_header"
    | "diabetes_result_header";
};

export function TextInput({ element }: Props): JSX.Element {
  const { texts, setTexts } = useStore();

  const { t } = useTranslation();
  const index = Object.keys(texts).indexOf(element);

  const handleChange = (newContent: string) => {
    setTexts({ i: element, content: newContent });
  };

  return (
    <Card data-testid="text-input-card">
      <CardHeader>
        <CardTitle>{t(element)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={texts[element as keyof typeof texts] || ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
