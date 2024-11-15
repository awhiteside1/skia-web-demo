import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Canvas, CanvasProps, Group } from "@shopify/react-native-skia";
import {
  Button,
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

interface Value {
  canvas: Partial<CanvasProps>;
  experiment: "none" | "animate" | "rotate";
  shrink: boolean;
}

const GlobalOptionsContext = createContext<
  [Value, Dispatch<SetStateAction<Value>>]
>([{ shrink: false, canvas: {}, experiment: "none" }, (_) => {}]);

export const useOptions = () => {
  return useContext(GlobalOptionsContext);
};

export const useExperiment = () => {
  const [options] = useContext(GlobalOptionsContext);
  return useMemo(() => options.experiment, [options.experiment]);
};

export const OptionsProvider = ({ children }: PropsWithChildren) => {
  const state = useState<Value>({
    canvas: {},
    experiment: "none",
    shrink: false,
  });
  return (
    <GlobalOptionsContext.Provider value={state}>
      {children}
    </GlobalOptionsContext.Provider>
  );
};

export const OptionsBar = () => {
  const [options, setOptions] = useOptions();
  return (
    <View style={styles.bar}>
      <View style={styles.group}>
        <Text style={{ fontWeight: "bold" }}>Canvas Mode</Text>
        <Text>Default</Text>
        <Switch
          value={options.canvas.mode === "continuous"}
          onValueChange={(value) => {
            setOptions((prev) => {
              prev.canvas.mode = value ? "continuous" : "default";
              return { ...prev };
            });
          }}
        />
        <Text>Continuous</Text>
      </View>
      <View style={styles.group}>
        <Text style={{ fontWeight: "bold" }}>Size</Text>
        <Text>Original</Text>
        <Switch
          value={options.shrink}
          onValueChange={(value) => {
            setOptions((prev) => {
              return { ...prev, shrink: value };
            });
          }}
        />
        <Text>Shrink</Text>
      </View>
      <View style={styles.group}>
        <Text style={{ fontWeight: "bold" }}>Experiment</Text>
        <Button
          title="None"
          color={options.experiment === "none" ? "green" : "grey"}
          onPress={() => {
            setOptions((prev) => ({ ...prev, experiment: "none" }));
          }}
        />
        <Button
          title="Rotate"
          color={options.experiment === "rotate" ? "green" : "grey"}
          onPress={() => {
            setOptions((prev) => ({ ...prev, experiment: "rotate" }));
          }}
        />
        <Button
          title="Animate"
          disabled
          onPress={() => {
            setOptions((prev) => ({ ...prev, experiment: "animate" }));
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    padding: 8,
    borderBottomWidth: 2,
    borderStyle: "solid",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  group: {
    minHeight: 20,
    padding: 4,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});

const BASE_SIZE = 256;
export const SyncedCanvas = ({ children }: PropsWithChildren) => {
  const [options] = useOptions();
  const size = options.shrink ? BASE_SIZE / 2 : BASE_SIZE;

  return (
    <Canvas {...options.canvas} style={{ width: size, height: size }}>
      <Group transform={[{ scale: size / BASE_SIZE }]}>{children}</Group>
    </Canvas>
  );
};

export const useRotation = () => {
  const rotation = useSharedValue<number | null>(null);

  const experiment = useExperiment();

  useEffect(() => {
    switch (experiment) {
      case "rotate":
        rotation.set(90);
        break;
      case "none":
        rotation.set(null);
        break;
    }
  }, [experiment]);

  return rotation;
};
