import { StyleSheet, Text, View } from "react-native";
import { PropsWithChildren } from "react";

export const Container = ({
  children,
  title,
  numeral,
  notice,
}: PropsWithChildren<{ title: string; numeral: number; notice?: string }>) => {
  return (
    <View style={styles.container}>
      <View style={styles.numeralContainer}>
        <Text style={styles.numeral}>{numeral}</Text>
      </View>
      {children}
      <Text style={styles.title}>{title}</Text>
      {notice && <Text style={styles.notice}>{notice}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  notice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#cc5500",
    textAlign: "center",
    width: "100%",
  },
  numeral: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    width: "100%",
  },
  numeralContainer: {
    backgroundColor: "black",
    width: 30,
    height: 30,
    position: "absolute",
    justifyContent: "center",
    top: 0,
    left: 0,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 1,
    position: "relative",
    flexDirection: "column",
    gap: 10,
    padding: 10,
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "grey",
  },
  title: {
    flexWrap: "wrap",
    flexShrink: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
