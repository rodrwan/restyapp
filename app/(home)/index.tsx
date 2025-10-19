import {
  View,
  FlatList,
  useWindowDimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthProvider";
import useUserStore from "@/stores/useUser";
import { useSession as useSessionStore } from "@/stores/useSession";

import HomeUpcomingEvent from "@/components/dashboard/HomeUpcomingEvent";
import FoodFlatList from "@/components/food/FoodFlatList";
import EmptyState from "@/components/EmptyState";

import { Event } from "./types";
import { sortByStartAt } from "./utils";
import EventCard from "./components/EventCard";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useGetPopularRestaurants from "@/hooks/useGetPopularRestaurants";
import LoadingScreen from "@/components/LoadingScreen";

export default function HomePage() {
  const {
    data: popularRestaurants,
    loading: loadingPopularRestaurants,
    refetch: refetchPopularRestaurants,
  } = useGetPopularRestaurants();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const { session } = useAuthContext();
  const { isAuthenticated } = useSessionStore();
  const { upcomingEvents } = useUserStore();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchPopularRestaurants();
    setRefreshing(false);
  }, [refetchPopularRestaurants]);

  // // If session is active then get the upcoming event
  // // useAuth en _layout.tsx ya se encarga de verificar la validez de la sesión
  // React.useEffect(() => {
  //   if (isAuthenticated) {
  //     getUserUpcomingEvents();
  //   }
  // }, [isAuthenticated, getUserUpcomingEvents]);

  const imageHeight = useMemo(() => width - 32, [width]); // 16px padding on each side
  // const sortedEvents = useMemo(() => (data ?? []).sort(sortByStartAt), [data]);

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
    <LinearGradient
      colors={[Colors.black[100], Colors.white]}
      className="flex-1"
    >
      <ScrollView className="flex-1 mb-16">
        <FoodFlatList />
        {session && upcomingEvents?.length > 0 ? ( // if session is true and we have data, show the upcomming event section
          <HomeUpcomingEvent upcomingEvents={upcomingEvents} />
        ) : null}
        {/* FlatList horizontal de restaurantes mockup */}
        <View className="mt-6 mb-4">
          <Text className="text-black font-bold text-xl mx-4 mb-2">
            Restaurantes populares
          </Text>
          {/* FlatList horizontal con data dummy */}
          {loadingPopularRestaurants ? (
            <LoadingScreen message="Cargando restaurantes populares..." />
          ) : (
            <FlatList
              horizontal
              data={popularRestaurants ?? []}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/(rest)/${item.id}`);
                  }}
                >
                  <View className="bg-white rounded-2xl border border-secondary-200 shadow-sm blur-sm shadow-secondary-100 elevation-5 w-40 mr-4">
                    <Image
                      source={{ uri: item.imageUrl }}
                      resizeMode="cover"
                      style={{ width: 160, height: 100 }}
                    />
                    <View className="p-2">
                      <Text
                        className="text-base font-semibold text-black"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <View className="flex flex-row items-center mt-2">
                        <Ionicons
                          name="star"
                          size={16}
                          color={Colors.primary[500]}
                        />
                        <Text className="text-base text-secondary-500 ml-1">
                          {item.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <View className="mb-4">
          <Text className="text-black font-bold text-xl mx-4 mb-2">
            Eventos cercanos
          </Text>
          <FlatList
            data={[
              {
                id: "1",
                name: "Festival de la Comida",
                image:
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Evento/crowd
              },
              {
                id: "2",
                name: "Noche de Tacos",
                image:
                  "https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&w=400&q=80", // Tacos/Noche de Tacos
              },
              {
                id: "3",
                name: "Cata de Vinos",
                image:
                  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", // Wine tasting
              },
              {
                id: "4",
                name: "Expo Veggie",
                image:
                  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // Veggie event/flyer
              },
              {
                id: "5",
                name: "Sushi Night",
                image:
                  "https://images.unsplash.com/photo-1467348733814-f93fc480bec6?auto=format&fit=crop&w=400&q=80", // Sushi event/flyer
              },
            ]}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => (
              <View
                key={item.id}
                className="bg-white rounded-2xl border border-secondary-200 shadow-sm blur-sm shadow-secondary-100 elevation-5 w-40 mr-4"
              >
                <Image
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={{ width: 160, height: 100 }}
                />
                <View className="p-2 flex-1 justify-between">
                  <Text
                    className="text-base font-semibold text-black mb-2"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    className="bg-primary-600 rounded-full py-2 px-4 self-end"
                    onPress={() => {
                      // Aquí puedes implementar la navegación al detalle del evento
                      // Por ejemplo: router.push(`/events/${item.id}`)
                    }}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-base">
                      Ver más
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
