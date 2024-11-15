import { drawAsImage, Image, ImageProps } from "@shopify/react-native-skia";
import { PropsWithChildren, useEffect } from "react";
import { Container } from "@/components/skia/utils/Container";
import { useImage } from "@/components/skia/utils/useImage";
import { SyncedCanvas, useExperiment } from "@/components/skia/GlobalOptions";

const experimentProps = {
  none: {},
  rotate: { origin: { x: 128, y: 128 }, transform: [{ rotateZ: 90 }] },
  animate: {},
} satisfies Record<string, Partial<ImageProps>>;

export const DrawAsImage = ({ children }: PropsWithChildren) => {
  const [image, imageRect] = useImage();
  useEffect(() => {
    image.set(drawAsImage(<>{children}</>, { width: 256, height: 256 }));
  }, [children]);

  const experiment = useExperiment();

  return (
    <Container title="drawAsImage()" numeral={1} notice="Rotation causes clip">
      <SyncedCanvas>
        <Image
          {...experimentProps[experiment]}
          image={image}
          rect={imageRect}
        />
      </SyncedCanvas>
    </Container>
  );
};
