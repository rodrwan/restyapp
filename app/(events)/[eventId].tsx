import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useGetEventById from "@/hooks/useGetEventById";
import { Ionicons } from "@expo/vector-icons";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import Colors from "@/constants/Colors";
import useCartStore from "@/stores/useCart";
import useEventStore from "@/stores/useEvent";

const EventPage = ({}) => {
  const navigation = useNavigation<any>();
  const {
    items: itemsInCart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const { setEvent } = useEventStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
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
        ) : (
          <View className="flex flex-row justify-center items-center p-2" />
        ),
    });
  }, []);

  const { eventId }: any = useLocalSearchParams();
  const {
    data: { event },
    loading,
  }: any = useGetEventById(eventId);

  useEffect(() => {
    setEvent(event);
  }, [event]);

  if (loading) {
    // Show loader when fetching first page data.
    return (
      <View className="bg-secondary-500 h-full items-center justify-center">
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  const tickets = event.items.filter((elem: any) => elem.type === "ENTRANCE");
  const drinks = event.items.filter((elem: any) => elem.type === "DRINK");

  const splittedStartAt = event.start_at.split(" ");
  const hour = event.start_hour.split("T")[1];
  const joinedStartAt = splittedStartAt[0] + " " + hour.replace("Z", "");

  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startHour = new Date(joinedStartAt).toLocaleString("es-CL", {
    minute: "2-digit",
    hour: "2-digit",
  });

  const splittedEndAt = event.end_at.split(" ");
  const endHour = event.end_hour.split("T")[1];
  const joinedEndAt = splittedEndAt[0] + " " + endHour.replace("Z", "");
  const endAt = new Date(joinedEndAt).toLocaleString("us-US", {
    minute: "2-digit",
    hour: "2-digit",
  });
  return (
    <>
      <ParallaxScrollView
        backgroundColor={Colors.secondary[500]}
        style={{
          flex: 1,
          // width: "100%",
          // height: "100%",
        }}
        parallaxHeaderHeight={450}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.secondary[500]}
        renderBackground={() => (
          <Image
            source={{ uri: event?.image }}
            resizeMode="cover"
            style={{ width: "100%", height: undefined, aspectRatio: 4 / 5 }}
          />
        )}
        renderStickyHeader={() => (
          <View key="sticky-header" className="ml-24 h-[90px] justify-end">
            <Text className="text-white font-bold text-base">
              {event?.name}
            </Text>
          </View>
        )}
        className="flex bg-secondary-500"
      >
        <View className="mt-4">
          {/* Tickets */}
          {tickets.length ? (
            <View className="bg-secondary-700 py-8 mb-8 mx-1 rounded-3xl">
              <FlatList
                scrollEnabled={false}
                data={tickets}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item, index }) => {
                  const quantity =
                    itemsInCart?.length &&
                    itemsInCart
                      .filter((item: any) => item.type === "ENTRANCE")
                      .reduce((acc: any, cur: any) => acc + cur.quantity, 0);
                  const maxPerSale =
                    item?.max_per_sale < item?.stock
                      ? item?.max_per_sale
                      : item?.stock;
                  const disabledAdd = maxPerSale <= quantity;

                  return (
                    <View
                      className={`flex flex-row justify-between ${
                        index % 2 === 0
                          ? "bg-secondary-500"
                          : "bg-secondary-600"
                      } p-4 mx-2 rounded-xl`}
                    >
                      <View className="flex flex-col">
                        <Text className="text-white text-base font-bold mb-2">
                          {item?.name}{" "}
                          {event.nominated && (
                            <Text
                              className="py-1.5 text-xs text-secondary-200"
                              numberOfLines={1}
                            >
                              (Nominada)
                            </Text>
                          )}
                        </Text>
                        {event.nominated && (
                          <Text
                            className="py-1.5 text-secondary-200"
                            numberOfLines={1}
                          >
                            Válido hasta las {endAt}
                          </Text>
                        )}
                        <Text className="text-primary-500 text-base mb-2">
                          ${Number(item?.price).toLocaleString("es-CL")} c/u
                        </Text>

                        {disabledAdd && (
                          <Text className="text-error-300 text-xs">
                            No puedes agregar más entradas
                          </Text>
                        )}
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
                                  iic?.type === "ENTRANCE" &&
                                  iic?.id === item?.id
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
                      Tickets
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : null}
          {/* Drinks */}
          {drinks.length ? (
            <View className="bg-secondary-700 py-8 mb-8 mx-1 rounded-3xl">
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
                                  iic?.type === "DRINK" && iic?.id === item?.id
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
          {/* About */}
          <View className="bg-secondary-700 py-8 px-4 gap-4 mb-32">
            <Text className="text-white font-bold text-2xl">
              Acerca del evento
            </Text>
            <Text className="text-white font-bold text-xl">{event?.name}</Text>

            <Text className="text-secondary-100 text-base">
              {event?.description}
            </Text>

            <View className="flex-row">
              <Text className="text-base text-secondary-300">Cuando: </Text>
              <Text className="text-base text-primary-500">{startAt}</Text>
            </View>
            <View className="flex-row">
              <Text className="text-base text-secondary-300">Comienza: </Text>
              <Text className="text-base text-primary-400">{startHour}</Text>
            </View>
            {/* Place */}
            <View>
              <Text className="text-white font-bold text-xl mb-2">
                Ubicación
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={Colors.primary[500]}
                />
                <Text className="text-secondary-300 text-base">
                  {event?.place}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
      {itemsInCart?.length > 0 ? (
        <View className="flex w-full absolute bottom-12 bg-transparent justify-center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.replace("(cart)", {
                screen: "index",
                initial: false,
                params: {
                  goBackTo: `/(events)/${eventId}`,
                },
              });
            }}
            className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
          >
            <Text className="text-white font-bold">
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
    </>
  );
};

export default EventPage;
