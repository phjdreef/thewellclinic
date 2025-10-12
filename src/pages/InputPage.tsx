import AscvdInput from "@/components/cards/ascvd/AscvdInput";
import { BmiInput } from "@/components/cards/bmi/BmiInput";
import DiabetesInput from "@/components/cards/diabetes/DiabetesInput";
import { GGRInput } from "@/components/cards/ggr/GGR";
import { NameAge } from "@/components/cards/nameAge/NameAge";
import { TextInput } from "@/components/cards/text/TextInput";
import { WaistHipInput } from "@/components/cards/waistHip/WaistHip";
import { useStore } from "@/hooks/useStore";
import { useTranslation } from "react-i18next";

export default function Input() {
  const { t } = useTranslation();
  const { bmi, waist, hip, gender } = useStore();

  return (
    <div className="h-full">
      <h1 className="mb-2 text-center text-4xl font-bold">
        {t("titleInputPage")}
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-4">
          <NameAge />
          <BmiInput />
          <WaistHipInput />
          <GGRInput />
          <AscvdInput />
          <DiabetesInput />
        </div>
        <div className="col-span-2 space-y-4">
          <TextInput element="overall_result_header" />
          <TextInput element="bmi_result_header" />
          <TextInput element="waist_result_header" />
          <TextInput element="ggr_result_header" />
          <TextInput element="ascvd_result_header" />
          <TextInput element="diabetes_result_header" />
        </div>
      </div>
    </div>
  );
}
