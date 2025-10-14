import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span>
          <h1 className="text-center font-mono text-4xl font-bold">
            {t("wellClinic")}
          </h1>
          <h1 className="text-center font-mono text-4xl font-bold">
            {t("appName")}
          </h1>
        </span>
        <LangToggle />
        <ToggleTheme />
      </div>
    </div>
  );
}
