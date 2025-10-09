import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { UpcomingEvent as UpcomingEventType } from "./types";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface UpcomingEventProps {
  upcomingEvents: UpcomingEventType[];
}

const HomeUpcomingEvent: React.FC<UpcomingEventProps> = React.memo(
  ({ upcomingEvents }) => {
    return (
      <View className="flex w-full h-[240px]">
        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            width: "100%",
          }}
          indicatorStyle="white"
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/(dashboard)`)}
                activeOpacity={0.8}
                className="flex w-full"
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
                          source={{ uri: item?.image }}
                          className="rounded-xl w-full h-[100px]"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex flex-col mt-2 px-2 h-[44px]">
                        <Text
                          numberOfLines={1}
                          className="text-secondary-400 overflow-hidden font-bold text-lg"
                        >
                          {item?.name}
                        </Text>
                        <View className="flex flex-row items-center gap-2">
                          <Text
                            numberOfLines={1}
                            className="text-secondary-300 text-sm"
                          >
                            {item?.place ?? ""}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
);

export default HomeUpcomingEvent;
