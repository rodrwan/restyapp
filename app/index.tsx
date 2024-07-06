import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import EmptyState from "@/components/EmptyState";
import useGetEventsWithPagination from "@/hooks/useGetEvents";
import { router } from "expo-router";

const HomePage = () => {
  const { data, refetch } = useGetEventsWithPagination();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex h-full bg-secondary-500 ">
      <FlatList
        className="p-2"
        data={data}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => {
          const splittedStartAt = item.start_at.split(" ");
          const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
          const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
          return (
            <TouchableOpacity
              onPress={() => router.push(`/events/${item.id}`)}
              className="bg-white rounded-3xl mb-4"
            >
              <View className="bg-white rounded-3xl h-[250px]">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full rounded-3xl"
                  resizeMode="cover"
                />
              </View>
              <View className="py-8 px-4 gap-4">
                <Text className="font-bold text-xl">{item.name}</Text>
                <Text className="text-xl text-primary-500">{startAt}</Text>
                <Text className="text-md text-secondary-300">
                  Desde ${item?.items[0]?.price}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => (
          <View className="flex justify-center">
            {/* <View className="h-[250px] border border-primary-100 rounded-md mb-4">
              <Text>Hero</Text>
            </View> */}
            <View className="flex-row items-center bg-white border border-primary-100 rounded-md mb-4">
              <Ionicons
                name="search"
                size={24}
                color={Colors.secondary[300]}
                style={{ marginLeft: 8 }}
              />
              <TextInput
                placeholder="Buscar evento"
                className="p-4 w-full bg-primary text-secondary-300"
              />
            </View>
            <Text className="text-white text-center text-xl font-bold">
              Mas Eventos
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aún no hay post"
            subtitle="No se han creado posts"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        //   onEndReached={fetchNextPage}
        //   onEndReachedThreshold={0.8}
        //   ListFooterComponent={ListEndLoader}
      />
    </View>
  );
};

export default HomePage;
