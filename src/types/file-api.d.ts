declare global {
  interface Window {
    fileAPI: {
      readFile: (filePath: string) => Promise<string>;
    };
  }
}

export {};
