import { View, FlatList, useWindowDimensions, Text } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthContext } from "@/context/AuthProvider";
import useUserStore from "@/stores/useUser";
import { useSession as useSessionStore } from "@/stores/useSession";

import HomeUpcomingEvent from "@/components/dashboard/HomeUpcomingEvent";
import FoodFlatList from "@/components/food/FoodFlatList";
import EmptyState from "@/components/EmptyState";

import useGetEventsWithPagination from "@/hooks/useGetEvents";
import useGetUserUpcomingEvents from "@/hooks/useGetUserUpcomingEvents";

import { Event } from "./types";
import { sortByStartAt } from "./utils";
import EventCard from "./components/EventCard";

export default function HomePage() {
  const { data, refetch } = useGetEventsWithPagination();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const { session } = useAuthContext();
  const { isAuthenticated } = useSessionStore();
  const { upcomingEvents } = useUserStore();
  const { getUserUpcomingEvents } = useGetUserUpcomingEvents();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // If session is active then get the upcoming event
  // useAuth en _layout.tsx ya se encarga de verificar la validez de la sesión
  React.useEffect(() => {
    if (isAuthenticated) {
      getUserUpcomingEvents();
    }
  }, [isAuthenticated, getUserUpcomingEvents]);

  const imageHeight = useMemo(() => width - 32, [width]); // 16px padding on each side
  const sortedEvents = useMemo(() => (data ?? []).sort(sortByStartAt), [data]);

  // featured events section data up to 3 events
  // const featuredEvents = sortedEvents.slice(0, 3);
  // events section data from 3 to the end

  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <View className="p-2">
        <EventCard event={item} imageHeight={imageHeight} />
      </View>
    ),
    [imageHeight]
  );

  const renderHeader = useCallback(
    () => (
      <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
        <Text className="text-white font-bold text-2xl mx-2">
          ¿Tienes planes para hoy?
        </Text>
      </View>
    ),
    []
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        title="El sistema aún no ha encontrado nuevos eventos"
        subtitle="Próximamente acá aparecerán los eventos que disfrutarás"
      />
    ),
    []
  );

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      {session && upcomingEvents?.length > 0 ? ( // if session is true and we have data, show the upcomming event section
        <HomeUpcomingEvent upcomingEvents={upcomingEvents} />
      ) : null}
      <FoodFlatList />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 16 }}
        data={sortedEvents}
        keyExtractor={(item: Event) => item?.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </LinearGradient>
  );
}
