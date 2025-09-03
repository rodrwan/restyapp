import React, { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import * as LocalAuthentication from "expo-local-authentication";
import useSession from "@/hooks/useSession";
import { useSession as useSessionContext } from "@/context/AuthProvider";
const DeleteAccount = () => {
  const navigation = useNavigation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const { deleteMe } = useSession();
  const { signOut } = useSessionContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Eliminar cuenta",
      headerTintColor: Colors.primary[500],
      headerStyle: {
        backgroundColor: "#04121A",
      },
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
        ) : null,
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return;
      }
    })();
  });

  const onAuthenticate = async () => {
    if (!hasConfirmed) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes confirmar que entiendes las consecuencias de esta acción",
      });
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirma tu compra",
      fallbackLabel: "Usar contraseña",
    });

    if (result.success) {
      handleDelete();
    } else {
      console.log("Failed to authenticate");
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    // Aquí iría la lógica de eliminación de cuenta
    try {
      await deleteMe();
      signOut();
      router.replace("/");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar la cuenta",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      <SafeAreaView className="h-full">
        <ScrollView className="px-2">
          <View className="pb-6">
            <View className="bg-secondary-600/50 p-4 rounded-lg mb-6">
              <Text className="text-red-500 text-xl font-psemibold mb-4">
                Advertencia: Eliminación permanente de datos
              </Text>

              <Text className="text-base text-gray-100 mb-4">
                Al continuar con esta acción, toda la información asociada a tu
                cuenta será eliminada de manera permanente. Esto incluye, pero
                no se limita a:
              </Text>

              <View className="mb-4">
                {[
                  "Tus datos personales (nombre, dirección, correo electrónico, etc.).",
                  "Historial de órdenes de compra.",
                  "Tickets adquiridos y su información asociada.",
                ].map((item, index) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-base text-gray-100">• {item}</Text>
                  </View>
                ))}
              </View>

              <Text className="text-xl text-yellow-500 font-psemibold mb-2">
                ⚠️ Importante:
              </Text>

              <View className="mb-4">
                {[
                  "Esta acción es irreversible y no podrás recuperar tu cuenta ni la información eliminada.",
                  "Tu correo electrónico quedá liberado y podrá ser utilizados por otros usuarios en el futuro.",
                  "Te recomendamos descargar cualquier información relevante antes de proceder.",
                ].map((item, index) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-base text-gray-100">• {item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableWithoutFeedback
              onPress={() => setHasConfirmed(!hasConfirmed)}
            >
              <View className="flex flex-row items-center mb-6 px-2">
                <View
                  className={`w-5 h-5 border rounded mr-2 ${
                    hasConfirmed
                      ? "bg-primary-500 border-primary-500"
                      : "border-gray-400"
                  } justify-center items-center`}
                >
                  {hasConfirmed && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-xs text-gray-100">
                  Entiendo las consecuencias y deseo eliminar mi cuenta
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <CustomButton
              title="Eliminar Cuenta"
              handlePress={onAuthenticate}
              containerStyles="bg-red-500"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
        <Toast topOffset={20} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DeleteAccount;
