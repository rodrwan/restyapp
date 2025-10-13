import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import EmptyState from "@/components/EmptyState";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { router, useNavigation } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import LoadingScreen from "@/components/LoadingScreen";

const restaurantMenu = [
  {
    id: 1,
    name: "Plato 1",
    image: "https://placehold.co/125/fbcc8d/04121a/png",
    description: "Descripción del plato 1",
    price: 10000,
  },
  {
    id: 2,
    name: "Plato 2",
    image: "https://placehold.co/125/fbcc8d/04121a/png",
    description: "Descripción del plato 2",
    price: 10000,
  },
  {
    id: 3,
    name: "Plato 3",
    image: "https://placehold.co/125/fbcc8d/04121a/png",
    description: "Descripción del plato 3",
    price: 10000,
  },
];

export default function HomePage() {
  const navigation = useNavigation<any>();
  const scrollViewRef = React.useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2 bg-secondary-500"
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderHeader = React.useCallback(
    () => (
      <View style={{ paddingVertical: 16 }}>
        <Text className="text-white font-bold text-2xl">
          Menu
          <Ionicons name="add-outline" size={20} color={Colors.primary[500]} />
        </Text>
      </View>
    ),
    []
  );

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <View className="flex flex-row bg-secondary-500 rounded-xl mb-2 p-2">
        <View className="mr-2">
          <Image
            source={{ uri: item?.image }}
            resizeMode="cover"
            className="rounded-xl aspect-square w-[125px]"
          />
        </View>
        <View className="flex-1 flex-col">
          <Text className="text-xl text-white font-semibold">{item?.name}</Text>
          <Text className="text-base text-secondary-300">
            {item?.description}
          </Text>
          <Text className="text-base text-white  text-right">
            $ {item?.price.toLocaleString("es-CL")}
          </Text>
          <CustomButton
            title="Agregar"
            handlePress={() => {}}
            containerStyles="min-h-[40px] mt-2"
          />
        </View>
      </View>
    ),
    []
  );

  const renderEmpty = React.useCallback(
    () => (
      <EmptyState
        title="El sistema aún no ha encontrado nuevos eventos"
        subtitle="Próximamente acá aparecerán los eventos que disfrutarás"
      />
    ),
    []
  );

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      <ParallaxScrollView
        ref={scrollViewRef}
        backgroundColor={Colors.secondary[500]}
        style={{ flex: 1 }}
        parallaxHeaderHeight={300}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.secondary[500]}
        scrollViewProps={{
          showsHorizontalScrollIndicator: false,
        }}
        renderBackground={() => (
          <ImageBackground
            source={{
              uri: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
            }}
            resizeMode="cover"
            style={{ width: "100%", height: 300 }}
          >
            <LinearGradient
              colors={["transparent", Colors.secondary[500]]} // Example: dark to transparent
              className="absolute bottom-0 left-0 right-0 py-8 px-4"
            >
              <Text className="text-white font-bold text-2xl mb-2">
                Restaurant Mangoticket
              </Text>
            </LinearGradient>
          </ImageBackground>
        )}
        renderStickyHeader={() => (
          <View className="mx-auto h-[90px] w-full justify-end items-center">
            <Text className="text-white font-bold text-base">
              Restaurant Mangoticket
            </Text>
          </View>
        )}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 8,
        }}
      >
        <View className="w-full px-4">{renderHeader()}</View>
        <View className="flex flex-col w-full bg-secondary-700 rounded-xl mx-4 py-4 p-2">
          {isLoading ? (
            <LoadingScreen message="Cargando menu..." />
          ) : restaurantMenu.length === 0 ? (
            renderEmpty()
          ) : (
            restaurantMenu.map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))
          )}
        </View>
      </ParallaxScrollView>
    </LinearGradient>
  );
}
