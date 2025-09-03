import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "@/context/AuthProvider";

// Tipos
interface MenuItemProps {
  label: string;
  onPress: () => void | Promise<void>;
  icon?: React.ReactNode;
  className?: string;
}

// Constantes
const TERMS_URL =
  "https://mangoticket-legal.nyc3.cdn.digitaloceanspaces.com/1.%20TERMINOS%20Y%20CONDICIONES%20(1).pdf";

// Componentes
const HeaderIcon = ({
  name,
  onPress,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
  >
    <Ionicons name={name} size={20} color={Colors.primary[500]} />
  </TouchableOpacity>
);

const MenuItem = ({ label, onPress, className, icon }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex flex-col items-center p-2 ${className}`}
  >
    <View className="flex flex-col items-center">
      <View>{icon && icon}</View>
      <Text className="text-white font-bold text-xl">{label}</Text>
    </View>
  </TouchableOpacity>
);

const LogoutButton = ({ onPress }: { onPress: () => Promise<void> }) => (
  <TouchableOpacity onPress={onPress}>
    <Text className="self-center text-white font-base text-base">
      Cerrar session
    </Text>
  </TouchableOpacity>
);

// Hooks
function useHeaderConfiguration() {
  const navigation = useNavigation<any>();

  const configureHeader = () => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Menu",
      headerTintColor: Colors.primary[500],
      headerLeft: () => (
        <HeaderIcon name="chevron-back-outline" onPress={navigation?.goBack} />
      ),
      headerRight: () => (
        <HeaderIcon name="close-outline" onPress={navigation?.goBack} />
      ),
    });
  };

  return { configureHeader };
}

function useAuthActions() {
  const { signOut } = useSession();

  const handleLogout = async () => {
    signOut();
  };

  return { handleLogout };
}

const MenuPage = () => {
  const { configureHeader } = useHeaderConfiguration();
  const { handleLogout } = useAuthActions();
  const { session } = useSession();
  React.useLayoutEffect(() => {
    configureHeader();
  }, []);

  const menuItems: MenuItemProps[] = [
    {
      label: "Eventos",
      icon: (
        <Ionicons
          name="location-outline"
          size={32}
          color={Colors.primary[500]}
        />
      ),
      onPress: () => router.replace("/"),
    },
    {
      label: "Mis eventos",
      icon: (
        <Ionicons
          name="calendar-outline"
          size={32}
          color={Colors.primary[500]}
        />
      ),
      onPress: () => router.replace("/(dashboard)"),
    },
    {
      label: "Mi cuenta",
      icon: (
        <Ionicons name="person-outline" size={32} color={Colors.primary[500]} />
      ),
      onPress: () => router.replace("/(dashboard)/profile"),
    },
  ];

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      <SafeAreaView className="flex h-full p-2 justify-between">
        <View className="flex flex-col items-center justify-center mt-10 rounded-lg border border-primary-100">
          {/* hero */}
          <Image
            source={require("../assets/images/hero.png")}
            className={`w-full h-48  ${
              session ? "rounded-lg" : "rounded-t-lg"
            }`}
            resizeMode="cover"
          />

          {!session && (
            <View className="p-4 items-center justify-center w-full rounded-b-lg">
              <Text className="text-white text-center text-base">
                Inicia sesión para ver tus eventos
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(dashboard)/profile")}
                className="bg-primary-400 rounded-lg p-2 mt-4 w-full"
              >
                <Text className="text-white text-center text-lg font-bold">
                  Iniciar sesión
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex grow flex-col mt-4 border-b border-primary-400 rounded-lg pt-4 mb-8">
          {session && (
            <View className="flex flex-row justify-between">
              {menuItems?.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={async () => {
              await WebBrowser.openBrowserAsync(TERMS_URL);
            }}
            className={`flex flex-col items-center p-2 mb-4 mt-auto pt-4 justify-center items-center`}
          >
            <View className="flex flex-col items-center">
              <Text className="ml-4 self-center text-white font-bold text-xl">
                Terminos y Condiciones
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {session && (
          <View>
            <LogoutButton onPress={handleLogout} />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MenuPage;
