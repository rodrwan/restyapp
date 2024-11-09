import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import EmptyState from "@/components/EmptyState";
import useGetEventsWithPagination from "@/hooks/useGetEvents";
import { router } from "expo-router";

const sortByStartAt = (a: any, b: any) => {
  const AsplittedStartAt = a.start_at.split(" ");
  const AstartHour = a.start_hour.split("T")[1];
  const AjoinedStartAt =
    AsplittedStartAt[0] + " " + AstartHour.replace("Z", "");

  const BsplittedStartAt = b.start_at.split(" ");
  const BstartHour = b.start_hour.split("T")[1];
  const BjoinedStartAt =
    BsplittedStartAt[0] + " " + BstartHour.replace("Z", "");

  return (
    new Date(BjoinedStartAt).getTime() - new Date(AjoinedStartAt).getTime()
  );
};

const HomePage = () => {
  const { data, refetch } = useGetEventsWithPagination();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const height = Dimensions.get("window").width - 16;

  return (
    <View className="flex h-full bg-secondary-500">
      <FlatList
        className="p-2"
        data={data.sort(sortByStartAt)}
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
              onPress={() => router.push(`/(events)/${item.id}`)}
              className="bg-white rounded-3xl mb-4"
            >
              <View
                className="bg-white rounded-3xl"
                style={{ height: height - 16 }}
              >
                <Image
                  source={{ uri: item?.image }}
                  className="w-full h-full rounded-3xl"
                  resizeMode="cover"
                />
              </View>
              <View className="py-8 px-4 gap-4">
                <Text className="font-bold text-xl">{item.name}</Text>
                <Text className="text-xl text-primary-500">{startAt}</Text>
                <Text className="text-md text-secondary-300">
                  Desde $
                  {Number(item?.items?.[0]?.price).toLocaleString("es-CL")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        // ListHeaderComponent={() => (
        //   <View className="flex justify-center">
        //     <View className="flex-row items-center bg-white border border-primary-100 rounded-md mb-4">
        //       <Ionicons
        //         name="search"
        //         size={24}
        //         color={Colors.secondary[300]}
        //         style={{ marginLeft: 8 }}
        //       />
        //       <TextInput
        //         placeholder="Buscar evento"
        //         className="p-4 w-full bg-primary text-secondary-300"
        //       />
        //     </View>
        //     {data?.length > 0 ? (
        //       <Text className="text-white text-center text-xl font-bold pb-4">
        //         Mas Eventos
        //       </Text>
        //     ) : null}
        //   </View>
        // )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aún no hay eventos"
            subtitle="No se han creado eventos"
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
