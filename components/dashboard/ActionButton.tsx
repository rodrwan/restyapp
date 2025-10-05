import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface ActionButtonProps {
  icon: any;
  title: string;
  count: number;
  onPress: () => void;
  width: number;
  height: number;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({ icon, title, count, onPress, width, height }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-xl p-4 bg-transparent"
    >
      <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
        <Image source={icon} style={{ width, height }} />
      </View>
      <View className="ml-2">
        <Text className="text-xs text-white">{count} Disponibles</Text>
        <Text className="font-bold text-white">{title}</Text>
      </View>
    </TouchableOpacity>
  )
);

export default ActionButton;
