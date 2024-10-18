import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/stores/useUser";
import CreditCard from "@/components/CreditCars";
import RadioButton from "@/components/RadioButton";
import useCreateInscription from "@/hooks/useCreateInscription";
import { router } from "expo-router";

const payments = () => {
  const { user }: any = useUserStore();
  const [selected, setSelected] = React.useState(false);
  const { createInscription } = useCreateInscription();

  const onSubmitRegisterCard = async () => {
    try {
      setSelected(true);
      const newPayment = await createInscription();
      const { url, token } = newPayment;
      console.log(`/(events)/inscription?url=${url}&token=${token}`);
      return router.push(`/(cart)/inscription?url=${url}&token=${token}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 p-2">
      <Text className="text-lg text-white font-bold text-center">
        Tus métodos de pago
      </Text>
      <CreditCard
        cardNumber={user?.tbk_card_number ?? ""}
        firstname={user?.firstname ?? ""}
        lastname={user?.lastname ?? ""}
      />

      <View className="flex bg-secondary-50 p-4 my-8 mx-4 rounded-3xl justify-center items-end">
        <View className="self-center w-[80%] justify-center justify-center ">
          <Text className="text-lg text-black font-bold text-center">
            Inscribir medio de pago
          </Text>
          <View className="flex-row w-full h-[100px] items-center">
            <RadioButton selected={selected} />
            <TouchableOpacity
              onPress={() => onSubmitRegisterCard()}
              style={{
                width: "100%",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/transbank.png")}
                style={{
                  marginTop: 8,
                  width: "100%",
                  height: 60,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex p-4 mt-16 mx-4 justify-center items-start">
        <Text className="text-error-400">Eliminar tarjeta</Text>
      </View>
    </SafeAreaView>
  );
};

export default payments;
