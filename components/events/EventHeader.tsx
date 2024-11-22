import { TouchableOpacity, Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

interface EventHeaderProps {
  clearCart: () => void;
}

export function EventHeader({ clearCart }: EventHeaderProps) {
  if (Platform.OS !== "ios") {
    return <View className="flex flex-row justify-center items-center p-2" />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        clearCart();
        router.replace("/");
      }}
      className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
    >
      <Ionicons
        name="chevron-back-outline"
        size={20}
        color={Colors.primary[500]}
      />
    </TouchableOpacity>
  );
}
