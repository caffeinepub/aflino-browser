declare module "react-image-crop" {
  import type { CSSProperties, ReactNode } from "react";

  export interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
    unit?: "px" | "%";
    aspect?: number;
  }

  export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
    unit: "px";
  }

  export interface PercentCrop {
    x: number;
    y: number;
    width: number;
    height: number;
    unit: "%";
  }

  export interface ReactCropProps {
    crop?: Crop;
    onChange?: (crop: PixelCrop, percentCrop: PercentCrop) => void;
    onComplete?: (crop: PixelCrop, percentCrop: PercentCrop) => void;
    aspect?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    keepSelection?: boolean;
    disabled?: boolean;
    locked?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    circularCrop?: boolean;
    ruleOfThirds?: boolean;
  }

  export function makeAspectCrop(
    crop: Partial<Crop>,
    aspect: number,
    mediaWidth: number,
    mediaHeight: number,
  ): PercentCrop;

  export function centerCrop(
    crop: Partial<Crop>,
    containerWidth: number,
    containerHeight: number,
  ): PercentCrop;

  export function convertToPixelCrop(
    crop: Partial<Crop>,
    containerWidth: number,
    containerHeight: number,
  ): PixelCrop;

  const ReactCrop: React.FC<ReactCropProps>;
  export default ReactCrop;

  // CSS import side-effect
}
