import { JSX } from "react";
import logoImage from "@/assets/well_clinic_logo.png";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  "data-testid"?: string;
}

export function Logo({
  className = "",
  width = 200,
  height = 80,
  alt = "Well Clinic Logo",
  "data-testid": dataTestId,
}: LogoProps): JSX.Element {
  return (
    <div
      className={`flex justify-center ${className}`}
      data-testid={dataTestId}
    >
      <img
        src={logoImage}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        style={{
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
        }}
      />
    </div>
  );
}
