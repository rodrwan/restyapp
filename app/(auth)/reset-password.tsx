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

export default function ResetPassword() {
  const navigation = useNavigation();
  const { resetPassword } = useSession();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const params: any = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => router.back()}
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
    if (!form.code || !form.password || !form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(form.code, form.password);
      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: "Tu contraseña ha sido actualizada",
      });
      router.replace("/sign-in");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo actualizar la contraseña",
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
              Cambiar Contraseña
            </Text>
            <Text className="text-base text-secondary-50 mt-4">
              Ingresa el código que recibiste por email y tu nueva contraseña
            </Text>

            <FormField
              title="Código de Recuperación"
              value={form.code}
              handleChangeText={(text: string) =>
                setForm({ ...form, code: text })
              }
              otherStyles="mt-7"
              keyboardType="number-pad"
              maxLength={6}
            />

            <FormField
              title="Nueva Contraseña"
              value={form.password}
              handleChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              otherStyles="mt-7"
              secureTextEntry
              autoComplete="password-new"
            />

            <FormField
              title="Confirmar Contraseña"
              value={form.confirmPassword}
              handleChangeText={(text: string) =>
                setForm({ ...form, confirmPassword: text })
              }
              otherStyles="mt-7"
              secureTextEntry
              autoComplete="password-new"
            />

            <CustomButton
              title="Cambiar Contraseña"
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
