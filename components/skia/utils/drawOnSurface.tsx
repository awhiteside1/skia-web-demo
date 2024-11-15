import { SkCanvas, Skia, SkImage, SkSurface } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

interface SurfaceDrawer {
  target: SharedValue<SkImage | null>;
  source: SkImage;
  surface: SkSurface | null;
  modifier?: (canvas: SkCanvas) => void;
  method: string;
}
export const drawOnSurface = ({
  modifier,
  target,
  source,
  surface,
  method,
}: SurfaceDrawer) => {
  "worklet";
  const canvas = surface?.getCanvas();
  if (!canvas) throw new Error("Could not instantiate canvas/surface");
  canvas.clear(Skia.Color("transparent"));
  canvas.save();
  if (modifier) modifier(canvas);
  canvas.drawImage(source, 0, 0);
  canvas.restore();
  const newImage = surface?.makeImageSnapshot();
  if (!newImage) throw new Error("Could not save image");
  target.set(newImage);
  console.log(` ✅ Created Image using ${method}`);
};
