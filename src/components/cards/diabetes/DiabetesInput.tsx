"use client";

import { DiabetesChartComponent } from "@/components/charts/DiabetesChart";
import { DiabetesConfig } from "@/components/measures/calcDiabetes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldCheckLabel } from "@/components/ui/custom/fieldCheckLabel";
import { FieldNumberLabel } from "@/components/ui/custom/fieldNumberLabel";
import { round } from "@/helpers/number_helpers";
import { DiabetesFormState, Gender, useStore } from "@/hooks/useStore";
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
const clampNumber = (n: number | undefined) =>
  Number.isFinite(n as number) ? (n as number) : undefined;

function pointsForRange(
  value: number | undefined,
  ranges: { min: number; max: number; pts: number }[],
) {
  if (value === undefined) return 0;
  for (const r of ranges) {
    if (value >= r.min && value < r.max) return r.pts;
  }
  return 0;
}

function DiabetesInput(): JSX.Element {
  const { t } = useTranslation();
  const {
    height,
    waist,
    age,
    gender,
    diabetes,
    setDiabetes,
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

  console.log("Form ,", form);
  useEffect(() => {
    setForm((f: DiabetesFormState) => ({
      ...f,
      sex: gender || initialState.sex,
      age55to64: age ? age >= 55 && age < 65 : false,
      waistCm: waist,
      heightCm: height,
    }));
  }, [height, waist, gender, age]);

  const pts = useMemo(() => {
    let total = 0;
    const detail: Record<string, number> = {};

    // Base yes/no factors
    const { base } = DiabetesConfig;
    if (form.diabeticMother) {
      total += base.diabeticMother;
      detail["Diabetic mother"] = base.diabeticMother;
    }
    if (form.diabeticFather) {
      total += base.diabeticFather;
      detail["Diabetic father"] = base.diabeticFather;
    }
    if (form.hypertension) {
      total += base.hypertension;
      detail["Hypertension"] = base.hypertension;
    }
    if (form.blackRace) {
      total += base.blackRace;
      detail["Black race"] = base.blackRace;
    }
    if (form.age55to64) {
      total += base.age55to64;
      detail["Age 55–64 y"] = base.age55to64;
    }
    if (form.neverOrFormerDrinker) {
      total += base.neverOrFormerDrinker;
      detail["Never/former drinker"] = base.neverOrFormerDrinker;
    }

    // Waist circumference (sex specific)
    const w = clampNumber(form.waistCm);
    const waistPts = pointsForRange(w, DiabetesConfig.waist[form.sex]);
    if (waistPts) {
      total += waistPts;
      detail["Waist circumference"] = waistPts;
    }

    // Height (shortness) — points if below threshold
    const h = clampNumber(form.heightCm);
    if (h !== undefined) {
      const shortThreshold = DiabetesConfig.heightShort[form.sex];
      if (h < shortThreshold) {
        total += DiabetesConfig.heightShort.pts;
        detail["Height (<threshold)"] = DiabetesConfig.heightShort.pts;
      }
    }

    // Resting pulse — points if >= threshold
    const p = clampNumber(form.pulse);
    if (p !== undefined) {
      const pulseThr = DiabetesConfig.pulseHigh[form.sex];
      if (p >= pulseThr) {
        total += DiabetesConfig.pulseHigh.pts;
        detail["Resting pulse (high)"] = DiabetesConfig.pulseHigh.pts;
      }
    }

    // Fasting glucose
    const g = clampNumber(form.glucoseMmol);
    const gPts = pointsForRange(g, DiabetesConfig.glucose);
    if (gPts) {
      total += gPts;
      detail["Glucose"] = gPts;
    }

    // Triglycerides (sex specific)
    const t = clampNumber(form.trigMmol);
    const tPts = pointsForRange(t, DiabetesConfig.triglycerides[form.sex]);
    if (tPts) {
      total += tPts;
      detail["Triglycerides"] = tPts;
    }

    // HDL — low threshold
    const hdl = clampNumber(form.hdlMmol);
    if (hdl !== undefined) {
      const hdlThr = DiabetesConfig.hdlLow[form.sex];
      if (hdl < hdlThr) {
        total += DiabetesConfig.hdlLow.pts;
        detail["HDL (low)"] = DiabetesConfig.hdlLow.pts;
      }
    }

    // Uric acid — high threshold
    const ua = clampNumber(form.uricUmol);
    if (ua !== undefined) {
      const uaThr = DiabetesConfig.uricAcidHigh[form.sex];
      if (ua >= uaThr) {
        total += DiabetesConfig.uricAcidHigh.pts;
        detail["Uric acid (high)"] = DiabetesConfig.uricAcidHigh.pts;
      }
    }

    const band =
      DiabetesConfig.riskBands.find((b) => total >= b.min && total < b.max) ??
      DiabetesConfig.riskBands[DiabetesConfig.riskBands.length - 1];
    const risk = band.risk;
    setDiabetes(total);
    setDiabetesRisc(risk);
    return { total, detail };
  }, [form]);

  const percentOfMax = Math.min(
    100,
    Math.round((pts.total / DiabetesConfig.maxTotal) * 100),
  );

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
                aria-label={`Score bar ${diabetes} of ${DiabetesConfig.maxTotal}`}
              />
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {t("totalPoints")}:{" "}
              <span className="font-semibold text-slate-900">{diabetes}</span> /{" "}
              {DiabetesConfig.maxTotal}
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
            {Object.entries(pts.detail).length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("noContributingFactors")}
              </p>
            ) : (
              Object.entries(pts.detail).map(([k, v]) => (
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
