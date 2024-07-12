import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useGetEventById from "@/hooks/useGetEventById";
import { Ionicons } from "@expo/vector-icons";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import Colors from "@/constants/Colors";
import useCartStore from "@/stores/useCart";

const EventPage = ({}) => {
  const navigation = useNavigation();
  const { items, addToCart, removeFromCart } = useCartStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
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
    });
  }, []);

  const { eventId }: any = useLocalSearchParams();
  const {
    data: { event },
    loading,
  }: any = useGetEventById(eventId);

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
  const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ParallaxScrollView
        backgroundColor={Colors.secondary[500]}
        style={{
          flex: 1,
          width: "100%",
          height: 350,
        }}
        parallaxHeaderHeight={350}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.secondary[500]}
        renderBackground={() => (
          <Image source={{ uri: event?.image }} className="h-full w-full" />
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
                  return (
                    <View
                      className={`flex flex-row justify-between ${
                        index % 2 === 0
                          ? "bg-secondary-500"
                          : "bg-secondary-300"
                      } p-4 mx-2 rounded-xl`}
                    >
                      <View>
                        <Text className="text-white text-base font-bold mb-2">
                          {item?.name}
                        </Text>
                        {event.nominated && (
                          <Text className="py-1.5 text-secondary-200">
                            Nominativa. Válido hasta las {event.end_hour}hrs
                          </Text>
                        )}
                        <Text className="text-primary-500 text-base mb-2">
                          ${item?.price} c/u
                        </Text>
                      </View>
                      <View className="flex flex-row gap-2 items-center">
                        <TouchableOpacity onPress={() => removeFromCart(item)}>
                          <Ionicons
                            name="remove-circle-outline"
                            color={Colors.white}
                            size={32}
                          />
                        </TouchableOpacity>
                        <Text className="text-white text-xl">
                          {(items?.length &&
                            items.filter(
                              (item: any) => item.type === "ENTRANCE"
                            )[index]?.quantity) ??
                            0}
                        </Text>
                        <TouchableOpacity onPress={() => addToCart(item)}>
                          <Ionicons
                            name="add-circle-outline"
                            color={Colors.primary[500]}
                            size={32}
                          />
                        </TouchableOpacity>
                      </View>
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
                  return (
                    <View
                      className={`flex flex-row justify-between ${
                        index % 2 === 0
                          ? "bg-secondary-500"
                          : "bg-secondary-300"
                      } p-4 mx-2 rounded-xl`}
                    >
                      <View>
                        <Text className="text-white text-base font-bold mb-2">
                          {item?.name}
                        </Text>
                        <Text className="text-primary-500 text-base mb-2">
                          ${item?.price} c/u
                        </Text>
                      </View>
                      <View className="flex flex-row gap-2 items-center">
                        <TouchableOpacity onPress={() => removeFromCart(item)}>
                          <Ionicons
                            name="remove-circle-outline"
                            color={Colors.white}
                            size={32}
                          />
                        </TouchableOpacity>
                        <Text className="text-white text-xl">
                          {(items?.length &&
                            items.filter((item: any) => item.type === "DRINK")[
                              index
                            ]?.quantity) ??
                            0}
                        </Text>
                        <TouchableOpacity onPress={() => addToCart(item)}>
                          <Ionicons
                            name="add-circle-outline"
                            color={Colors.primary[500]}
                            size={32}
                          />
                        </TouchableOpacity>
                      </View>
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
          <View className="bg-secondary-700 py-8 px-4 gap-4">
            <Text className="text-white font-bold text-2xl">
              Acerca del evento
            </Text>
            <Text className="text-white font-bold text-xl">{event?.name}</Text>

            <Text className="text-lg text-primary-500">{startAt}</Text>
            <Text className="text-secondary-300 text-base">
              {event?.description}
            </Text>
            {/* Date */}
            <View></View>
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
      {items?.length > 0 ? (
        <View className="flex w-full absolute bottom-12 bg-transparent justify-center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/events/cart")}
            className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
          >
            <Text className="text-white font-bold">
              Ir al Carro (
              {(items?.length &&
                items.reduce((acc: any, cur: any) => acc + cur.quantity, 0)) ??
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
