import {
  Image,
  ImageFormat,
  SkCanvas,
  Skia,
  SkImage,
} from "@shopify/react-native-skia";
import { PropsWithChildren, useEffect } from "react";
import { runOnUI, SharedValue } from "react-native-reanimated";
import {
  Container,
  drawOnSurface,
  useImage,
  useOriginal,
  useRotationEffect,
} from "../utils";

import { SyncedCanvas } from "@/components/skia/GlobalOptions";
import { Button } from "react-native";

interface SurfaceDrawer {
  target: SharedValue<SkImage | null>;
  source: SkImage;
  modifier?: (canvas: SkCanvas) => void;
}
const draw = ({ modifier, target, source }: SurfaceDrawer) => {
  "worklet";
  const surface = Skia.Surface.MakeOffscreen(256, 256);
  drawOnSurface({
    modifier,
    target,
    source,
    surface,
    method: "MakeOffscreen",
  });
  surface?.dispose();
};

export const DrawOnSurfaceOffscreen = ({ children }: PropsWithChildren) => {
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
    <Container title="MakeOffscreen()" numeral={2} notice="Broken on Web">
      <SyncedCanvas>
        <Image image={image} rect={imageRect} />
      </SyncedCanvas>
      <Button
        onPress={() => {
          const pixels = image.get()?.makeNonTextureImage().readPixels();
          const base = image.value?.encodeToBase64(ImageFormat.PNG);
          console.log(base?.substring(0, 100));
        }}
        title="Log"
      ></Button>
    </Container>
  );
};
