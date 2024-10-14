import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/Colors";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser.";
import useCartStore from "@/stores/useCart";

const SuccessPage = () => {
  const navigation = useNavigation();
  const { clearCart } = useCartStore();
  const { getEvents }: any = useGetEventsFromUser();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Pago exitoso",
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
            return router.push("/");
          }}
          className="flex flex-row items-center justify-center items-center p-2"
        >
          <Ionicons name="menu-outline" size={32} color={Colors.primary[500]} />
        </TouchableOpacity>
      ),
    });
  }, []);

  React.useEffect(() => {
    clearCart();
  }, []);

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 p-2">
      <View className="p-8 bg-white rounded-xl mt-14">
        <Text className="self-center font-bold text-xl mb-8">
          Compra Exitosa
        </Text>

        <Text className="self-center font-bold text-3xl mt-8 mb-8">
          ¡A contar las horas!
        </Text>

        <Text className="self-center text-base mt-8 mb-8">
          Tu compra se ha realizado con éxito
        </Text>

        <CustomButton
          title="Ver mis Tickets"
          handlePress={async () => {
            await getEvents();
            router.replace("/(dashboard)");
          }}
          containerStyles="mt-7"
        />
      </View>
    </SafeAreaView>
  );
};

export default SuccessPage;
