declare var require: {
  <T>(path: string): {[key: string]: T};
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require?: <T>(path: string) => {[key: string]: T}) => void, errorCallback: (error?) => void, chunkName?: string) => void;
};

declare var __webpack_public_path__: string;
