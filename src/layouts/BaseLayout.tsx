import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/template/NavigationMenu";
import Footer from "@/components/template/Footer";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DragWindowRegion />
      <NavigationMenu />
      <main className="h-dvh-minus-23 overflow-auto p-2">{children}</main>
      <Footer />
    </>
  );
}
