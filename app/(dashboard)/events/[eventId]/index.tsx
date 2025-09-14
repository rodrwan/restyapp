import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import useUserStore from "@/stores/useUser";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ScalingDots from "@/components/ScalingDots";
import EmptyState from "@/components/EmptyState";
import * as Animatable from "react-native-animatable";
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

const TicketPage = () => {
  const { eventId }: any = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, updateTicket } = useUserStore();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { data: ticketFound, getTicket }: any = useGetTicketById();
  const [scrollY, setScrollY] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" && scrollY <= 30 ? (
          <TouchableOpacity
            onPress={() => router.replace("/(dashboard)")}
            className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.primary[500]}
            />
          </TouchableOpacity>
        ) : (
          <View />
        ),
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/menu")}>
          <Ionicons name="menu" size={32} color={Colors.primary[500]} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (!user?.tickets) {
    return;
  }

  const [activeItem, setActiveItem] = React.useState<any>(user?.tickets?.[0]);

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
  }, [ticketFound, activeItem]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]);
    }
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#041e2b"]}
    >
      <SafeAreaView className="flex h-full">
        <ScrollView className="flex h-full mt-16">
          {/* next events */}
          <View className="flex mx-2 h-[85%]">
            <View className="rounded-xl">
              <View>
                <Text className="text-white font-bold text-xl mx-2">
                  Tus Tickets
                </Text>
              </View>
              <View className="rounded-xl">
                {user?.tickets.filter((item: any) => item.event.id === eventId)
                  .length > 0 ? (
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
                    className="p-2 h-full"
                    data={user?.tickets.filter(
                      (item: any) => item.event.id === eventId
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    contentOffset={{ x: 0, y: 0 }}
                    viewabilityConfig={{
                      itemVisiblePercentThreshold: 70,
                    }}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }: any) => {
                      const splittedStartAt = item?.event?.start_at.split(" ");
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
                      const splittedEndAt = item?.event?.end_at.split(" ");
                      const hour = item?.event?.end_hour;
                      const joinedEndAt =
                        splittedEndAt[0] + " " + hour?.replace("Z", "");
                      const endAt = new Date(joinedEndAt).toLocaleString(
                        "es-CL",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      );

                      const endHour = new Date(joinedEndAt).toLocaleString(
                        "us-US",
                        {
                          minute: "2-digit",
                          hour: "2-digit",
                        }
                      );
                      return (
                        <Animatable.View
                          style={{ width: Dimensions.get("window").width - 30 }}
                          className="mr-4 bg-white rounded-xl p-4"
                          animation={
                            activeItem?.id !== item.id
                              ? zoomIn
                              : (zoomOut as any)
                          }
                          duration={500}
                        >
                          <View className="flex flex-row bg-white rounded-xl mb-2">
                            <View className="flex">
                              <Image
                                source={{ uri: item.event.image }}
                                style={{ aspectRatio: 1 }}
                                className="rounded-lg w-[90px] h-[90px]"
                              />
                            </View>
                            <View className="flex flex-col pl-2">
                              <View className="flex flex-row">
                                <View className="flex flex-wrap grow">
                                  <Text className="font-bold text-lg">
                                    {item?.event?.name}
                                  </Text>
                                  <Text className="text-primary-500 text-base">
                                    {startAt}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    className="text-secondary-300 text-sm"
                                  >
                                    {[item?.event?.address, item?.event?.place]
                                      .join(" ")
                                      .trim()}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View className="flex p-2 flex-col bg-white rounded-xl items-center justify-center">
                            <Text className="font-bold mb-4 text-base">
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
                          <View className="py-4 bg-error-100 justify-center items-center rounded-xl mb-8">
                            <Text className="font-bold text-error-500">
                              Válido hasta {endAt} - {endHour}
                            </Text>
                            {/* <Text className="font-bold text-error-500">
                        Evento con restricción de edad:
                      </Text> */}
                          </View>
                        </Animatable.View>
                      );
                    }}
                  />
                ) : (
                  <View className="flex justify-center items-center h-full">
                    <EmptyState
                      title="El sistema aún no ha encontrado nuevos eventos"
                      subtitle="Próximamente acá aparecerán los eventos que tienes a tu disposición"
                    />
                  </View>
                )}
              </View>
              <ScalingDots
                data={user?.tickets.filter(
                  (item: any) => item.event.id === eventId
                )}
                scrollX={scrollX}
                inActiveDotColor={Colors.secondary[400]}
                activeDotColor={Colors.secondary[500]}
              />
            </View>
            <View className="flex flex-row justify-between mt-4 mx-1">
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(dashboard)/events/${eventId}/drinks`)
                }
                className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-[45%]"
              >
                <Text className="font-bold text-secondary-500">Barra</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(dashboard)/events/${eventId}/buy`)
                }
                className="py-4 bg-success-100 justify-center items-center my-4 rounded-xl w-[45%]"
              >
                <Text className="font-bold text-secondary-500">Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TicketPage;
