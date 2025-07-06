import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface UpcomingEventCardProps {
  upcomingEvent: any;
  user: any;
  nextEventUrl: string;
  startAt: string;
}

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  upcomingEvent,
  user,
  nextEventUrl,
  startAt,
}) => {
  return (
    <View className="flex mx-2">
      <View className="mb-4">
        <Text className="text-white font-bold text-xl mx-2">
          Tu próximo evento
        </Text>
      </View>
      <View className="bg-white rounded-xl mx-2 mb-4">
        <View className="flex p-4 pb-0 flex-col bg-white rounded-xl">
          <View className="flex w-full">
            <Image
              source={{ uri: upcomingEvent.event?.image }}
              className="rounded-lg w-full h-[160px]"
              resizeMode="cover"
            />
          </View>
          <View className="flex flex-col w-3/4 mt-2">
            <Text
              numberOfLines={1}
              className="overflow-hidden font-bold text-lg "
            >
              {upcomingEvent.event?.name}
            </Text>
            <Text className="text-primary-500 text-base">{startAt}</Text>
            <Text numberOfLines={1} className="text-secondary-300 text-sm">
              {upcomingEvent.event?.description}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.primary[500]}
              />
              <Text numberOfLines={1} className="text-secondary-300 text-sm">
                {upcomingEvent?.event?.place}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-row justify-between gap-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(nextEventUrl as Href)}
            className="flex bg-white rounded-xl grow p-4 justify-between"
          >
            <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
              <Image
                source={require("../../assets/images/ticket.png")}
                style={{ width: 50, height: 50 }}
              />
            </View>
            <View className="ml-2">
              <Text className="text-xs text-secondary-300">
                {user?.tickets?.filter(
                  (drink: any) => drink.event.id === upcomingEvent?.event?.id
                )?.length ?? 0}{" "}
                Disponibles
              </Text>
              <Text className="font-bold">Tickets</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                `/(dashboard)/events/${upcomingEvent.event?.id}/drinks`
              )
            }
            className="flex bg-white rounded-xl grow p-4 justify-between"
          >
            <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
              <Image
                source={require("../../assets/images/glass.png")}
                style={{ width: 50, height: 50 }}
              />
            </View>
            <View className="ml-2">
              <Text className="text-xs text-secondary-300">
                {user?.drinks?.filter(
                  (drink: any) => drink.event.id === upcomingEvent?.event?.id
                )?.length ?? 0}{" "}
                Disponibles
              </Text>
              <Text className="font-bold">Tragos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UpcomingEventCard;
