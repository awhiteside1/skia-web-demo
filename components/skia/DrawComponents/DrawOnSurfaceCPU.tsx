import { Image, SkCanvas, Skia, SkImage } from "@shopify/react-native-skia";
import { PropsWithChildren, useEffect } from "react";
import { runOnUI, SharedValue } from "react-native-reanimated";
import { SyncedCanvas } from "@/components/skia/GlobalOptions";

import {
  Container,
  useRotationEffect,
  useImage,
  useOriginal,
  drawOnSurface,
} from "../utils";
interface SurfaceDrawer {
  target: SharedValue<SkImage | null>;
  source: SkImage;
  modifier?: (canvas: SkCanvas) => void;
}
const draw = ({ modifier, target, source }: SurfaceDrawer) => {
  "worklet";
  const surface = Skia.Surface.Make(256, 256);
  drawOnSurface({
    modifier,
    target,
    source,
    surface,
    method: "CPU (on UI Thread)",
  });
  surface?.dispose();
};

export const DrawOnSurfaceCPU = ({ children }: PropsWithChildren) => {
  const [image, imageRect] = useImage();
  const original = useOriginal(children);
  useEffect(() => {
    runOnUI(draw)({
      target: image,
      source: original,
    });
  }, [children]);

  useRotationEffect((modifier) => {
    "worklet";
    draw({
      target: image,
      source: original,
      modifier,
    });
  });

  return (
    <Container title="Surfaces.Make()" numeral={3}>
      <SyncedCanvas>
        <Image image={image} rect={imageRect} />
      </SyncedCanvas>
    </Container>
  );
};
