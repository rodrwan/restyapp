import React, { useCallback, useMemo } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { router, Href } from "expo-router";
import { UpcomingEvent as UpcomingEventType, User } from "./types";
import { formatEventDate } from "./utils";
import ActionButtonsCarousel from "./ActionButtonsCarousel";

interface UpcomingEventProps {
  upcomingEvent: UpcomingEventType;
  user: User;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = React.memo(
  ({ upcomingEvent, user }) => {
    const { event } = upcomingEvent;

    // Early return if event is not available
    if (!event) {
      return (
        <View className="flex mx-2">
          <View className="mb-4">
            <Text className="text-white font-bold text-xl mx-2">
              Tu próximo evento
            </Text>
          </View>
          <View className="bg-white rounded-xl mx-2 mb-4 p-4">
            <View className="flex items-center justify-center py-8">
              <ActivityIndicator size="small" color="#666" />
              <Text className="text-secondary-300 text-sm mt-2">
                Cargando evento...
              </Text>
            </View>
          </View>
        </View>
      );
    }

    const formattedDate = useMemo(
      () => formatEventDate(event.start_at),
      [event.start_at]
    );

    const getAvailableCount = useCallback(
      (items: any[] | null) => {
        return (
          items
            ?.filter((item) => item.event.id === event.id)
            ?.filter((item) => !item.is_validated)?.length ?? 0
        );
      },
      [event.id]
    );

    const availableTickets = useMemo(
      () => getAvailableCount(user.tickets),
      [getAvailableCount, user.tickets]
    );
    const availableDrinks = useMemo(
      () => getAvailableCount(user.drinks),
      [getAvailableCount, user.drinks]
    );
    const availableCourtesies = useMemo(
      () => getAvailableCount(user.courtesies),
      [getAvailableCount, user.courtesies]
    );

    const handleTicketsPress = useCallback(() => {
      const url = `/(dashboard)/events/${event.id}`;
      router.push(url as Href);
    }, [event.id]);

    const handleDrinksPress = useCallback(() => {
      const url = `/(dashboard)/events/${event.id}/drinks`;
      router.push(url as Href);
    }, [event.id]);

    const handleCourtesiesPress = useCallback(() => {
      const url = `/(dashboard)/events/${event.id}/courtesies`;
      router.push(url as Href);
    }, []);

    const eventAddress = useMemo(() => {
      return event.place;
    }, [event.place]);

    const actionButtons = useMemo(
      () => [
        {
          icon: require("../../assets/images/ticket.png"),
          title: "Entradas",
          count: availableTickets,
          onPress: handleTicketsPress,
          width: 32,
          height: 32,
        },
        {
          icon: require("../../assets/images/glass.png"),
          title: "Barra",
          count: availableDrinks,
          onPress: handleDrinksPress,
          width: 32,
          height: 32,
        },
        ...(availableCourtesies > 0
          ? [
              {
                icon: require("../../assets/images/gift.png"),
                title: "Cortesías",
                count: availableCourtesies,
                onPress: handleCourtesiesPress,
                width: 48,
                height: 32,
              },
            ]
          : []),
      ],
      [
        availableTickets,
        availableDrinks,
        availableCourtesies,
        handleTicketsPress,
        handleDrinksPress,
        handleCourtesiesPress,
      ]
    );

    return (
      <View className="flex">
        <View className="mb-4">
          <Text className="text-white font-bold text-xl mx-2">
            Tu próximo evento
          </Text>
        </View>
        <View className="bg-white rounded-xl mx-2 mb-4">
          <View className="flex p-4 pb-0 flex-col bg-white rounded-xl">
            <View className="flex w-full">
              <Image
                source={{ uri: event.image }}
                className="rounded-lg w-full h-[160px]"
                resizeMode="cover"
              />
            </View>
            <View className="flex flex-col w-3/4 mt-2">
              <Text
                numberOfLines={1}
                className="overflow-hidden font-bold text-lg"
              >
                {event.name}
              </Text>
              <Text className="text-primary-500 text-base font-semibold">
                {formattedDate}
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Text numberOfLines={1} className="text-secondary-300 text-sm">
                  {eventAddress}
                </Text>
              </View>
            </View>
          </View>

          <ActionButtonsCarousel buttons={actionButtons} />
        </View>
      </View>
    );
  }
);

export default UpcomingEvent;
