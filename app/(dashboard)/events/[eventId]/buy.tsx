import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Platform,
} from "react-native";
import React from "react";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import useUserStore from "@/stores/useUser";
import useCartStore from "@/stores/useCart";
import useGetEventById from "@/hooks/useGetEventById";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "@/components/LoadingScreen";

const Buy = () => {
  const { eventId }: any = useLocalSearchParams();
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const {
    items: itemsInCart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const {
    data: { event },
    loading: loadingEvent,
  }: any = useGetEventById(eventId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            clearCart();
            navigation?.goBack();
          }}
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
        <TouchableOpacity onPress={() => router.push("/menu")}>
          <Ionicons name="menu" size={32} color={Colors.primary[500]} />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Mostrar loading mientras se carga el evento
  if (loadingEvent) {
    return <LoadingScreen message="Cargando evento..." />;
  }

  // Verificar si hay drinks disponibles en el evento
  const drinks =
    event?.items?.filter((elem: any) => elem.type === "DRINK") || [];

  if (!event) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]}>
        <SafeAreaView className="flex h-full">
          <View className="flex justify-center items-center h-full">
            <Text className="text-white">No event data available</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const startAt = event?.start_at
    ? (() => {
        // Limpiar el formato de fecha removiendo "+0000 UTC"
        const cleanDate = event.start_at.replace(" +0000 UTC", "");
        const date = new Date(cleanDate);
        return date.toLocaleString("es-CL", {
          weekday: "short",
          month: "long",
          day: "numeric",
        });
      })()
    : "";
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#041e2b"]}
    >
      <SafeAreaView className="flex h-full">
        <View className="flex mt-16 h-full">
          {/* event resumen details */}
          <View className="flex flex-row gap-2 mx-2 bg-white rounded-lg p-2 mb-4">
            <Image
              source={{ uri: event?.image }}
              style={{ aspectRatio: 1 }}
              className="rounded-lg w-[100px] h-[100px]"
            />
            <View>
              <Text className="text-secondary-500 font-bold text-2xl">
                {event?.name}
              </Text>
              <Text className="text-primary-500 text-base">{startAt}</Text>
              <Text numberOfLines={1} className="text-secondary-300 text-sm">
                {event?.place?.trim()}
              </Text>
            </View>
          </View>
          {/* Drinks */}
          {drinks.length ? (
            <View className="bg-secondary-700 py-4 mb-8 mx-1 rounded-3xl">
              <FlatList
                scrollEnabled={false}
                data={drinks}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item, index }) => {
                  const quantity =
                    itemsInCart?.find(
                      (iic: any) =>
                        iic?.type === "DRINK" && iic?.id === item?.id
                    )?.quantity ?? 0;

                  const maxPerSale =
                    item?.max_per_sale < item?.stock
                      ? item?.max_per_sale
                      : item?.stock;
                  const disabledAdd = maxPerSale <= quantity;

                  return (
                    <View
                      className={`flex flex-row mb-2 justify-between ${
                        index % 2 === 0
                          ? "bg-secondary-500"
                          : "bg-secondary-600"
                      } p-4 mx-2 rounded-xl`}
                    >
                      <View>
                        <Text className="text-white text-base font-bold mb-2">
                          {item?.name}
                        </Text>
                        <Text className="text-primary-500 text-base mb-2">
                          ${Number(item?.price).toLocaleString("es-CL")} c/u
                        </Text>
                      </View>
                      {item?.stock > 0 ? (
                        <View className="flex flex-row gap-2 items-center">
                          <TouchableOpacity
                            onPress={() => removeFromCart(item)}
                          >
                            <Ionicons
                              name="remove-circle-outline"
                              color={Colors.white}
                              size={32}
                            />
                          </TouchableOpacity>
                          <Text className="text-white text-xl">
                            {(itemsInCart?.length &&
                              itemsInCart.find(
                                (iic: any) =>
                                  iic.type === "DRINK" && iic.id === item?.id
                              )?.quantity) ??
                              0}
                          </Text>
                          <TouchableOpacity
                            onPress={() => addToCart(item)}
                            disabled={disabledAdd}
                          >
                            <Ionicons
                              name="add-circle-outline"
                              color={
                                disabledAdd
                                  ? Colors.secondary[300]
                                  : Colors.primary[500]
                              }
                              size={32}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="flex flex-col items-center justify-center">
                          <Text className="text-error-300 text-xl">
                            Agotado
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }}
                ListHeaderComponent={() => (
                  <View className="flex justify-center p-4">
                    <Text className="text-white text-left text-xl font-bold">
                      Tragos
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : null}
          {itemsInCart?.length > 0 ? (
            <View className="flex w-full absolute bottom-20 bg-transparent justify-center">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate("(cart)", {
                    screen: "index",
                    initial: false,
                    params: {
                      eventId,
                      goBackTo: `(dashboard)/events/${eventId}`,
                    },
                  });
                }}
                className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
              >
                <Text className="text-lg text-white font-bold">
                  Ir al Carro (
                  {(itemsInCart?.length &&
                    itemsInCart.reduce(
                      (acc: any, cur: any) => acc + cur.quantity,
                      0
                    )) ??
                    0}
                  )
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Buy;
