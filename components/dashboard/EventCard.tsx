import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, Href } from "expo-router";
import { Event } from "./types";
import { formatEventDate } from "./utils";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard: React.FC<EventCardProps> = React.memo(({ event, index }) => {
  // Early return if event is not available
  if (!event) {
    return (
      <View
        className={`flex p-2 flex-row bg-white rounded-xl ${
          index % 2 === 0 ? "border-b border-b-secondary-100" : ""
        }`}
      >
        <View className="flex items-center justify-center w-full py-4">
          <ActivityIndicator size="small" color="#666" />
        </View>
      </View>
    );
  }

  const handlePress = useCallback(() => {
    const url = `/(dashboard)/events/${event.id}`;
    router.push(url as Href);
  }, [event.id]);

  const formattedDate = useMemo(
    () => formatEventDate(event.start_at),
    [event.start_at]
  );

  return (
    <View
      className={`flex p-2 flex-row bg-white rounded-xl ${
        index % 2 === 0 ? "border-b border-b-secondary-100" : ""
      }`}
    >
      <View className="flex w-1/4">
        <Image
          source={{ uri: event.image }}
          className="rounded-lg w-[80px] h-[80px]"
        />
      </View>
      <View className="flex flex-col w-2/4 pl-2 -ml-1 mr-2">
        <Text numberOfLines={1} className="overflow-hidden font-bold text-lg">
          {event.name}
        </Text>
        <Text className="text-primary-500 text-base">{formattedDate}</Text>
        <Text numberOfLines={2} className="text-secondary-300 text-sm">
          {event.description}
        </Text>
      </View>
      <View className="w-1/4">
        <TouchableOpacity
          onPress={handlePress}
          className="flex bg-primary-500 w-[80px] h-[80px] items-center justify-center rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold mb-4">Ver</Text>
          <Text className="text-white font-semibold">Evento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default EventCard;
