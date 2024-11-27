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
  RefreshControl,
} from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import EmptyState from "@/components/EmptyState";
import useUserStore from "@/stores/useUser";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useGetUserFirstUpcomingEvent from "@/hooks/useGetUserFirstUpcomingEvent";
import { LinearGradient } from "expo-linear-gradient";

const HomePage = () => {
  const { loadingUpcomingEvent, getUserFirstUpcomingEvent } =
    useGetUserFirstUpcomingEvent();
  const { user, upcomingEvent } = useUserStore();
  const { loadingGetEvents, getEvents } = useGetEventsFromUser();

  React.useEffect(() => {
    getEvents();
    getUserFirstUpcomingEvent();
  }, []);

  const onRefreshUserFirstUpcomingEvent = () => {
    getUserFirstUpcomingEvent();
  };
  // const isFocused = useIsFocused();
  // React.useEffect(() => {
  //   if (isFocused && auth.isLogged) {
  //     getEvents();
  //     getUserFirstUpcomingEvent();
  //   }
  // }, [isFocused, auth]);

  if (loadingGetEvents && loadingUpcomingEvent) {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={["#04121A", "#092838"]}
        className="flex h-full"
      >
        <View className="h-full items-center justify-center">
          <ActivityIndicator size={"small"} />
        </View>
      </LinearGradient>
    );
  }

  const splittedStartAt = upcomingEvent?.event?.start_at.split(" ");
  const joinedStartAt = splittedStartAt?.[0] + " " + splittedStartAt?.[1];
  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const nextEvents = user?.events
    ?.filter((event: any) => event.id !== upcomingEvent?.event?.id)
    ?.filter((event: any) => {
      const splittedStartAt = event?.start_at.split(" ");
      const joinedStartAt = splittedStartAt?.[0] + " " + splittedStartAt?.[1];
      return new Date(joinedStartAt).getTime() < new Date().getTime();
    });

  const nextEventUrl: string = `/(dashboard)/events/${upcomingEvent?.event?.id}`;

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#092838"]}
    >
      <ScrollView
        className="flex h-full pt-4"
        refreshControl={
          <RefreshControl
            refreshing={loadingUpcomingEvent}
            onRefresh={onRefreshUserFirstUpcomingEvent}
          />
        }
      >
        {!user?.events?.length && (
          <EmptyState
            title="No tienes eventos"
            subtitle="No tienes próximos eventos"
          />
        )}

        {/* next event */}
        {upcomingEvent?.event?.id && (
          <UpcomingEventMemo
            upcomingEvent={upcomingEvent}
            user={user}
            nextEventUrl={nextEventUrl}
            startAt={startAt}
          />
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
                renderItem={({ item, index }: any) => {
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
                    <View
                      className={`flex p-2 flex-row bg-white rounded-xl ${
                        index % 2 === 0 ? "border-b border-b-secondary-100" : ""
                      }`}
                    >
                      <View className="flex w-1/4">
                        <Image
                          source={{ uri: item.image }}
                          className="rounded-lg w-[80px] h-[80px]"
                        />
                      </View>
                      <View className="flex flex-col w-2/4 pl-2 -ml-1 mr-2">
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
              />
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
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

const UpcomingEventMemo = ({
  upcomingEvent,
  user,
  nextEventUrl,
  startAt,
}: any) =>
  React.useMemo(
    () => (
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
              <Text className="text-primary-500 text-base font-semibold">
                {startAt}
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Text numberOfLines={1} className="text-secondary-300 text-sm">
                  {[upcomingEvent?.event?.address, upcomingEvent?.event?.place]
                    .join(" ")
                    .trim()}
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
                  {user?.tickets
                    ?.filter(
                      (drink: any) =>
                        drink.event.id === upcomingEvent?.event?.id
                    )
                    ?.filter((drink: any) => !drink?.isValidated)?.length ??
                    0}{" "}
                  Disponibles
                </Text>
                <Text className="font-bold">Entradas</Text>
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
                  {user?.drinks
                    ?.filter(
                      (drink: any) =>
                        drink.event.id === upcomingEvent?.event?.id
                    )
                    ?.filter((drink: any) => !drink?.isValidated)?.length ??
                    0}{" "}
                  Disponibles
                </Text>
                <Text className="font-bold">Consumo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [upcomingEvent, user, nextEventUrl, startAt]
  );
