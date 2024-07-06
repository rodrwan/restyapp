import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import Logo from "./Logo";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Header = (props: any) => {
  return (
    <SafeAreaView className="flex bg-secondary-500 border-b border-secondary-700 h-[110px]">
      <View className="flex flex-row w-full items-center justify-between px-2">
        {!props?.navigation ? (
          <View className="ml-2">
            <Logo width={150} height={40} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => props?.navigation?.goBack()}
            className="flex flex-row items-center"
          >
            <Ionicons
              name="chevron-back-outline"
              size={32}
              color={Colors.primary[500]}
            />
            <Text className="text-white font-bold text-base">Volver</Text>
          </TouchableOpacity>
        )}

        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/menu")}>
            <Ionicons name="menu" size={32} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
