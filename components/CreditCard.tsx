import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate?: string;
}

export function CreditCard({
  cardNumber,
  cardHolder,
  expiryDate = "11/22",
}: CreditCardProps) {
  // Función para formatear el número de tarjeta en grupos de 4
  const formatCardNumber = (number: string) => {
    return number?.replace(/(.{4})/g, "$1  ").trim();
  };

  return (
    <LinearGradient
      colors={["#04121A", "#0A1F2E", "#04121A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full h-54 rounded-lg p-6 relative overflow-hidden shadow-lg"
    >
      {/* Elemento decorativo con el color naranja */}
      <View className="absolute right-0 top-0 w-2/3 h-full">
        <LinearGradient
          colors={[
            "#f79008",
            "rgba(247, 144, 8, 0.3)",
            "rgba(247, 144, 8, 0.1)",
          ]}
          style={{
            transform: [{ rotate: "-25deg" }, { scale: 1.5 }],
            borderRadius: 140,
          }}
          className="absolute right-[-20] top-[-100] w-64 h-64 opacity-50"
        />
      </View>

      {/* Efecto de brillo mejorado */}
      <BlurView
        intensity={15}
        tint="dark"
        className="absolute inset-0 opacity-[0.05]"
      />

      {/* Número de tarjeta */}
      <Text className="text-white text-2xl font-medium tracking-wider mt-2 mb-5">
        {formatCardNumber(cardNumber)}
      </Text>

      {/* Chip y símbolo WiFi */}
      <View className="flex flex-row items-center gap-2 mb-4">
        {/* Símbolo WiFi */}
        <View className="w-5 h-10 flex items-center justify-center rotate-[270deg]">
          <View className="relative w-5 h-2">
            {/* Arcos del WiFi más sutiles */}
            <View className="absolute w-full h-full border-t-[2.5px] border-secondary-50/70 rounded-t-full" />
            <View className="absolute w-3.5 h-2.5 mx-auto left-[3px] top-1 border-t-[2.5px] border-secondary-50/70 rounded-t-full" />
            <View className="absolute w-2 h-1.5 mx-auto left-[6px] top-2 border-t-[2.5px] border-secondary-50/70 rounded-t-full" />
          </View>
        </View>
        {/* Chip de la tarjeta */}
        <LinearGradient
          colors={["#b3b8bc", "#e6e8e9"]}
          className="w-10 h-8 rounded-[3px]"
        >
          <View className="w-full h-full absolute inset-0 p-[2px]">
            <View className="w-full h-full">
              {/* Líneas horizontales del chip */}
              <View className="absolute left-0 top-1/4 w-1/2 h-[1px] bg-secondary-500/50" />
              <View className="absolute right-0 top-3/4 w-full h-[1px] bg-secondary-500/50" />
              {/* Líneas verticales del chip */}
              <View className="absolute right-1/4 top-0 h-3/4 w-[2px] bg-secondary-500/50" />
              <View className="absolute right-1/2 top-0 h-full w-[2px] bg-secondary-500/50" />
              <View className="absolute right-3/4 bottom-0 h-3/4 w-[2px] bg-secondary-500/50" />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Contenedor inferior */}
      <View className="flex-row justify-between items-end mt-auto">
        {/* Información del titular */}
        <View>
          <Text className="text-gray-300 text-xs mb-1">Nombre del titular</Text>
          <Text className="text-white text-lg font-medium">{cardHolder}</Text>
        </View>

        {/* Fecha de expiración */}
        <View>
          <Text className="text-gray-300 text-xs mb-1">Valida hasta</Text>
          <Text className="text-white text-lg">{expiryDate}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
