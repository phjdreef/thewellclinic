"use client";

import { useStore } from "@/hooks/useStore";
import { useTranslation } from "react-i18next";

export const BiologicAgeChartComponent = () => {
  const { t } = useTranslation();
  const { age, biologicAge } = useStore();

  if (biologicAge === undefined || age === undefined) {
    return null;
  }

  // Determine colors based on comparison
  const getAgeColors = () => {
    if (!age || !biologicAge)
      return { chronological: "bg-slate-500", biological: "bg-slate-500" };

    if (biologicAge > age) {
      // Biological age is higher (aging faster) - red for biological, blue for chronological
      return { chronological: "bg-cyan-800", biological: "bg-red-900" };
    } else if (biologicAge < age) {
      // Biological age is lower (aging slower) - green for biological, blue for chronological
      return { chronological: "bg-cyan-800", biological: "bg-green-900" };
    } else {
      // Equal ages - both blue
      return { chronological: "bg-cyan-800", biological: "bg-cyan-800" };
    }
  };

  const colors = getAgeColors();

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">
        {t("biologicalAgeChartTitle")}
      </h3>

      {/* Age Comparison Rectangles */}
      {age && biologicAge && (
        <div className="mb-6 flex justify-center gap-4">
          {/* Chronological Age Rectangle */}
          <div className="text-center">
            <div
              className={`w-[180px] rounded-lg ${colors.chronological} p-6 text-white`}
            >
              <div className="text-3xl font-bold">{age}</div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {t("chronologicalAge")}
            </div>
          </div>

          {/* Biological Age Rectangle */}
          <div className="text-center">
            <div
              className={`w-[180px] rounded-lg ${colors.biological} p-6 text-white`}
            >
              <div className="text-3xl font-bold">{biologicAge}</div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {t("biologicalAge")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
