import { OverallResult } from "@/components/resultPage/OverallResult";
import { useTranslation } from "react-i18next";

export default function OutputPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <OverallResult />
    </div>
  );
}
