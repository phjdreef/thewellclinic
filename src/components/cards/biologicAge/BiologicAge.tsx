import { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useTranslation } from "react-i18next";

export function BiologicalAge(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tabBiologicAge")}</CardTitle>
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
  );
}

export default BiologicalAge;
