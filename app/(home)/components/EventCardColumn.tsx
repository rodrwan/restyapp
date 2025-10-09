import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { Event } from "../types";
import { formatEventDate } from "../utils";

interface EventCardProps {
  event: Event;
  imageHeight: number;
}

const width = Dimensions.get("window").width;

export default function EventCard({ event, imageHeight }: EventCardProps) {
  const startAt = formatEventDate(event.start_at);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(events)/${event.id}`)}
      className="flex flex-col bg-white rounded-2xl mr-8 w-[380px] h-[340px]"
      style={{ width: imageHeight * 0.9 }}
    >
      <View style={{ height: imageHeight * 0.6 }}>
        <Image
          source={{ uri: event.image }}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
      </View>
      <View className="py-2 px-4 gap-2">
        <Text className="font-bold text-xl">{event.name}</Text>
        <Text className="text-xl text-primary-500">{startAt}</Text>
        <Text className="text-md text-secondary-300">
          Desde $
          {Number(
            event?.items?.filter((item) => item.type === "ENTRANCE")?.[0]
              ?.price ?? 0
          ).toLocaleString("es-CL")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
