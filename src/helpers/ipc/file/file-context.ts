import { contextBridge, ipcRenderer } from "electron";
import { FILE_READ_CHANNEL } from "./file-listeners";

export function exposeFileContext() {
  contextBridge.exposeInMainWorld("fileAPI", {
    readFile: (filePath: string) =>
      ipcRenderer.invoke(FILE_READ_CHANNEL, filePath),
  });
}
