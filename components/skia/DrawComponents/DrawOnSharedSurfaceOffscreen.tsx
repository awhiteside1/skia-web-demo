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
  useSurface,
  useImage,
  useOriginal,
  useRotationEffect,
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
    method: "shared surface offscreen",
  });
};

export const DrawOnSharedSurfaceOffscreen = ({
  children,
}: PropsWithChildren) => {
  const [image, imageRect] = useImage();
  const original = useOriginal(children);
  const surface = useSurface((ref) => {
    "worklet";
    const surface = Skia.Surface.MakeOffscreen(256, 256);
    if (!surface) throw new Error("Could not create offscreen surface");
    ref.set(surface);
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
    <Container
      title="SharedSurface via MakeOffscreen()"
      numeral={5}
      notice="Broken on web"
    >
      <SyncedCanvas>
        <Image image={image} rect={imageRect} />
      </SyncedCanvas>
    </Container>
  );
};
