import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const restaurantData = [
  {
    id: 1,
    name: "Restaurant 1",
    image: "https://placehold.co/150/f79008/04121a/png",
  },
  {
    id: 2,
    name: "Restaurant 2",
    image: "https://placehold.co/150/f79008/04121a/png",
  },
  {
    id: 3,
    name: "Restaurant 3",
    image: "https://placehold.co/150/f79008/04121a/png",
  },
];

// Componente de animación de escaneo QR
function QRScanAnimation() {
  const scanAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanLineTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-32, 32],
  });

  return (
    <View className="w-[100px] h-[100px] rounded-3xl bg-white items-center justify-center overflow-hidden">
      {/* Imagen del código QR */}
      <Image
        source={{
          uri: "https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/qr-code-scan-icon.png",
        }}
        resizeMode="contain"
        className="w-[90px] h-[90px]"
      />

      {/* Línea de escaneo animada */}
      <Animated.View
        style={{
          position: "absolute",
          width: "70%",
          height: 3,
          backgroundColor: Colors.primary[500],
          transform: [{ translateY: scanLineTranslateY }],
          shadowColor: Colors.primary[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
        }}
      />
    </View>
  );
}

function FoodFlatList() {
  const renderFoodItem = React.useCallback(
    ({ item }: { item: any }) => (
      <View
        className="flex flex-col justify-center items-center p-2"
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#d1d5db",
          shadowColor: Colors.secondary[300],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 5,
          elevation: 6,
          minHeight: 120,
          marginRight: 16,
        }}
      >
        <Image
          source={{ uri: item?.image }}
          resizeMode="cover"
          className="w-[150px] h-[150px] rounded-2xl mb-2"
        />
        <Text className="text-xl font-semibold">{item?.name}</Text>
      </View>
    ),
    []
  );

  return (
    <View className="flex">
      <Text className="text-white font-bold text-2xl mx-2 mb-4">
        ¿Qué quieres comer hoy?
        <Ionicons name="add-outline" size={20} color={Colors.primary[500]} />
      </Text>
      <FlatList
        data={restaurantData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        keyExtractor={(item: any) => item?.id}
        renderItem={renderFoodItem}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
}

function ScanFoodService() {
  return (
    <View className="flex flex-col mb-4">
      <Text className="text-white font-bold text-2xl mx-2 mb-4">
        ¿Qué vas a comer hoy?
      </Text>
      <TouchableOpacity
        onPress={() => {
          router.push("/(rest)/1");
        }}
      >
        <View className="flex flex-col justify-center items-center my-4">
          <QRScanAnimation />
        </View>
      </TouchableOpacity>
      <Text className="text-white font-base text-md mx-2 mb-4 text-center">
        Lee el código QR para acceder al menú
      </Text>
    </View>
  );
}
export default React.memo(ScanFoodService);
