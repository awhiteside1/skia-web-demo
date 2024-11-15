import { SkCanvas } from "@shopify/react-native-skia";
import { useRotation } from "@/components/skia/GlobalOptions";
import {
  isWorkletFunction,
  runOnUI,
  useAnimatedReaction,
} from "react-native-reanimated";

export const useRotationEffect = (
  update: (modifier?: (canvas: SkCanvas) => void) => void,
) => {
  const rotation = useRotation();

  useAnimatedReaction(
    () => {
      return rotation.value;
    },
    (current, prev) => {
      if (current === prev) return;
      if (isWorkletFunction(update)) {
        runOnUI(update)(
          current
            ? (canvas: SkCanvas) => {
                canvas.rotate(current, 128, 128);
              }
            : undefined,
        );
      } else {
        update(
          current
            ? (canvas: SkCanvas) => {
                canvas.rotate(current, 128, 128);
              }
            : undefined,
        );
      }
    },
  );
};
