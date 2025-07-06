import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface ActionButtonProps {
  icon: any;
  title: string;
  count: number;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({ icon, title, count, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex bg-white rounded-xl grow p-4 justify-between"
    >
      <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
        <Image source={icon} style={{ width: 50, height: 50 }} />
      </View>
      <View className="ml-2">
        <Text className="text-xs text-secondary-300">{count} Disponibles</Text>
        <Text className="font-bold">{title}</Text>
      </View>
    </TouchableOpacity>
  )
);

export default ActionButton;
