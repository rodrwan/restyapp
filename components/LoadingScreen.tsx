import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

interface LoadingScreenProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export default function LoadingScreen({
  message = "Cargando...",
  size = "small",
  color = Colors.primary[500],
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary[500],
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontWeight: "500",
  },
});
