import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

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
    <View className="w-[125px] h-[125px] rounded-3xl bg-white items-center justify-center overflow-hidden">
      {/* Imagen del código QR */}
      <Image
        source={{
          uri: "https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/qr-code-scan-icon.png",
        }}
        resizeMode="contain"
        className="w-[110px] h-[110px]"
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

function ScanFoodService() {
  return (
    <ImageBackground
      source={require("@/assets/images/hero.png")}
      resizeMode="cover"
      className="flex flex-row mx-2 rounded-2xl py-4 px-2 justify-between mt-4 h-[200px]"
      imageStyle={{ borderRadius: 16 }}
    >
      <TouchableOpacity
        className="flex flex-row mx-2 py-4 px-2 justify-between mt-4"
        onPress={() => {
          router.push("/(rest)/1?tableId=1");
        }}
      >
        <View className="flex flex-col justify-center items-center w-[65%]">
          <Text className="text-white font-bold text-4xl mb-4">
            ¿Qué vas a comer hoy?
          </Text>
          <Text className="text-white font-base text-md">
            Lee el código QR para acceder al menú
          </Text>
        </View>
        <View className="flex flex-col justify-center items-center my-8">
          <View className="flex flex-col justify-center items-center">
            <QRScanAnimation />
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}
export default React.memo(ScanFoodService);
