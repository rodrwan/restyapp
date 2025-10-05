import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const EmptyEventsState: React.FC = React.memo(() => {
  const handleGoToEvents = () => {
    router.push("/(home)");
  };

  return (
    <View className="h-full mx-2 my-4 justify-start items-center">
      <View className="bg-white rounded-xl mx-2 mb-4 p-6 w-full">
        <View className="flex items-center justify-center py-4">
          <Ionicons
            name="calendar-outline"
            size={48}
            color={Colors.primary[500]}
            style={{ marginBottom: 16 }}
          />
          <Text className="text-gray-800 font-bold text-xl text-center mb-2">
            Aún no tienes eventos
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Explora los eventos disponibles y encuentra tu próxima experiencia
          </Text>
          <TouchableOpacity
            onPress={handleGoToEvents}
            className="bg-primary-500 rounded-lg px-6 py-3 flex-row items-center"
          >
            <Ionicons
              name="search"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-base">
              Ver Eventos Disponibles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default EmptyEventsState;
