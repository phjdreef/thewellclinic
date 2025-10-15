import { BasicInput } from "@/components/cards/basic/Basic";
import MeasureInput from "@/components/cards/basic/MeasureInput";
import BiologicalAge from "@/components/cards/biologicAge/BiologicAge";
import DiabetesInput from "@/components/cards/diabetes/DiabetesInput";
import { TextInput } from "@/components/cards/text/TextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/hooks/useStore";
import { useTranslation } from "react-i18next";

export default function Input() {
  const { t } = useTranslation();
  const { bmi, waist, gender } = useStore();

  return (
    <div className="h-full">
      <h1 className="mb-2 text-center text-4xl font-bold">
        {t("titleInputPage")}
      </h1>
      <div>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">{t("tabBasic")}</TabsTrigger>
            <TabsTrigger value="measures">{t("tabMeasures")}</TabsTrigger>
            <TabsTrigger value="biologicAge">{t("tabBiologicAge")}</TabsTrigger>
            <TabsTrigger value="diabetes">{t("tabDiabetes")}</TabsTrigger>
            <TabsTrigger value="additionalTexts">
              {t("tabAdditionalTexts")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <BasicInput />
            </div>
          </TabsContent>
          <TabsContent value="measures">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <MeasureInput />
            </div>
          </TabsContent>
          <TabsContent value="biologicAge">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <BiologicalAge />
            </div>
          </TabsContent>
          <TabsContent value="diabetes">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <DiabetesInput />
            </div>
          </TabsContent>
          <TabsContent value="additionalTexts">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <TextInput element="overall_result_header" />
              <TextInput element="bmi_result_header" />
              <TextInput element="waist_result_header" />
              <TextInput element="ggr_result_header" />
              <TextInput element="biologicAge_result_header" />
              <TextInput element="score2_result_header" />
              <TextInput element="diabetes_result_header" />
            </div>
          </TabsContent>
        </Tabs>
        {/* 
        <div className="space-y-4">
          <score2Input />
          <DiabetesInput />
        </div> */}
      </div>
    </div>
  );
}
