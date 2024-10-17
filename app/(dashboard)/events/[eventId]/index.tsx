import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import useUserStore from "@/stores/useUser";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const TicketPage = () => {
  const { eventId }: any = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUserStore();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/menu")}>
          <Ionicons name="menu" size={32} color={Colors.primary[500]} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (!user?.tickets) {
    return;
  }

  const item: any = user?.tickets.find(
    (item: any) => item.event.id === eventId
  );

  const splittedStartAt = item.event.start_at.split(" ");
  const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 ">
      <ScrollView className="flex h-full mt-16">
        {/* next events */}
        <View className="flex mx-2 h-full">
          <View className="rounded-xl">
            <View className="mr-4 bg-white rounded-xl p-4 w-full">
              <View className="flex flex-row bg-white rounded-xl mb-6">
                <View className="flex">
                  <Image
                    source={{ uri: item.event.image }}
                    className="rounded-lg w-[90px] h-[100px]"
                  />
                </View>
                <View className="flex flex-col pl-2">
                  <View className="flex flex-row">
                    <View className="flex flex-wrap grow">
                      <Text className="font-bold text-lg">
                        {item.event.name}
                      </Text>
                      <Text className="text-primary-500 text-base">
                        {startAt}
                      </Text>
                      <Text className="text-secondary-300 text-sm">
                        {item.event.description}
                      </Text>
                      <Text className="text-secondary-300 text-sm">
                        {item.event.place}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex p-2 flex-col bg-white rounded-xl items-center justify-center">
                <Text className="font-bold mb-8 text-base">{item.name}</Text>
                <Image
                  source={{
                    uri: `data:image/png;base64,${item.base64}`,
                  }}
                  className="w-[200px] h-[200px] mb-8"
                />
              </View>
            </View>
            <View className="flex flex-row justify-between gap-2 mt-4">
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(dashboard)/events/${eventId}/drinks`)
                }
                className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-[45%]"
              >
                <Text className="font-bold text-secondary-500">Mis tragos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(dashboard)/events/${eventId}/buy`)
                }
                className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-[45%]"
              >
                <Text className="font-bold text-secondary-500">
                  Comprar tragos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TicketPage;
