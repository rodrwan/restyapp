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
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import EmptyState from "@/components/EmptyState";
import useUserStore from "@/stores/useUser";
import useAuthStore from "@/stores/useAuth";

const HomePage = () => {
  const { user } = useUserStore();
  const { auth } = useAuthStore();

  if (!auth.isLogged) {
    return (
      <View className="bg-secondary-500 h-full items-center justify-center">
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 ">
      <ScrollView className="flex h-full -mt-10">
        {/* Profile view */}
        <View className="flex flex-row bg-white rounded-xl mx-2 py-6 px-8 justify-between mb-8">
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
        {/* tickets and drinks */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-white font-bold text-xl mx-2">
              ¡Hola, {user?.firstname}!
            </Text>
          </View>
          <View className="flex flex-row p-2 justify-between gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(dashboard)/tickets")}
              className="flex bg-white rounded-xl grow p-4 justify-between"
            >
              <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
                <Ionicons
                  name="ticket-outline"
                  size={64}
                  color={Colors.primary[500]}
                />
              </View>
              <Text className="text-xs text-secondary-300">
                {user?.tickets?.length} Disponibles
              </Text>
              <Text className="font-bold">Mis Tickets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(dashboard)/drinks")}
              className="flex bg-white rounded-xl grow p-4 justify-between"
            >
              <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
                <Ionicons
                  name="wine-outline"
                  size={64}
                  color={Colors.primary[500]}
                />
              </View>
              <Text className="text-xs text-secondary-300">
                {user?.drinks?.length} Disponibles
              </Text>
              <Text className="font-bold">Mis Tragos</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* next events */}
        <View className="flex mx-2">
          <View className="mb-4">
            <Text className="text-white font-bold text-xl mx-2">
              Tus próximos eventos
            </Text>
          </View>
          <View className="bg-white rounded-xl mx-2">
            <FlatList
              scrollEnabled={false}
              className="p-2"
              data={user?.events}
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
                return (
                  <View className="flex p-2 flex-row bg-white rounded-xl">
                    <View className="flex w-1/4">
                      <Image
                        source={{ uri: item.image }}
                        className="rounded-lg w-[90px] h-[100px]"
                      />
                    </View>
                    <View className="flex flex-col w-3/4 pl-2">
                      <View className="flex flex-row">
                        <View className="flex flex-wrap grow">
                          <Text className="font-bold text-lg">{item.name}</Text>
                          <Text className="text-primary-500 text-base">
                            {startAt}
                          </Text>
                          <Text className="text-secondary-300 text-sm">
                            {item.description}
                          </Text>
                        </View>
                        <View className="">
                          <TouchableOpacity
                            onPress={() =>
                              router.push(`/(dashboard)/tickets/${item.id}`)
                            }
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
                      <Text className="flex self-center text-secondary-300 text-xs mt-1">
                        ID: {item.id}
                      </Text>
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
                    <TouchableOpacity
                      onPress={() => router.push("/(dashboard)/events")}
                      className="flex bg-white border rounded-xl p-4 items-center"
                    >
                      <Text className="font-bold">Ver todos</Text>
                    </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
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
