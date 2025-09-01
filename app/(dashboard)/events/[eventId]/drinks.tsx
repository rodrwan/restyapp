import {
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  View,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

import Colors from "@/constants/Colors";
import useUserStore from "@/stores/useUser";
import EmptyState from "@/components/EmptyState";
import ScalingDots from "@/components/ScalingDots";
import useGetTicketById from "@/hooks/useGetTicketById";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

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

const drinks = () => {
  const { eventId }: any = useLocalSearchParams();
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { user, updateTicket } = useUserStore();
  const { data: ticketFound, getTicket }: any = useGetTicketById();

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
  }, []);
  if (!user?.drinks) {
    return;
  }

  const [activeItem, setActiveItem] = React.useState<any>(user?.drinks?.[0]);

  React.useEffect(() => {
    let intervalId: number | null = null;

    if (!ticketFound?.is_validated && activeItem?.item?.id) {
      // Limpiar cualquier intervalo existente antes de crear uno nuevo
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(async () => {
        try {
          await getTicket(activeItem.item.id);
        } catch (error) {
          console.error("Error al obtener ticket:", error);
        }
      }, 10 * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeItem?.item?.id, ticketFound?.is_validated]);

  React.useEffect(() => {
    updateTicket(ticketFound as any);
    if (ticketFound?.is_validated) {
      Toast.show({
        type: "success",
        text1: "QR validado con éxito",
      });
    }
  }, [ticketFound, activeItem]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]);
    }
  };

  const validatedDrinks = user?.drinks
    ?.filter((drink) => drink?.event?.id === eventId)
    .filter((drink) => {
      return drink?.isValidated;
    });

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#092838"]}
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
                data={user?.drinks
                  ?.filter((drink) => drink.event?.id === eventId)
                  .filter((drink) => {
                    return !drink.isValidated;
                  })}
                onViewableItemsChanged={viewableItemsChanged}
                contentOffset={{ x: 0, y: 0 }}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 70,
                }}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={{
                  alignItems: "stretch",
                }}
                renderItem={({ item }: any) => {
                  const splittedStartAt = item.event.start_at.split(" ");
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
                        {item.isValidated ? (
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
                    title="No tienes tragos"
                    subtitle="No has comprado nuevos tragos"
                  />
                )}
              />
            </View>
            <ScalingDots
              data={user?.drinks
                ?.filter((drink) => drink.event?.id === eventId)
                .filter((drink) => {
                  return !drink.isValidated;
                })}
              scrollX={scrollX}
              inActiveDotColor={Colors.secondary[400]}
              activeDotColor={Colors.secondary[500]}
            />
          </View>
          <View className="flex flex-row justify-between mt-4 mx-4">
            <TouchableOpacity
              onPress={() => router.push(`/(dashboard)/events/${eventId}/buy`)}
              className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-full"
            >
              <Text className="font-bold text-secondary-500">Comprar</Text>
            </TouchableOpacity>
          </View>

          {validatedDrinks?.length > 0 && (
            <View className="mt-4 mx-4">
              <Text className="text-white font-bold text-xl">
                Tus compras validadas
              </Text>
              <View className="bg-white rounded-xl mt-2">
                <FlatList
                  scrollEnabled={false}
                  data={validatedDrinks}
                  keyExtractor={(item: any) => item.id}
                  renderItem={({ item }: any) => {
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
                            onPress={() =>
                              router.push(`/(dashboard)/events/${eventId}/buy`)
                            }
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
                      title="No tienes eventos"
                      subtitle="No tienes próximos eventos"
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

export default drinks;
