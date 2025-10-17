"use client";

import { Markdowntext } from "@/components/template/MardownText";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import "@/styles/markdown.css"; // Ensure you have styles for markdown
import { JSX, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { BMIChartComponent } from "../charts/BMIChart";
import { WaistChartComponent } from "../charts/WaistChart";
import TextAreaResult from "../template/TextArea";
import { GgrChartComponent } from "../charts/GGRChart";
import { Score2ChartComponent } from "../charts/Score2Chart";
import { DiabetesChartComponent } from "../charts/DiabetesChart";
import { BiologicAgeChartComponent } from "../charts/BiologicAgeChart";
import { Logo } from "../ui/Logo";

export function OverallResult(): JSX.Element {
  const {
    bmi,
    bmiCategory,
    name,
    age,
    score2,
    diabetesPoints: diabetes,
    gender,
    waist,
    ggr,
    height,
    weight,
    texts,
    biologicAge,
  } = useStore();
  const { t } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    pageStyle: `@media print {
      @page {
        margin: 10 10 10 10 !important;
      }
      .logo-print,
      .print-preserve-colors,
      .print-preserve-colors * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      /* Preserve colors for all chart elements */
      .bg-cyan-800,
      .bg-red-900,
      .bg-green-900,
      .bg-slate-500,
      .text-white,
      .text-gray-700,
      .text-black,
      [class*="bg-"],
      [class*="text-"] {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      /* Ensure chart containers preserve colors */
      div[class*="bg-"] {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }`,
    contentRef,
  });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={reactToPrintFn} data-testid="print-button">
          Print
        </Button>
      </div>

      <div
        id="overall-result"
        data-testid="overall-results"
        ref={contentRef}
        className="p-4 pt-8"
      >
        <Logo
          className="logo-print mb-6"
          width={250}
          height={100}
          data-testid="well-clinic-logo"
        />
        <h1
          className="mb-10 text-center text-4xl font-bold"
          data-testid="overall-result-header"
        >
          {t("overall_result_header")}
        </h1>
        {name && name.length > 0 && (
          <p data-testid="patient-name">
            {t("name")}: <span className="font-semibold">{name}</span>
          </p>
        )}
        {age && age > 0 && (
          <p data-testid="patient-age">
            {t("age")}:{" "}
            <span className="font-semibold">
              {age} {t("year")}
            </span>
          </p>
        )}
        {gender && gender.length > 0 && (
          <p data-testid="patient-gender">
            {t("gender")}: <span className="font-bold">{t(gender)}</span>
          </p>
        )}
        <p>
          {t("date")}:{" "}
          <span className="font-semibold">
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
          <div
            className="print-preserve-colors mt-10 space-y-4"
            data-testid="bmi-chart bmi-section"
          >
            <p className="font-bold">{t("bmi_result_header")}</p>
            <Markdowntext component="bmi" beforeAfter="before" />
            <BMIChartComponent />
            <TextAreaResult content={texts.bmi_result_header} />
            <Markdowntext component="bmi" beforeAfter="after" />
          </div>
        )}
        {/* waist and hip */}
        {!!waist && waist > 0 && (
          <div className="print-preserve-colors mt-10 space-y-4">
            <p className="font-bold">{t("waist_result_header")}</p>
            <Markdowntext component="waist" beforeAfter="before" />
            <WaistChartComponent />
            <TextAreaResult content={texts.waist_result_header} />
            <Markdowntext component="waist" beforeAfter="after" />
          </div>
        )}
        {/* Weight-Related Health Risk (GGR) */}
        {!!ggr && (
          <>
            <div className="print-preserve-colors mt-10 space-y-4">
              <p className="font-bold">{t("ggr_result_header")}</p>
              <Markdowntext component="ggr" beforeAfter="before" />
              <GgrChartComponent />
              <TextAreaResult content={texts.ggr_result_header} />
              <Markdowntext component="ggr" beforeAfter="after" />
            </div>
          </>
        )}
        {/* Biological Age */}
        {!!biologicAge && (
          <>
            <div
              className="print-preserve-colors mt-10 space-y-4"
              data-testid="biological-age-chart biological-age-box"
            >
              <p className="font-bold">{t("biologicAge_result_header")}</p>
              <Markdowntext component="biologicage" beforeAfter="before" />
              <BiologicAgeChartComponent />
              <TextAreaResult content={texts.biologicAge_result_header} />
              <Markdowntext component="biologicage" beforeAfter="after" />
            </div>
          </>
        )}
        {/* score2 */}
        {!!score2 && (
          <>
            <div
              className="print-preserve-colors mt-10 space-y-4"
              data-testid="score2-result score2-section"
            >
              <div data-testid="score2-chart">
                <p className="font-bold">{t("score2_result_header")}</p>
                <Markdowntext component="score2" beforeAfter="before" />
                <Score2ChartComponent />
                <TextAreaResult content={texts.score2_result_header} />
                <Markdowntext component="score2" beforeAfter="after" />
              </div>
            </div>
          </>
        )}
        {/* Diabetes */}
        {!!diabetes && (
          <>
            <div
              className="print-preserve-colors mt-10 space-y-4"
              data-testid="diabetes-result"
            >
              <div data-testid="diabetes-chart">
                <p className="font-bold">{t("diabetes_result_header")}</p>
                <Markdowntext component="diabetes" beforeAfter="before" />
                <DiabetesChartComponent />
                <TextAreaResult content={texts.diabetes_result_header} />
                <Markdowntext component="diabetes" beforeAfter="after" />
              </div>
            </div>
          </>
        )}
        <Markdowntext component="overall" beforeAfter="after" />
      </div>
    </>
  );
}
