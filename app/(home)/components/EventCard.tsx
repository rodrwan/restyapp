import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Event } from "../types";
import { formatEventDate } from "../utils";
import Colors from "@/constants/Colors";

interface EventCardProps {
  event: Event;
  imageHeight: number;
}

export default function EventCard({ event, imageHeight }: EventCardProps) {
  const startAt = formatEventDate(event?.start_at);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(events)/${event?.id}`)}
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#d1d5db",
        shadowColor: Colors.secondary[300],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 6,
        minHeight: 120,
      }}
    >
      <View
        className="rounded-2xl"
        // style={{ height: imageHeight * 0.9 }}
      >
        <Image
          source={{ uri: event?.image }}
          className="w-[120px] h-[120px] rounded-l-2xl"
          resizeMode="cover"
        />
      </View>
      <View className="py-2 px-4 gap-2">
        <Text className="font-bold text-xl">{event?.name}</Text>
        <Text className="text-xl text-primary-500">{startAt}</Text>
        <Text className="text-md text-secondary-300">
          Desde $
          {Number(
            event?.items.filter((item) => item?.type === "ENTRANCE")?.[0]?.price
          ).toLocaleString("es-CL")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
