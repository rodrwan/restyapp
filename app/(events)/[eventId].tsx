import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import useGetEventById from "@/hooks/useGetEventById";
import Colors from "@/constants/Colors";
import useCartStore from "@/stores/useCart";
import { EventHeader } from "@/components/events/EventHeader";
import { TicketsList } from "@/components/events/TicketsList";
import { formatEventDates } from "./utils";
import useEventStore from "@/stores/useEvent";

export default function EventPage() {
  const { setEvent } = useEventStore();
  const navigation = useNavigation<any>();
  const {
    items: itemsInCart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCartStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () => <EventHeader clearCart={clearCart} />,
    });
  }, []);

  const { eventId }: any = useLocalSearchParams();
  const {
    data: { event },
    loading,
  }: any = useGetEventById(eventId);

  React.useEffect(() => {
    console.log("event", event);
    setEvent(event);
  }, [event]);
  if (!Boolean(eventId) || loading) {
    return (
      <LinearGradient
        colors={["#04121A", "#092838"]}
        style={{ flex: 1, height: "100%" }}
      >
        <View className="h-full items-center justify-center">
          <ActivityIndicator size={"small"} />
        </View>
      </LinearGradient>
    );
  }

  const tickets = event?.items.filter((elem: any) => elem.type === "ENTRANCE");
  const drinks = event?.items.filter((elem: any) => elem.type === "DRINK");
  const { startAt, startHour, endAt } = formatEventDates(event);

  return (
    <>
      <ParallaxScrollView
        backgroundColor={Colors.secondary[500]}
        style={{ flex: 1 }}
        parallaxHeaderHeight={450}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.secondary[500]}
        renderBackground={() => (
          <Image
            source={{ uri: event?.image }}
            resizeMode="stretch"
            style={{ width: "100%", height: undefined, aspectRatio: 4 / 4 }}
          />
        )}
        renderStickyHeader={() => (
          <View className="mx-auto h-[90px] w-full justify-end items-center">
            <Text className="text-white font-bold text-base">
              {event?.name}
            </Text>
          </View>
        )}
        className="flex"
      >
        <View className="-mt-4">
          <TicketsList
            items={tickets}
            type="ENTRANCE"
            title="Tickets"
            itemsInCart={itemsInCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            nominated={event?.nominated}
            endAt={endAt}
            outOfStock={event?.out_of_stock}
          />

          <TicketsList
            items={drinks}
            type="DRINK"
            title="Tragos"
            itemsInCart={itemsInCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />

          {/* About Section */}
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
                  {event?.address} {event?.place}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>

      {itemsInCart?.length > 0 && (
        <View className="flex w-full absolute bottom-12 bg-transparent justify-center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.replace("(cart)", {
                screen: "index",
                initial: false,
                params: { goBackTo: `(events)/${eventId}` },
              });
            }}
            className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
          >
            <Text className="text-lg text-white font-bold">
              Ir al Carro (
              {itemsInCart.reduce((acc, cur) => acc + (cur.quantity ?? 0), 0)})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
