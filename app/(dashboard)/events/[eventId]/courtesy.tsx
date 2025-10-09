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
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

import Colors from "@/constants/Colors";
import useUserStore from "@/stores/useUser";
import EmptyState from "@/components/EmptyState";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import useGetCourtesies from "@/hooks/useGetCourtesies";
import { CourtesyEvent } from "@/components/dashboard/types";

const POLLING_INTERVAL = 30 * 1000; // 30 seconds
// Animaciones
const zoomIn = {
  0: {
    scale: 1,
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
    scale: 1,
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
  courtesies: CourtesyEvent[] | null,
  eventId: string
): CourtesyEvent[] => {
  if (!courtesies) return [];
  return courtesies.filter((courtesy) => courtesy.event?.id === eventId);
};

const filterValidatedCourtesies = (
  courtesies: CourtesyEvent[]
): CourtesyEvent[] => {
  return courtesies.filter((courtesy) => courtesy.courtesy.is_validated);
};

const filterUnvalidatedCourtesies = (
  courtesies: CourtesyEvent[]
): CourtesyEvent[] => {
  return courtesies.filter((courtesy) => !courtesy.courtesy.is_validated);
};

// Componente principal con patrón estable
const Courtesies = () => {
  // Estado local para controlar el renderizado
  const [isReady, setIsReady] = useState(false);
  const [activeItem, setActiveItem] = useState<CourtesyEvent | null>(null);

  // Hooks básicos
  const { eventId } = useLocalSearchParams();
  const { user, updateTicket } = useUserStore();

  // Procesar eventId
  const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;

  // Hook personalizado
  const {
    data: courtesies,
    isLoadingGetCourtesies,
    error,
    getCourtesies,
  } = useGetCourtesies(eventIdString || "");

  // Efecto para establecer ready state
  useEffect(() => {
    if (eventIdString) {
      setIsReady(true);
    }
  }, [eventIdString]);

  // Memoizar las cortesías filtradas
  const eventCourtesies = useMemo(() => {
    return filterCourtesiesByEvent(
      user?.courtesies as CourtesyEvent[],
      eventIdString || ""
    );
  }, [user?.courtesies, eventIdString]);

  const unvalidatedCourtesies = useMemo(() => {
    return filterUnvalidatedCourtesies(eventCourtesies);
  }, [eventCourtesies]);

  const validatedCourtesies = useMemo(() => {
    return filterValidatedCourtesies(eventCourtesies);
  }, [eventCourtesies]);

  // Actualizar activeItem cuando cambien las cortesías
  useEffect(() => {
    if (unvalidatedCourtesies.length > 0 && !activeItem) {
      setActiveItem(unvalidatedCourtesies[0]);
    }
  }, [unvalidatedCourtesies, activeItem]);

  // Callbacks
  const handleGetCourtesies = useCallback(async () => {
    try {
      await getCourtesies();
    } catch (error) {
      console.error("Error al obtener cortesía:", error);
    }
  }, [getCourtesies]);

  const handleBuyPress = useCallback(() => {
    if (eventIdString) {
      router.push(`/(dashboard)/events/${eventIdString}/buy`);
    }
  }, [eventIdString]);

  const viewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].item);
      }
    },
    []
  );

  // Efectos
  useEffect(() => {
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

  // Polling effect
  const intervalRef = React.useRef<number | null>(null);

  useEffect(() => {
    // Limpiar interval existente antes de crear uno nuevo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!courtesies?.is_validated && activeItem?.courtesy.id) {
      intervalRef.current = setInterval(() => {
        handleGetCourtesies();
      }, POLLING_INTERVAL) as unknown as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeItem?.courtesy.id, courtesies?.is_validated]);

  // Early returns
  if (!isReady || !eventIdString) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]}>
        <SafeAreaView className="flex h-full">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text className="text-white mt-4">Cargando...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
                if (eventIdString) {
                  router.replace(
                    `/(dashboard)/events/${eventIdString}/courtesies`
                  );
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

  if (!user?.courtesies || eventCourtesies.length === 0) {
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

  // Renderizado principal
  return (
    <LinearGradient colors={["#04121A", "#041e2b"]}>
      <SafeAreaView className="flex h-full">
        <ScrollView className="flex h-full mt-16">
          <View className="flex mx-2">
            <Text className="text-white font-bold text-xl mx-2">
              Tu cortesía
            </Text>
            <View className="rounded-xl">
              <FlatList
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: { x: new Animated.Value(0) },
                      },
                    },
                  ],
                  { useNativeDriver: false }
                )}
                className="p-2"
                data={unvalidatedCourtesies}
                onViewableItemsChanged={viewableItemsChanged}
                contentOffset={{ x: 0, y: 0 }}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 70,
                }}
                keyExtractor={(item: CourtesyEvent) => item.courtesy.id}
                contentContainerStyle={{
                  alignItems: "stretch",
                }}
                renderItem={({ item }: { item: CourtesyEvent }) => {
                  console.log("item", JSON.stringify(item, null, 2));
                  const startAt = formatEventDate(item.event.start_at);

                  return (
                    <Animatable.View
                      style={{ width: Dimensions.get("window").width - 30 }}
                      className="mr-4 bg-white rounded-xl p-4"
                      animation={
                        activeItem?.courtesy.id !== item.courtesy.id
                          ? zoomIn
                          : (zoomOut as any)
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
                          {item.courtesy.name}
                        </Text>
                        {item.courtesy.is_validated ? (
                          <View className="w-full py-2 bg-primary-400 justify-center items-center rounded-xl mb-4">
                            <Text className="font-bold">Validado</Text>
                          </View>
                        ) : (
                          <Image
                            source={{
                              uri: `data:image/png;base64,${
                                item.courtesy.base64 || ""
                              }`,
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
                  keyExtractor={(item: CourtesyEvent) => item.courtesy.id}
                  renderItem={({ item }: { item: CourtesyEvent }) => {
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
                              {item.courtesy.name}
                            </Text>
                            {item?.courtesy.description && (
                              <Text
                                numberOfLines={2}
                                className="text-secondary-300 text-sm"
                              >
                                {item.courtesy.description}
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
