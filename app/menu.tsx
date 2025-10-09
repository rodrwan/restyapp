import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthProvider";
import { useSession as useSessionStore } from "@/stores/useSession";
import { TERMS_URL } from "@/constants";

// Tipos
interface MenuItemProps {
  label: string;
  onPress: () => void | Promise<void>;
  icon?: React.ReactNode;
  className?: string;
}

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

const LogoutButton = ({
  session,
  onPress,
}: {
  session: string | null | undefined;
  onPress: () => Promise<void>;
}) => {
  return session ? (
    <TouchableOpacity onPress={onPress}>
      <Text className="self-center text-white font-base text-base">
        Cerrar session
      </Text>
    </TouchableOpacity>
  ) : null;
};

// Hooks
function useHeaderConfiguration() {
  const navigation = useNavigation<any>();

  const configureHeader = React.useCallback(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTitle: "Menu",
      headerTintColor: Colors.primary[500],
      headerStyle: {
        backgroundColor: "#04121A",
      },
      headerLeft: () => (
        <HeaderIcon name="chevron-back-outline" onPress={navigation?.goBack} />
      ),
      headerRight: () => (
        <HeaderIcon name="close-outline" onPress={navigation?.goBack} />
      ),
    });
  }, [navigation]);

  return { configureHeader };
}

function useAuthActions() {
  const { signOut } = useAuthContext();

  const handleLogout = React.useCallback(async () => {
    signOut();
  }, [signOut]);

  return { handleLogout };
}

const MenuWithSession = ({
  session,
  menuItems,
  isAuthenticated,
}: {
  session: string | null | undefined;
  menuItems: MenuItemProps[];
  isAuthenticated: boolean;
}) => {
  return isAuthenticated ? (
    <View className="flex flex-row flex-wrap gap-4 justify-between py-2 mx-2 items-center">
      {menuItems?.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </View>
  ) : null;
};

const MenuItem = ({ label, onPress, className, icon }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className={`p-2 ${className}`}>
    <View className="items-center">
      <View>{icon && icon}</View>
      <Text className="text-white font-bold text-xl">{label}</Text>
    </View>
  </TouchableOpacity>
);

const TermsAndConditions = () => {
  return (
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
  );
};

const MenuHero = ({
  session,
  isAuthenticated,
}: {
  session: string | null | undefined;
  isAuthenticated: boolean;
}) => {
  return !isAuthenticated ? (
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
  ) : null;
};
const MenuPage = () => {
  const { configureHeader } = useHeaderConfiguration();
  const { handleLogout } = useAuthActions();
  const { session } = useAuthContext();
  const { isAuthenticated } = useSessionStore();

  React.useLayoutEffect(() => {
    configureHeader();
  }, [configureHeader]);

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
      onPress: () => {
        router.dismissAll();
        router.replace("/");
      },
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
      onPress: () => {
        router.dismissAll();
        router.replace("/(dashboard)");
      },
    },
    {
      label: "Mi cuenta",
      icon: (
        <Ionicons name="person-outline" size={32} color={Colors.primary[500]} />
      ),
      onPress: () => {
        router.dismissAll();
        router.replace("/(dashboard)/profile");
      },
    },
  ];

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]}>
      <SafeAreaView className="flex h-full px-2 justify-between">
        <View className="flex flex-col items-center justify-center rounded-lg border border-primary-100">
          {/* hero */}
          <Image
            source={require("../assets/images/hero.png")}
            className={`w-full h-48  ${
              isAuthenticated ? "rounded-lg" : "rounded-t-lg"
            }`}
            resizeMode="cover"
          />

          <MenuHero session={session} isAuthenticated={isAuthenticated} />
        </View>
        <View className="flex grow flex-col mt-4 border-b border-primary-400 rounded-lg pt-4 mb-8">
          <MenuWithSession
            session={session}
            menuItems={menuItems}
            isAuthenticated={isAuthenticated}
          />
          <TermsAndConditions />
        </View>
        <View>
          <LogoutButton session={session} onPress={handleLogout} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MenuPage;
