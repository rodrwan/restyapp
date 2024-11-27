import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/stores/useAuth";
import useUserStore from "@/stores/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";

// Tipos
interface MenuItemProps {
  label: string;
  onPress: () => void | Promise<void>;
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

const MenuItem = ({ label, onPress, className }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className={`mb-8 ${className}`}>
    <Text className="self-center text-white font-bold text-xl">{label}</Text>
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
  const { setAccessToken, logout } = useAuthStore();
  const { setUser, setTickets, setDrinks, setEvents } = useUserStore();

  const handleLogout = async () => {
    setUser(null);
    setTickets([]);
    setDrinks([]);
    setEvents([]);
    logout();
    setAccessToken("");
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    router.replace("/(home)");
  };

  return { handleLogout };
}

const MenuPage = () => {
  const { configureHeader } = useHeaderConfiguration();
  const { handleLogout } = useAuthActions();
  const { auth } = useAuthStore();

  React.useLayoutEffect(() => {
    configureHeader();
  }, []);

  const menuItems: MenuItemProps[] = [
    {
      label: "Eventos",
      onPress: () => router.replace("/"),
    },
    {
      label: "Mis Eventos",
      onPress: () => router.replace("/(dashboard)"),
    },
    {
      label: "Perfil",
      onPress: () => router.replace("/(dashboard)/profile"),
    },
    {
      label: "Terminos y Condiciones",
      onPress: async () => {
        await WebBrowser.openBrowserAsync(TERMS_URL);
      },
      className: "mt-auto pt-4",
    },
  ];

  return (
    <LinearGradient colors={["#04121A", "#092838"]} className="flex-1">
      <SafeAreaView className="flex h-full p-2 justify-between">
        <View className="flex grow flex-col mt-12 border-b border-primary-400 rounded-lg pt-4 mb-8">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>

        {auth.isLogged && (
          <View>
            <LogoutButton onPress={handleLogout} />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MenuPage;
