import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/stores/useUser";
import useEventStore from "@/stores/useEvent";
import { CreditCard } from "@/components/CreditCard";
import useCreateInscription from "@/hooks/useCreateInscription";
import useDeleteInscription from "@/hooks/useDeleteInscription";
import { router, useLocalSearchParams } from "expo-router";
import useSession from "@/hooks/useSession";

const payments = () => {
  const params: any = useLocalSearchParams();
  const { user, setTbkCardNumber }: any = useUserStore();
  const { me } = useSession();
  const { event } = useEventStore();
  const { createInscription } = useCreateInscription(event?.id);
  const { deleteInscription } = useDeleteInscription(event?.id);

  const onDeleteInscription = async () => {
    try {
      await deleteInscription();
      await me();
      setTbkCardNumber("", "", "");

      if (params?.redirectTo) {
        return router.replace(
          `/${params?.redirectTo}?orderId=${params?.orderId}`
        );
      }

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitRegisterCard = async () => {
    try {
      const newPayment = await createInscription();
      const { url, token } = newPayment;
      return router.push(
        `/(cart)/inscription?url=${url}&token=${token}&redirectTo=(cart)/checkout`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex h-full bg-secondary-500">
      <Text className="text-lg text-white font-bold text-center">
        Tus métodos de pago
      </Text>
      <View className="flex backdrop-blur-lg bg-white/10 rounded-lg p-1  mx-2">
        <CreditCard
          cardNumber={user?.tbk_card_number ?? ""}
          cardHolder={`${user?.firstname} ${user?.lastname}`}
          expiryDate="XX/XX"
        />
      </View>

      <View className="flex bg-secondary-50 p-4 my-8 mx-2 rounded-3xl justify-center items-center">
        <Text className="text-lg text-black font-bold text-center mb-4">
          Inscribir medio de pago
        </Text>
        <View>
          <Text className="text-secondary-500 text-base font-regular text-justify">
            Realizaremos un cargo de $50 pesos de forma temporal que te
            devolveremos al confirmar tu tarjeta. El proceso es seguro y se
            realizará una sola vez.
          </Text>
        </View>

        <View className="flex-row w-full h-[120px] items-center m-auto justify-center self-center">
          <TouchableOpacity
            onPress={() => onSubmitRegisterCard()}
            style={{
              marginTop: 8,
              alignSelf: "center",
              borderWidth: 1,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 8,
              borderColor: "#9ba5aa",
            }}
          >
            <Image
              source={require("../../assets/images/oneclick.png")}
              style={{
                marginTop: 8,
                height: 80,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex p-4 mt-8 mx-4 justify-center items-center">
        <TouchableOpacity onPress={() => onDeleteInscription()}>
          <Text className="text-error-400">Eliminar tarjeta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default payments;
