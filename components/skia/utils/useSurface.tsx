import {
  isWorkletFunction,
  runOnUI,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { SkSurface } from "@shopify/react-native-skia";
import { useEffect } from "react";

export const useSurface = (
  factory: (surface: SharedValue<SkSurface | null>) => void,
) => {
  const surface = useSharedValue<SkSurface | null>(null);
  useEffect(() => {
    if (isWorkletFunction(factory)) {
      runOnUI(factory)(surface);
    } else {
      factory(surface);
    }
    return () => {
      surface.value?.dispose();
    };
  }, []);
  return surface;
};
