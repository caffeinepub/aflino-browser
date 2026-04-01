declare module "tesseract.js" {
  export function createWorker(
    lang?: string,
    oem?: number,
    options?: Record<string, unknown>,
  ): Promise<Worker>;
  export interface Worker {
    recognize(
      image:
        | string
        | File
        | Blob
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement,
    ): Promise<{ data: { text: string } }>;
    terminate(): Promise<void>;
    loadLanguage(lang: string): Promise<void>;
    initialize(lang: string): Promise<void>;
  }
  const Tesseract: { createWorker: typeof createWorker };
  export default Tesseract;
}
