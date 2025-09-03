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
  console.log("data", data);
  const sortedEvents = data?.sort(sortByStartAt);

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
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
              title="El sistema aún no ha encontrado nuevos eventos"
              subtitle="Próximamente acá aparecerán los eventos que disfrutarás"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </LinearGradient>
  );
}
