import React, { useMemo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { UpcomingEvent as UpcomingEventType } from "./types";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface UpcomingEventProps {
  upcomingEvent: UpcomingEventType;
}

const HomeUpcomingEvent: React.FC<UpcomingEventProps> = React.memo(
  ({ upcomingEvent }) => {
    const { event } = upcomingEvent;
    const eventAddress = useMemo(() => {
      return event?.place;
    }, [event?.place]);

    // Early return if event is not available
    if (!event) {
      return null; // Don't show anything if no event
    }

    return (
      <TouchableOpacity
        onPress={() => router.push(`/(dashboard)/events/${event?.id}`)}
        activeOpacity={0.8}
      >
        <View
          className="flex"
          style={{
            shadowColor: Colors.secondary[300],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          <View className="mb-4">
            <Text className="text-white font-bold text-2xl mx-2">
              ¡Ya casi es hora!{" "}
              <Ionicons
                name="sparkles-outline"
                size={24}
                color={Colors.primary[500]}
              />
            </Text>
          </View>
          <View className="rounded-xl mx-2 mb-4 border border-secondary-300">
            <View className="flex pb-0 flex-col rounded-xl pb-4 bg-secondary-50">
              <View className="flex w-full">
                <Image
                  source={{ uri: event?.image }}
                  className="rounded-xl w-full h-[100px]"
                  resizeMode="cover"
                />
              </View>
              <View className="flex flex-col mt-2 px-2 h-[44px]">
                <Text
                  numberOfLines={1}
                  className="text-secondary-400 overflow-hidden font-bold text-lg"
                >
                  {event?.name}
                </Text>
                <View className="flex flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    className="text-secondary-300 text-sm"
                  >
                    {eventAddress ?? ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

export default HomeUpcomingEvent;
