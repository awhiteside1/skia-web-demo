import {
  Image,
  SkCanvas,
  Skia,
  SkImage,
  SkSurface,
} from "@shopify/react-native-skia";
import { PropsWithChildren, useEffect } from "react";
import { runOnUI, SharedValue } from "react-native-reanimated";
import { SyncedCanvas } from "@/components/skia/GlobalOptions";

import {
  Container,
  drawOnSurface,
  useImage,
  useOriginal,
  useRotationEffect,
  useSurface,
} from "../utils";

interface SurfaceDrawer {
  target: SharedValue<SkImage | null>;
  source: SkImage;
  surfaceRef: SharedValue<SkSurface | null>;
  modifier?: (canvas: SkCanvas) => void;
}
const draw = ({ modifier, target, source, surfaceRef }: SurfaceDrawer) => {
  "worklet";
  drawOnSurface({
    modifier,
    target,
    source,
    surface: surfaceRef.value,
    method: "shared surface on CPU (on UI Thread)",
  });
};

export const DrawOnSharedSurfaceCPU = ({ children }: PropsWithChildren) => {
  const [image, imageRect] = useImage();
  const original = useOriginal(children);
  const surface = useSurface((ref) => {
    ref.set(Skia.Surface.Make(256, 256));
  });
  useEffect(() => {
    runOnUI(draw)({
      target: image,
      source: original,
      surfaceRef: surface,
    });
  }, [children]);

  useRotationEffect((modifier) => {
    "worklet";
    draw({
      target: image,
      source: original,
      surfaceRef: surface,
      modifier,
    });
  });

  return (
    <Container title="SharedSurface via Make()" numeral={4}>
      <SyncedCanvas>
        <Image image={image} rect={imageRect} />
      </SyncedCanvas>
    </Container>
  );
};
