import { ScrollView, StyleSheet, View } from "react-native";
import { ColorTriad } from "@/components/skia/ColorTriad";
import {
  DrawAsImage,
  DrawOnSurfaceCPU,
  DrawOnSharedSurfaceCPU,
  DrawOnSurfaceOffscreen,
  DrawOnSharedSurfaceOffscreen,
} from "@/components/skia";

import { SafeAreaView } from "react-native-safe-area-context";
import { OptionsBar, OptionsProvider } from "@/components/skia/GlobalOptions";

export default function HomeScreen() {
  return (
    <OptionsProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <OptionsBar />
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            centerContent
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stack}>
              <DrawAsImage>
                <ColorTriad />
              </DrawAsImage>
              <DrawOnSurfaceOffscreen>
                <ColorTriad />
              </DrawOnSurfaceOffscreen>
              <DrawOnSurfaceCPU>
                <ColorTriad />
              </DrawOnSurfaceCPU>
              <DrawOnSharedSurfaceCPU>
                <ColorTriad />
              </DrawOnSharedSurfaceCPU>
              <DrawOnSharedSurfaceOffscreen>
                <ColorTriad />
              </DrawOnSharedSurfaceOffscreen>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </OptionsProvider>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginBottom: 40 },
  stack: {
    flex: 1,
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
