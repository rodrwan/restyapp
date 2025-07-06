import React from "react";
import { View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LoadingScreen: React.FC = () => (
  <LinearGradient colors={["#04121A", "#092838"]} className="flex h-full">
    <View className="h-full items-center justify-center">
      <ActivityIndicator size="small" color="#ffffff" />
    </View>
  </LinearGradient>
);

export default LoadingScreen;
