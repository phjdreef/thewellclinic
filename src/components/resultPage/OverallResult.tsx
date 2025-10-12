"use client";

import { Markdowntext } from "@/components/template/MardownText";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import "@/styles/markdown.css"; // Ensure you have styles for markdown
import { JSX, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { BMIChartComponent } from "../cards/bmi/BMIChart";
import { WaistChartComponent } from "../cards/waistHip/WaistHipChart";
import { WaistChartRatioComponent } from "../cards/waistHip/WaistHipRatioChart";
import TextAreaResult from "../template/TextArea";
import { GgrChartComponent } from "../cards/ggr/GGRChart";
import { AscvdChartComponent } from "../cards/ascvd/AscvdChart";
import { DiabetesChartComponent } from "../cards/diabetes/DiabetesChart";

export function OverallResult(): JSX.Element {
  const {
    bmi,
    bmiCategory,
    name,
    age,
    ascvd,
    diabetes,
    gender,
    waist,
    hip,
    waistHip,
    ggr,
    height,
    weight,
    texts,
  } = useStore();
  const { t } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    pageStyle: `@media print {
      @page {
        margin: 10 10 10 10 !important;
      }
    }`,
    contentRef,
  });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={reactToPrintFn}>Print</Button>
      </div>

      <div id="overall-result" ref={contentRef} className="p-4 pt-8">
        <h1 className="mb-10 text-center text-4xl font-bold">
          {t("overall_result_header")}
        </h1>
        {name && name.length > 0 && (
          <p>
            {t("name")}: <span className="font-bold">{name}</span>
          </p>
        )}
        {age && age > 0 && (
          <p>
            {t("age")}:{" "}
            <span className="font-bold">
              {age} {t("year")}
            </span>
          </p>
        )}
        {gender && gender.length > 0 && (
          <p>
            {t("gender")}: <span className="font-bold">{t(gender)}</span>
          </p>
        )}
        <p>
          {t("date")}:{" "}
          <span className="font-bold">
            {new Date().toLocaleDateString("nl-NL")}
          </span>
        </p>
        <Markdowntext component="overall" beforeAfter="before" />
        <TextAreaResult
          content={texts.overall_result_header}
          className="mt-4"
        />
        {/* bmi */}
        {!!bmi && height && bmi > 0 && (
          <div className="mt-10 space-y-4">
            <p className="font-bold">{t("bmi_result_header")}</p>
            <Markdowntext component="bmi" beforeAfter="before" />
            <BMIChartComponent bmi={bmi} />
            <span className="font-bold">
              {t("yourBMI")}: {bmi}
            </span>
            <span className="ml-2">
              ({t("heightDescr")} {height} cm, {t("weightDescr")} {weight} kg)
            </span>

            {bmiCategory && (
              <p className="font-bold">
                {t("category")}: {t(bmiCategory)}
              </p>
            )}
            <TextAreaResult content={texts.bmi_result_header} />
            <Markdowntext component="bmi" beforeAfter="after" />
          </div>
        )}
        {/* waist and hip */}
        {!!waist && waist > 0 && (
          <div className="mt-10 space-y-4">
            <p className="font-bold">{t("waist_result_header")}</p>
            <Markdowntext component="waist" beforeAfter="before" />
            <WaistChartComponent waist={waist} />
            <p className="font-bold">
              {t("yourWaist")}: {waist}
            </p>
            {hip && waistHip && waistHip > 0 && (
              <>
                <WaistChartRatioComponent
                  waist={waist}
                  hip={hip}
                  gender={gender}
                />
                <p className="font-bold">
                  {t("yourWaistHip")}: {Math.round(waistHip * 100) / 100}
                </p>
              </>
            )}
            <TextAreaResult content={texts.waist_result_header} />
            <Markdowntext component="waist" beforeAfter="after" />
          </div>
        )}
        {/* Weight-Related Health Risk (GGR) */}
        {!!ggr && (
          <>
            <div className="mt-10 space-y-4">
              <p className="font-bold">{t("ggr_result_header")}</p>
              <Markdowntext component="ggr" beforeAfter="before" />
              <GgrChartComponent ggr={ggr} />
              <p className="font-bold">
                {t("yourGGR")}: {t(ggr)}
              </p>
              <TextAreaResult content={texts.ggr_result_header} />
              <Markdowntext component="ggr" beforeAfter="after" />
            </div>
          </>
        )}
        {/* ASCVD */}
        {!!ascvd && (
          <>
            <div className="mt-10 space-y-4">
              <p className="font-bold">{t("ascvd_result_header")}</p>
              <Markdowntext component="ascvd" beforeAfter="before" />
              <AscvdChartComponent ascvd={ascvd} />
              <p className="font-bold">
                {t("yourAscvd")}: {Math.round(ascvd * 100) / 100}%
              </p>
              <TextAreaResult content={texts.ascvd_result_header} />
              <Markdowntext component="ascvd" beforeAfter="after" />
            </div>
          </>
        )}
        {/* Diabetes */}
        {!!diabetes && (
          <>
            <div className="mt-10 space-y-4">
              <p className="font-bold">{t("diabetes_result_header")}</p>
              <Markdowntext component="diabetes" beforeAfter="before" />
              <DiabetesChartComponent diabetes={diabetes} />
              <p className="font-bold">
                {t("yourDiabetes")}: {Math.round(diabetes * 100) / 100}%
              </p>
              <TextAreaResult content={texts.diabetes_result_header} />
              <Markdowntext component="diabetes" beforeAfter="after" />
            </div>
          </>
        )}
        <Markdowntext component="overall" beforeAfter="after" />
      </div>
    </>
  );
}
