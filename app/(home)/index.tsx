import {
  View,
  FlatList,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import EmptyState from "@/components/EmptyState";
import useGetEventsWithPagination from "@/hooks/useGetEvents";
import { Event } from "./types";
import { sortByStartAt } from "./utils";
import EventCard from "./components/EventCard";
import { Link } from "expo-router";

export default function HomePage() {
  const { data, refetch } = useGetEventsWithPagination();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const imageHeight = width - 32; // 16px padding on each side

  const sortedEvents = data?.sort(sortByStartAt);

  return (
    <LinearGradient colors={["#04121A", "#092838"]} className="flex-1">
      <View className="flex-1">
        <FlatList
          className="p-2"
          data={sortedEvents}
          keyExtractor={(item: Event) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} imageHeight={imageHeight} />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="Aún no hay eventos"
              subtitle="No se han creado eventos"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
        <Link href="/(cart)/success?orderId=5e6f42e7-76c7-462f-ac64-be9020c408bc">
          Success
        </Link>
      </View>
    </LinearGradient>
  );
}
