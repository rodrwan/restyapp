import { View, Text, Pressable, StyleSheet } from "react-native";

const RadioButton = ({ value, label, description, selected }: any) => {
  return (
    <View style={styles.wrap}>
      <Dot selected={selected} />
      <View>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
};

// Componente Dot
const Dot = ({ selected }: any) => {
  return (
    <View style={styles.radio}>
      <View
        style={{
          ...styles.dot,
          backgroundColor: selected ? "#52B86D" : "transparent",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#52B86D",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 20,
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "#EEE",
  },
});

export default RadioButton;
