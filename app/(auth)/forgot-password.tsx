import { useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Colors from "@/constants/Colors";
import useSession from "@/hooks/useSession";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { requestPasswordReset } = useSession();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const params: any = useLocalSearchParams();
  console.log("params", params);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => router.push("../")}
            className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2 bg-secondary-500"
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.primary[500]}
            />
          </TouchableOpacity>
        ) : (
          <View />
        ),
    });
  }, []);

  const handleSubmit = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor ingresa tu email",
      });
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      router.push("/reset-password");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo enviar el código de recuperación",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#04121A", "#092838"]} className="flex-1">
      <SafeAreaView className="h-full">
        <KeyboardAwareScrollView>
          <View
            className="w-full flex justify-start h-full px-4"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Logo />
            <Text className="text-2xl font-semibold text-white mt-16 font-psemibold">
              Recuperar Contraseña
            </Text>
            <Text className="text-base text-secondary-50 mt-4">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos
              las instrucciones para restablecer tu contraseña.
            </Text>
            <Text className="text-base text-secondary-50 mt-4 mb-7">
              Si iniciaste sesión con Google, no podrás restablecer tu
              contraseña con este método.
            </Text>

            <FormField
              title="Email"
              value={email}
              handleChangeText={setEmail}
              otherStyles="mt-7"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />

            <CustomButton
              title="Enviar Código"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </KeyboardAwareScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
}
