import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/Colors";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useCartStore from "@/stores/useCart";
import useGetOrderById from "@/hooks/useGetOrderById";
import { LinearGradient } from "expo-linear-gradient";
import useUserStore from "@/stores/useUser";

function formatDate(dateString: string) {
  if (!dateString) return "";

  const splittedStartAt = dateString.split(" ");
  const joinedStartAt = splittedStartAt?.[0];

  const date = new Date(joinedStartAt);
  return date
    .toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll("-", "/");
}

const SuccessPage = () => {
  const { user } = useUserStore();
  const navigation = useNavigation<any>();
  const { clearCart } = useCartStore();
  const { getEvents }: any = useGetEventsFromUser();
  const { getOrderById, loading, data }: any = useGetOrderById();
  const { orderId } = useLocalSearchParams();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "Pago exitoso",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
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
        ) : (
          <View />
        ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/menu")}
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

  React.useEffect(() => {
    getOrderById(orderId);
  }, [orderId]);

  if (loading) {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={["#04121A", "#041e2b"]}
        className="flex h-full"
      >
        <View className="h-full items-center justify-center">
          <ActivityIndicator size={"small"} />
        </View>
      </LinearGradient>
    );
  }

  const feeAmount =
    data?.order?.items?.find((item: any) => item?.type === "FEE")?.price ?? 0;

  const amount = data?.order?.items?.reduce((acc: any, item: any) => {
    if (item?.type === "FEE") {
      return acc;
    }

    return acc + item?.price;
  }, 0);

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#041e2b"]}
    >
      <ScrollView className="flex h-full bg-secondary-500 p-2 mt-16">
        <View className="flex py-2 bg-white rounded-xl mt-14">
          <Text className="self-center font-bold text-xl mb-4">
            Compra Exitosa
          </Text>

          <Text className="self-center font-bold text-3xl mt-4 mb-4">
            ¡A contar las horas!
          </Text>

          <Text className="self-center text-base mb-8">
            Tu compra se ha realizado con éxito
          </Text>

          <TouchableOpacity className="flex-row items-center justify-center">
            <View className="flex-row items-center justify-center border border-primary-500 rounded-lg p-2 px-4 mx-2">
              <Ionicons
                name="ticket-outline"
                size={24}
                color={Colors.primary[500]}
              />
              <Text
                className="text-base font-semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                #
                {Array.isArray(orderId)
                  ? orderId[0].split("-")[0]
                  : orderId?.split("-")[0]}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-col items-center justify-center mx-2 mt-8">
            <View className="flex-row justify-between w-full mb-2">
              <Text className="text-base font-normal">Fecha</Text>
              <Text className="text-base font-normal">
                {formatDate(data?.payment?.created_at)}
              </Text>
            </View>
            <View className="flex-row justify-between w-full mb-2">
              <Text className="text-base font-normal">Medio de pago</Text>
              <Text className="text-base font-normal">Webpay</Text>
            </View>
            <View className="flex-row justify-between w-full">
              <Text className="text-base font-normal">Comprado por</Text>
              <Text className="text-base font-normal">
                {user?.firstname} {user?.lastname}
              </Text>
            </View>
          </View>
          {/* separator */}
          <View className="h-px bg-secondary-100 w-full my-4" />

          <View className="flex-col items-center justify-center mx-2">
            <View className="flex-row justify-between w-full mb-2">
              <Text className="text-base font-normal">Monto</Text>
              <Text className="text-base font-normal">
                ${Number(amount).toLocaleString("es-CL")}
              </Text>
            </View>
            <View className="flex-row justify-between w-full mb-2">
              <Text className="text-base font-normal">Cargo por servicio</Text>
              <Text className="text-base font-normal">
                ${Number(feeAmount).toLocaleString("es-CL")}
              </Text>
            </View>
            <View className="flex-row justify-between w-full">
              <Text className="text-base font-normal">Total</Text>
              <Text className="text-base font-normal">
                ${Number(data?.payment?.amount).toLocaleString("es-CL")}
              </Text>
            </View>
          </View>

          {/* separator */}
          <View className="h-px bg-secondary-100 w-full my-4" />

          <CustomButton
            title="Ver mis Tickets"
            handlePress={async () => {
              await getEvents();
              navigation.replace("(dashboard)", {
                screen: "index",
                initial: false,
              });
            }}
            containerStyles="mx-2"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SuccessPage;
