import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useRef } from "react";
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
  const scrollViewRef = useRef<any>(null);
  const [descriptionY, setDescriptionY] = React.useState(0);
  const {
    items: itemsInCart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCartStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
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
    setEvent(event);
  }, [event]);
  if (!eventId || loading) {
    return (
      <LinearGradient
        colors={["#04121A", "#041e2b"]}
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

  const scrollToDescription = () => {
    const ref = scrollViewRef.current;
    if (ref) {
      ref.scrollTo({ y: descriptionY, animated: true });
    }
  };

  return (
    <>
      <ParallaxScrollView
        ref={scrollViewRef}
        backgroundColor={Colors.secondary[500]}
        style={{ flex: 1 }}
        parallaxHeaderHeight={400}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.secondary[500]}
        scrollViewProps={{
          showsHorizontalScrollIndicator: false,
        }}
        renderBackground={() => (
          <View className="">
            <ImageBackground
              source={{ uri: event?.image }}
              resizeMode="stretch"
              style={{ width: "100%", height: undefined, aspectRatio: 4 / 4 }}
            >
              <LinearGradient
                colors={["transparent", Colors.secondary[500]]} // Example: dark to transparent
                className="absolute bottom-0 left-0 right-0 py-8 px-4"
              >
                <Text className="text-white font-bold text-2xl mb-2">
                  {event?.name}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.white}
                  />
                  <Text className="text-base text-white">{startAt}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
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
        <View className="pt-2">
          {/* About Section */}
          <View className="px-4 gap-4 mb-8">
            <Text className="text-white font-bold text-2xl">{event?.name}</Text>
            <TouchableOpacity
              onPress={scrollToDescription}
              activeOpacity={0.7}
              className="self-start"
            >
              <Text className="text-primary-400 text-base font-semibold">
                Ver Más
              </Text>
            </TouchableOpacity>
          </View>
          <TicketsList
            items={tickets}
            type="ENTRANCE"
            title="Entradas"
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

          {/* About Section (Descripción completa) */}
          <View
            className="bg-secondary-700 py-8 px-4 gap-4 mb-32"
            onLayout={(e) => setDescriptionY(e.nativeEvent.layout.y)}
          >
            <Text className="text-white font-bold text-2xl">
              Acerca del evento
            </Text>
            <Text className="text-white font-bold text-xl">{event?.name}</Text>
            <Text className="text-secondary-100 text-base">
              {event?.description}
            </Text>

            <View className="flex-row">
              <Ionicons
                name="calendar-outline"
                size={24}
                color={Colors.primary[500]}
              />
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
