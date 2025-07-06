import React from "react";
import { View, Text } from "react-native";

const EmptyEventsState: React.FC = React.memo(() => (
  <View className="h-full mx-2 my-4 justify-start items-center">
    <Text className="text-white font-bold text-xl mx-2">
      Aún no tienes eventos
    </Text>
  </View>
));

export default EmptyEventsState;
