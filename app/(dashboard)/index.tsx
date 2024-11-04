import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { UserInfoSkeleton } from "./skeletons/home";
import Colors from "@/constants/Colors";
import EmptyState from "@/components/EmptyState";
import useUserStore from "@/stores/useUser";
import useAuthStore from "@/stores/useAuth";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";

const HomePage = () => {
  const { user, upcomingEvent, upcomingEventFetched } = useUserStore();
  const { auth } = useAuthStore();
  const { getEvents, getUserFirstUpcomingEvent } = useGetEventsFromUser();

  const isFocused = useIsFocused();
  React.useEffect(() => {
    console.log("refresh", isFocused);
    if (isFocused) {
      getEvents() < getUserFirstUpcomingEvent();
    }
  }, [isFocused]);
  if (!auth.isLogged) {
    return (
      <View className="bg-secondary-500 h-full items-center justify-center">
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  if (!upcomingEventFetched) {
    return (
      <View className="bg-secondary-500 h-full items-center justify-center">
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  const nextEvents = user?.events?.filter(
    (event: any) => event.id !== upcomingEvent?.event?.id
  );

  const splittedStartAt = upcomingEvent?.event?.start_at.split(" ");
  const joinedStartAt = splittedStartAt?.[0] + " " + splittedStartAt?.[1];
  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
  const nextEventUrl: string = `/(dashboard)/events/${upcomingEvent?.event?.id}`;

  return (
    <ScrollView className="flex h-full bg-secondary-500 ">
      {/* Profile view */}
      {!Boolean(user) ? (
        <UserInfoSkeleton />
      ) : (
        <View className="flex flex-row bg-white rounded-xl mx-4 py-6 px-8 justify-between mb-4">
          <View className="">
            <Image
              source={{ uri: user?.picture }}
              className="w-[80px] h-[80px] rounded-full shadow-2xl"
              style={styles.elevationLow}
            />
          </View>
          <View className="justify-center -ml-8">
            <Text className="text-base ">
              {user?.firstname} {user?.lastname}
            </Text>
            <Text className="text-base ">{user?.dni}</Text>
            <Text className="text-xs text-secondary-200 ">{user?.email}</Text>
          </View>
          <View className="">
            <Ionicons
              name="settings-outline"
              size={24}
              color={Colors.primary[500]}
            />
          </View>
        </View>
      )}

      {!user?.events?.length && (
        <EmptyState
          title="No tienes eventos"
          subtitle="No tienes próximos eventos"
        />
      )}
      {/* next event */}
      {upcomingEvent?.event?.id && (
        <View className="flex mx-2">
          <View className="mb-4">
            <Text className="text-white font-bold text-xl mx-2">
              Tu próximo evento
            </Text>
          </View>
          <View className="bg-white rounded-xl mx-2 mb-4">
            <View className="flex p-4 pb-0 flex-row bg-white rounded-xl">
              <View className="flex w-1/4">
                <Image
                  source={{ uri: upcomingEvent.event?.image }}
                  className="rounded-lg w-[90px] h-[100px]"
                />
              </View>
              <View className="flex flex-col w-3/4 ml-4">
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
                  <Text
                    numberOfLines={1}
                    className="text-secondary-300 text-sm"
                  >
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
                  <Ionicons
                    name="ticket-outline"
                    size={64}
                    color={Colors.primary[500]}
                  />
                </View>
                <View className="ml-2">
                  <Text className="text-xs text-secondary-300">
                    {user?.tickets?.filter(
                      (drink: any) =>
                        drink.event.id === upcomingEvent?.event?.id
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
                  <Ionicons
                    name="wine-outline"
                    size={64}
                    color={Colors.primary[500]}
                  />
                </View>
                <View className="ml-2">
                  <Text className="text-xs text-secondary-300">
                    {user?.drinks?.filter(
                      (drink: any) =>
                        drink.event.id === upcomingEvent?.event?.id
                    )?.length ?? 0}{" "}
                    Disponibles
                  </Text>
                  <Text className="font-bold">Tragos</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* tickets and drinks */}

      {/* next events */}
      {nextEvents && nextEvents!.length > 0 && (
        <View className="flex mx-2">
          <View className="mb-4">
            <Text className="text-white font-bold text-xl mx-2">
              Próximamente
            </Text>
          </View>
          <View className="bg-white rounded-xl mx-2">
            <FlatList
              scrollEnabled={false}
              className="p-2"
              data={nextEvents}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => {
                const splittedStartAt = item.start_at.split(" ");
                const joinedStartAt =
                  splittedStartAt[0] + " " + splittedStartAt[1];
                const startAt = new Date(joinedStartAt).toLocaleString(
                  "es-CL",
                  {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  }
                );
                const url: string = `/(dashboard)/events/${item.id}`;
                return (
                  <View className="flex p-2 flex-row bg-white rounded-xl">
                    <View className="flex w-1/4">
                      <Image
                        source={{ uri: item.image }}
                        className="rounded-lg w-[90px] h-[100px]"
                      />
                    </View>
                    <View className="flex flex-col w-2/4 pl-2 ml-2">
                      <View className="flex flex-row">
                        <View className="">
                          <Text
                            numberOfLines={1}
                            className="overflow-hidden font-bold text-lg "
                          >
                            {item.name}
                          </Text>
                          <Text className="text-primary-500 text-base">
                            {startAt}
                          </Text>
                          <Text
                            numberOfLines={2}
                            className="text-secondary-300 text-sm"
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="w-1/4">
                      <TouchableOpacity
                        onPress={() => router.push(url as Href)}
                        className="flex bg-primary-500 w-[80px] h-[80px] items-center justify-center rounded-lg"
                      >
                        <Text className="text-white font-semibold mb-4">
                          Ver
                        </Text>
                        <Text className="text-white font-semibold ">
                          Evento
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={() => (
                <EmptyState
                  title="No tienes eventos"
                  subtitle="No tienes próximos eventos"
                />
              )}
              ListFooterComponent={() => {
                return (
                  <View className="flex p-2 mt-4">
                    {/* <TouchableOpacity
                      onPress={() => router.push("/(dashboard)/events")}
                      className="flex bg-white border rounded-xl p-4 items-center"
                    >
                      <Text className="font-bold">Ver todos</Text>
                    </TouchableOpacity> */}
                  </View>
                );
              }}
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              //   onEndReached={fetchNextPage}
              //   onEndReachedThreshold={0.8}
              //   ListFooterComponent={ListEndLoader}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  elevationLow: {
    width: 80,
    height: 80,
    ...Platform.select({
      ios: {
        shadowColor: "#171717",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
