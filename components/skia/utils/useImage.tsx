import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { SkImage } from "@shopify/react-native-skia";

export const useImage = () => {
  const image = useSharedValue<SkImage | null>(null);

  const imageRect = useDerivedValue(() => {
    return {
      x: 0,
      y: 0,
      width: image.value?.width() ?? 0,
      height: image.value?.height() ?? 0,
    };
  });

  return [image, imageRect] as const;
};
