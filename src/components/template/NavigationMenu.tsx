import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export default function NavigationMenu() {
  const { t } = useTranslation();

  return (
    <NavigationMenuBase className="text-muted-foreground px-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            {t("titleHomePage")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/input" className={navigationMenuTriggerStyle()}>
            {t("titleInputPage")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/output" className={navigationMenuTriggerStyle()}>
            {t("titleOutputPage")}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuBase>
  );
}
