import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import path from "path";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: "well-clinic-app", // Use simple name for executable
    // App icon configuration
    icon: path.resolve(__dirname, "w_icon.icns"),
    // Copy resources folder to the packaged app
    extraResource: ["./resources"],
    // Note: Code signing requires Apple Developer account ($99/year)
    // Uncomment and configure when ready for distribution:
    // osxSign: {
    //   identity: "Developer ID Application: Your Name (TEAM_ID)"
    // }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl:
        "https://raw.githubusercontent.com/phjdreef/thewellclinic/main/resources/images/w_icon.ico",
      setupIcon: "./resources/images/w_icon.ico",
    }),
    new MakerDMG(
      {
        icon: "./resources/images/w_icon.icns",
      },
      ["darwin"],
    ),
    new MakerZIP({}, ["darwin"]),
    new MakerDeb({}, ["linux"]), // Minimal Linux maker for testing
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.mts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
