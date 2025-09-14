import {
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  View,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

import Colors from "@/constants/Colors";
import useUserStore from "@/stores/useUser";
import EmptyState from "@/components/EmptyState";
import ScalingDots from "@/components/ScalingDots";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import useGetCourtesies from "@/hooks/useGetCourtesies";
import { Courtesy, Event } from "@/components/dashboard/types";

// Animaciones
const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

// Funciones helper
const formatEventDate = (startAt: string): string => {
  try {
    const splittedStartAt = startAt.split(" ");
    const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
    return new Date(joinedStartAt).toLocaleString("es-CL", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
};

const filterCourtesiesByEvent = (
  courtesies: Courtesy[] | null,
  eventId: string
): Courtesy[] => {
  if (!courtesies) return [];
  return courtesies.filter((courtesy) => courtesy.event?.id === eventId);
};

const filterValidatedCourtesies = (courtesies: Courtesy[]): Courtesy[] => {
  return courtesies.filter((courtesy) => courtesy.is_validated);
};

const filterUnvalidatedCourtesies = (courtesies: Courtesy[]): Courtesy[] => {
  return courtesies.filter((courtesy) => !courtesy.is_validated);
};

const Courtesies = () => {
  const { eventId } = useLocalSearchParams();
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { user, updateTicket } = useUserStore();
  const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;
  const {
    data: courtesies,
    isLoadingGetCourtesies,
    error,
    getCourtesies,
  } = useGetCourtesies(eventIdString || "");

  // Memoizar las cortesías filtradas
  const eventCourtesies = useMemo(() => {
    return filterCourtesiesByEvent(user?.courtesies, eventIdString || "");
  }, [user?.courtesies, eventIdString]);

  const unvalidatedCourtesies = useMemo(() => {
    return filterUnvalidatedCourtesies(eventCourtesies);
  }, [eventCourtesies]);

  const validatedCourtesies = useMemo(() => {
    return filterValidatedCourtesies(eventCourtesies);
  }, [eventCourtesies]);

  const [activeItem, setActiveItem] = React.useState<Courtesy | null>(
    unvalidatedCourtesies[0] || null
  );

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
  }, [navigation]);

  // Early return si no hay cortesías
  if (
    !user?.courtesies ||
    eventCourtesies.length === 0 ||
    isLoadingGetCourtesies
  ) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]}>
        <SafeAreaView className="flex h-full">
          <View className="flex-1 justify-center items-center">
            <EmptyState
              title="No tienes cortesías"
              subtitle="Aún no tienes cortesías disponibles para este evento"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Callback para manejar la obtención de cortesías
  const handleGetCourtesies = useCallback(async () => {
    try {
      await getCourtesies();
    } catch (error) {
      console.error("Error al obtener cortesía:", error);
    }
  }, [getCourtesies]);

  // Effect para el polling de cortesías
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (!courtesies?.is_validated && activeItem?.id) {
      intervalId = setInterval(() => {
        handleGetCourtesies();
      }, 10 * 1000) as unknown as NodeJS.Timeout;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeItem?.id, courtesies?.is_validated, handleGetCourtesies]);

  // Effect para actualizar el ticket cuando cambia la cortesía
  React.useEffect(() => {
    if (courtesies) {
      updateTicket(courtesies as any);
      if (courtesies.is_validated) {
        Toast.show({
          type: "success",
          text1: "QR validado con éxito",
        });
      }
    }
  }, [courtesies, updateTicket]);

  const viewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].item);
      }
    },
    []
  );

  // Callback para navegar a comprar
  const handleBuyPress = useCallback(() => {
    if (eventId) {
      router.push(`/(dashboard)/events/${eventId}/buy`);
    }
  }, [eventId]);

  // Mostrar loading si está cargando
  if (isLoadingGetCourtesies) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]}>
        <SafeAreaView className="flex h-full">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text className="text-white mt-4">Cargando cortesías...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Mostrar error si hay un error
  if (error) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]}>
        <SafeAreaView className="flex h-full">
          <View className="flex-1 justify-center items-center px-4">
            <Ionicons
              name="alert-circle"
              size={64}
              color={Colors.secondary[400]}
            />
            <Text className="text-white text-lg font-bold mt-4 text-center">
              Error al cargar cortesías
            </Text>
            <Text className="text-gray-400 text-center mt-2">{error}</Text>
            <TouchableOpacity
              onPress={() => {
                // Refetch data
                if (eventId) {
                  // Trigger refetch
                  router.replace(`/(dashboard)/events/${eventId}/courtesies`);
                }
              }}
              className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Reintentar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#041e2b"]}
    >
      <SafeAreaView className="flex h-full">
        <ScrollView className="flex h-full mt-16">
          {/* next events */}
          <View className="flex mx-2">
            <Text className="text-white font-bold text-xl mx-2">
              Tus Tragos
            </Text>
            <View className="rounded-xl">
              <FlatList
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  {
                    useNativeDriver: false,
                  }
                )}
                className="p-2"
                data={unvalidatedCourtesies}
                onViewableItemsChanged={viewableItemsChanged}
                contentOffset={{ x: 0, y: 0 }}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 70,
                }}
                keyExtractor={(item: Courtesy) => item.id}
                contentContainerStyle={{
                  alignItems: "stretch",
                }}
                renderItem={({ item }: { item: Courtesy }) => {
                  const startAt = formatEventDate(item.event.start_at);

                  return (
                    <Animatable.View
                      style={{ width: Dimensions.get("window").width - 30 }}
                      className="mr-4 bg-white rounded-xl p-4"
                      animation={
                        activeItem?.id !== item.id ? zoomIn : (zoomOut as any)
                      }
                      duration={500}
                    >
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
                            </View>
                          </View>
                        </View>
                      </View>
                      <View className="flex p-2 flex-col bg-white rounded-xl items-center justify-center mb-4">
                        <Text className="font-bold text-base mb-4 ">
                          {item.name}
                        </Text>
                        {item.is_validated ? (
                          <View className="w-full py-2 bg-primary-400 justify-center items-center rounded-xl mb-4">
                            <Text className="font-bold">Validado</Text>
                          </View>
                        ) : (
                          <Image
                            source={{
                              uri: `data:image/png;base64,${item.base64}`,
                            }}
                            className="w-[200px] h-[200px] mb-4"
                          />
                        )}
                      </View>
                    </Animatable.View>
                  );
                }}
                ListEmptyComponent={() => (
                  <EmptyState
                    title="No tienes cortesías"
                    subtitle="Aún no tienes cortesías disponibles"
                  />
                )}
              />
            </View>
            <ScalingDots
              data={unvalidatedCourtesies}
              scrollX={scrollX}
              inActiveDotColor={Colors.secondary[400]}
              activeDotColor={Colors.secondary[500]}
            />
          </View>
          <View className="flex flex-row justify-between mt-4 mx-4">
            <TouchableOpacity
              onPress={handleBuyPress}
              className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-full"
            >
              <Text className="font-bold text-secondary-500">Comprar</Text>
            </TouchableOpacity>
          </View>

          {validatedCourtesies?.length > 0 && (
            <View className="mt-4 mx-4">
              <Text className="text-white font-bold text-xl">
                Tus cortesías validadas
              </Text>
              <View className="bg-white rounded-xl mt-2">
                <FlatList
                  scrollEnabled={false}
                  data={validatedCourtesies}
                  keyExtractor={(item: Courtesy) => item.id}
                  renderItem={({ item }: { item: Courtesy }) => {
                    return (
                      <View className="flex flex-row bg-white rounded-xl p-2">
                        <View className="flex w-1/4 justify-center items-start">
                          <Image
                            source={{ uri: item.event.image }}
                            className="rounded-lg w-[60px] h-[60px]"
                          />
                        </View>
                        <View className="w-1/2 -ml-4">
                          <View className="flex flex-col justify-center items-center align-center h-[60px]">
                            <Text
                              numberOfLines={1}
                              className="overflow-hidden font-bold text-md "
                            >
                              {item.name}
                            </Text>
                            {item?.description && (
                              <Text
                                numberOfLines={2}
                                className="text-secondary-300 text-sm"
                              >
                                {item.description}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View className="w-1/4 ml-4">
                          <TouchableOpacity
                            onPress={handleBuyPress}
                            className="flex bg-primary-500 w-full h-[70px] items-center justify-center rounded-lg p-1"
                          >
                            <Text className="text-white font-semibold text-center">
                              Volver a comprar
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                  ListEmptyComponent={() => (
                    <EmptyState
                      title="No tienes cortesías"
                      subtitle="Aún no tienes cortesías disponibles"
                    />
                  )}
                />
              </View>
            </View>
          )}
        </ScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Courtesies;
