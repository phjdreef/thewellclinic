import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

const FILE_READ_CHANNEL = "file:read";

export function registerFileListeners() {
  ipcMain.handle(FILE_READ_CHANNEL, async (_, filePath: string) => {
    try {
      // In production, resources are in process.resourcesPath/resources/
      // In development, they are in the project root
      const isDev = process.env.NODE_ENV === "development";

      let fullPath: string;
      if (isDev) {
        // Development: use project root
        fullPath = path.join(process.cwd(), filePath);
      } else {
        // Production: use resources path
        fullPath = path.join(process.resourcesPath, filePath);
      }

      // Check if file exists first
      try {
        await fs.promises.access(fullPath, fs.constants.F_OK);
      } catch (accessError) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = await fs.promises.readFile(fullPath, "utf-8");
      return content;
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  });
}

export { FILE_READ_CHANNEL };
