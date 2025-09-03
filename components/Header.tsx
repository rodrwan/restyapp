import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import Colors from "@/constants/Colors";
import Logo from "./Logo";

const Header = (props: any) => {
  return (
    <SafeAreaView className="flex bg-[#04121A] h-[110px]">
      <View className="flex flex-row w-full justify-between items-center px-2 h-[48px] border-b border-secondary-700 pb-2">
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

        <TouchableOpacity
          onPress={() => router.push("/menu")}
          className="flex items-center"
        >
          <Ionicons name="menu" size={32} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
