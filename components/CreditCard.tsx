import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <LinearGradient
      colors={[
        "#f79008", // naranja mango
        "#af6606", // naranja más profundo
        "#af6606", // naranja más profundo
        "#af6606", // naranja más profundo
        "#092838", // naranja rojizo
        "#04121A", // azul oscuro de fondo
        "#04121A", // azul oscuro de fondo
        "#04121A", // azul oscuro de fondo
      ]}
      locations={[0, 0.3, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full h-52 rounded-2xl p-6 relative overflow-hidden shadow-lg"
    >
      {/* Efecto de ruido */}
      <View
        className="absolute inset-0 mix-blend-overlay opacity-[0.03]"
        style={{
          backgroundColor: "transparent",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Número de tarjeta */}
      <Text className="text-white text-2xl font-medium tracking-wider mt-4 mb-8">
        {formatCardNumber(cardNumber)}
      </Text>

      {/* Contenedor inferior */}
      <View className="flex-row justify-between items-end mt-auto">
        {/* Información del titular */}
        <View>
          <Text className="text-gray-400 text-xs mb-1">Nombre del titular</Text>
          <Text className="text-white text-lg font-medium">{cardHolder}</Text>
        </View>

        {/* Fecha de expiración */}
        <View>
          <Text className="text-gray-400 text-xs mb-1">Valida hasta</Text>
          <Text className="text-white text-lg">{expiryDate}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
