"use client";

import { DiabetesChartComponent } from "@/components/charts/DiabetesChart";
import { DiabetesConfig } from "@/components/measures/calcDiabetes";
import { calcDiabetesRisk } from "@/components/measures/calcDiabetesRisk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldCheckLabel } from "@/components/ui/custom/fieldCheckLabel";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { round } from "@/helpers/number_helpers";
import { DiabetesFormState, useStore } from "@/hooks/useStore";
import { JSX, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const initialState: DiabetesFormState = {
  sex: "male",
  age55to64: false,
  diabeticMother: false,
  diabeticFather: false,
  hypertension: false,
  blackRace: false,
  neverOrFormerDrinker: false,
};

// -------------------- HELPERS -------------------- //

function DiabetesInput(): JSX.Element {
  const { t } = useTranslation();
  const {
    height,
    waist,
    age,
    gender,
    diabetesPoints,
    setDiabetesPoints,
    diabetesRisc,
    setDiabetesRisc,
    diabetesForm,
    setDiabetesForm,
  } = useStore();

  const form = diabetesForm || initialState;

  const setForm = (updater: (prev: DiabetesFormState) => DiabetesFormState) => {
    const newForm = updater(form);
    setDiabetesForm(newForm);
  };

  // Function to translate detail labels
  const translateDetailLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      "Diabetic mother": t("diabeticMother"),
      "Diabetic father": t("diabeticFather"),
      Hypertension: t("hypertension"),
      "Black race": t("blackRace"),
      "Age 55–64 y": "Leeftijd 55-64 jaar",
      "Never/former drinker": t("neverOrFormerDrinker"),
      "Waist circumference": "Buikomtrek",
      "Height (<threshold)": "Lengte (onder drempel)",
      "Resting pulse (high)": "Rustpols (hoog)",
      Glucose: t("glucose").split(" ")[0], // Remove unit for detail
      Triglycerides: t("triglycerides").split(" ")[0],
      "HDL (low)": "HDL (laag)",
      "Uric acid (high)": "Urinezuur (hoog)",
    };
    return labelMap[key] || key;
  };

  useEffect(() => {
    setForm((f: DiabetesFormState) => ({
      ...f,
      sex: gender || initialState.sex,
      age55to64: age ? age >= 55 && age < 65 : false,
      waistCm: waist,
      heightCm: height,
    }));
  }, [height, waist, gender, age]);

  const diabetesResult = useMemo(() => {
    const result = calcDiabetesRisk({
      sex: form.sex,
      age: age,
      waistCm: form.waistCm,
      heightCm: form.heightCm,
      pulse: form.pulse,
      glucoseMmol: form.glucoseMmol,
      trigMmol: form.trigMmol,
      hdlMmol: form.hdlMmol,
      uricUmol: form.uricUmol,
      diabeticMother: form.diabeticMother,
      diabeticFather: form.diabeticFather,
      hypertension: form.hypertension,
      blackRace: form.blackRace,
      neverOrFormerDrinker: form.neverOrFormerDrinker,
    });

    setDiabetesPoints(result.totalPoints);
    setDiabetesRisc(result.risk);
    return result;
  }, [form, age, setDiabetesPoints, setDiabetesRisc]);

  const percentOfMax = diabetesResult.percentOfMax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("diabetes")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { key: "diabeticMother", label: t("diabeticMother") },
          { key: "diabeticFather", label: t("diabeticFather") },
          { key: "hypertension", label: t("hypertension") },
          { key: "blackRace", label: t("blackRace") },
          { key: "neverOrFormerDrinker", label: t("neverOrFormerDrinker") },
        ].map((c: any) => (
          <FieldCheckLabel
            key={c.key}
            id={c.key}
            label={c.label}
            checked={(form as any)[c.key]}
            onCheckedChange={(e) =>
              setForm((f: DiabetesFormState) => ({ ...f, [c.key]: e }))
            }
          />
        ))}

        {[
          { key: "pulse", label: t("restingPulse") },
          { key: "glucoseMmol", label: t("glucose") },
          { key: "trigMmol", label: t("triglycerides") },
          { key: "hdlMmol", label: t("hdlCholesterol") },
          { key: "uricUmol", label: t("uricAcid") },
        ].map((c: any) => (
          <FieldNumberLabel
            key={c.key}
            id={c.key}
            label={c.label}
            placeholder={c.label}
            value={(form as any)[c.key] || undefined}
            onChange={(e) =>
              setForm((f: DiabetesFormState) => ({ ...f, [c.key]: e }))
            }
          />
        ))}
        <DiabetesChartComponent />

        <div className="sticky top-4 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 font-medium">{t("score")}</h2>
          <div className="mb-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-slate-800"
                style={{ width: `${percentOfMax}%` }}
                aria-label={`Score bar ${diabetesPoints} of ${DiabetesConfig.maxTotal}`}
              />
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {t("totalPoints")}:{" "}
              <span className="font-semibold text-slate-900">
                {diabetesPoints}
              </span>{" "}
              / {DiabetesConfig.maxTotal}
            </div>
            {diabetesRisc && (
              <div className="mt-2 text-sm text-slate-600">
                {t("risk")}:{" "}
                <span className="font-semibold text-slate-900">
                  {round(diabetesRisc * 100, 1)} %
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {Object.entries(diabetesResult.detail).length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("noContributingFactors")}
              </p>
            ) : (
              Object.entries(diabetesResult.detail).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {translateDetailLabel(k)}
                  </span>
                  <span className="font-medium">+{v}</span>
                </div>
              ))
            )}
          </div>

          <hr className="my-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default DiabetesInput;
