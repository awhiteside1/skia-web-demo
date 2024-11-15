import { ReactNode, useMemo } from "react";
import { drawAsImage } from "@shopify/react-native-skia";

export const useOriginal = (children: ReactNode) => {
  return useMemo(
    () => drawAsImage(<>{children}</>, { width: 256, height: 256 }),
    [children],
  );
};
