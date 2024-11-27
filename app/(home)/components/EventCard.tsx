import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Event } from "../types";
import { formatEventDate } from "../utils";

interface EventCardProps {
  event: Event;
  imageHeight: number;
}

export function EventCard({ event, imageHeight }: EventCardProps) {
  const startAt = formatEventDate(event.start_at);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(events)/${event.id}`)}
      className="bg-white rounded-3xl mb-4"
    >
      <View
        className="bg-white rounded-3xl"
        style={{ height: imageHeight * 0.9 }}
      >
        <Image
          source={{ uri: event.image }}
          className="w-full h-full rounded-3xl"
          resizeMode="cover"
        />
      </View>
      <View className="py-8 px-4 gap-4">
        <Text className="font-bold text-xl">{event.name}</Text>
        <Text className="text-xl text-primary-500">{startAt}</Text>
        <Text className="text-md text-secondary-300">
          Desde ${Number(event?.items?.[0]?.price).toLocaleString("es-CL")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
