import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { CreditCard } from "@/components/CreditCard";

interface PaymentMethodSectionProps {
  user: any;
  onSubmitRegisterCard: () => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  user,
  onSubmitRegisterCard,
}) => {
  if (user?.tbk_card_number === "") {
    return (
      <View className="flex bg-secondary-50 p-4 rounded-xl w-full">
        <Text className="text-lg text-black font-bold">
          Inscribir medio de pago
        </Text>
        <View className="self-center justify-center justify-center">
          <View className="flex-row w-full h-[140px] items-center m-auto justify-center ">
            <TouchableOpacity
              onPress={onSubmitRegisterCard}
              style={{
                marginTop: 8,
                alignSelf: "center",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                borderColor: "#9ba5aa",
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/images/oneclick.png")}
                style={{
                  marginTop: 8,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-secondary-500 text-md font-regular mt-4">
          Realizaremos un cargo de $50 pesos de forma temporal que te
          devolveremos al confirmar tu tarjeta. El proceso es seguro y se
          realizará una sola vez.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex w-full">
      <Text className="text-lg text-white font-bold">Medios de pago</Text>
      <View className="flex items-center rounded-3xl mt-4 mb-2">
        <TouchableOpacity
          onPress={() => router.push("/(modal)/payments")}
          className="w-full backdrop-blur-lg bg-white/10 rounded-2xl p-1"
        >
          <CreditCard
            cardNumber={user?.tbk_card_number ?? ""}
            cardHolder={`${user?.firstname} ${user?.lastname}`}
            expiryDate="XX/XX"
          />
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-white">
        Precionando el recuadro podrás cambiar o eliminar tu tarjeta.
      </Text>
    </View>
  );
};

export default PaymentMethodSection;
