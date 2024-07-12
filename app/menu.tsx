import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/stores/useAuth";
import useUserStore from "@/stores/useUser";

const MenuPage = () => {
  const navigation = useNavigation();
  const { setAccessToken, logout, auth } = useAuthStore();
  const { setUser } = useUserStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Menu",
      headerTintColor: Colors.primary[500],
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 p-2 justify-between">
      <View className="flex flex-col gap-10 mt-12">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="self-center text-white font-bold text-xl">
            Eventos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(dashboard)")}>
          <Text className="self-center text-white font-bold text-xl">
            Mi Cuenta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(dashboard)/tickets")}>
          <Text className="self-center text-white font-bold text-xl">
            Mis Tickets
          </Text>
        </TouchableOpacity>
      </View>
      {auth.isLogged && (
        <View>
          <TouchableOpacity
            onPress={() => {
              setUser(null);
              logout();
              setAccessToken("");
              router.replace("/");
            }}
          >
            <Text className="self-center text-white font-base text-base">
              Cerrar session
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MenuPage;
