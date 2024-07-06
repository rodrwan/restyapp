import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useCartContext } from "@/context/CartProvider";
import CustomButton from "@/components/CustomButton";

const FailurePage = () => {
  const navigation = useNavigation();
  const { clearCart } = useCartContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Error",
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
          onPress={() => {
            clearCart();
            return router.push("/");
          }}
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
    <SafeAreaView className="flex h-full bg-secondary-500 p-2">
      <Text className="self-center text-white font-bold text-xl mb-8">
        No fue posible procesar tu pago
      </Text>

      <CustomButton
        title="Vuelve a intentarlo"
        handlePress={() => navigation?.goBack()}
        containerStyles="mt-7"
        // isLo
      />
    </SafeAreaView>
  );
};

export default FailurePage;
