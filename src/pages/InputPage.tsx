import AscvdInput from "@/components/cards/ascvd/AscvdInput";
import MeasureInput from "@/components/cards/measures/MeasureInput";
import DiabetesInput from "@/components/cards/diabetes/DiabetesInput";
import { NameAge } from "@/components/cards/nameAge/NameAge";
import { TextInput } from "@/components/cards/text/TextInput";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        <Tabs defaultValue="account">
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
            <div className="space-y-4">
              <NameAge />
            </div>
          </TabsContent>
          <TabsContent value="measures">
            <div className="space-y-4">
              <MeasureInput />
            </div>
          </TabsContent>
          <TabsContent value="biologicAge">
            <Card>
              <CardHeader>
                <CardTitle>{t("biologicalAge")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <a
                    href="https://andrewsteele.co.uk/biological-age/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Berekening: (obv Levine et al 2018)
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="diabetes">
            <div className="space-y-4">
              <DiabetesInput />
            </div>
          </TabsContent>
          <TabsContent value="additionalTexts">
            <div className="space-y-4">
              <TextInput element="overall_result_header" />
              <TextInput element="bmi_result_header" />
              <TextInput element="waist_result_header" />
              <TextInput element="ggr_result_header" />
              <TextInput element="ascvd_result_header" />
              <TextInput element="diabetes_result_header" />
            </div>
          </TabsContent>
        </Tabs>
        {/* 
        <div className="space-y-4">
          <AscvdInput />
          <DiabetesInput />
        </div> */}
      </div>
    </div>
  );
}
