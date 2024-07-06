import React, { useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import Colors from "@/constants/Colors";
import { useCartContext } from "@/context/CartProvider";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import useCreatePayment from "@/hooks/useCreatePayment";
import { MANGO_FEE } from "@/constants";
import { validate, format } from "rut.js";
import useUserStore from "@/stores/useUser";

const Checkout = () => {
  const navigation = useNavigation();
  const params: any = useLocalSearchParams();
  const { orderId } = params;
  const { cartItems, nominees, assignTicket, clearCart } = useCartContext();
  const { user }: any = useUserStore();

  useLayoutEffect(() => {
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
        <TouchableOpacity
          onPress={() => {
            clearCart();
            return router.push("/");
          }}
          className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2"
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const { createPayment } = useCreatePayment();

  const onSubmit = async () => {
    try {
      const newPayment = await createPayment(nominees);
      const { url, token } = newPayment;
      return router.push(`/events/payment?url=${url}&token=${token}`);
    } catch (error) {
      console.log(error);
    }
  };

  const subTotal = cartItems.reduce(
    (acc: number, cur: any) => acc + cur.price * cur.quantity,
    0
  );
  const fee = subTotal * MANGO_FEE;
  const total = Math.floor(subTotal + fee);

  return (
    <SafeAreaView className="flex h-full bg-secondary-500 p-2">
      <ScrollView className="flex grow relative">
        <Text className="self-center text-white font-bold text-xl">
          Checkout
        </Text>

        <View className="flex flex-col w-full bg-secondary-700 mt-12 p-4 rounded-xl">
          <View className="w-full border-b border-secondary-200 pb-2">
            <Text className="text-white font-bold text-xl">Facturación</Text>
          </View>
          <View className="flex flex-row justify-between py-4">
            <Text className="text-secondary-200 font-semibold text-base">
              Subtotal
            </Text>
            <Text className="text-secondary-200 font-semibold text-base">
              ${subTotal}
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2 pb-4">
            <Text className="text-secondary-200 font-semibold text-base">
              Cargo por servicio
            </Text>
            <Text className="text-secondary-200 font-semibold text-base">
              ${fee}
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text className="text-white font-semibold text-base">
              Total a pagar
            </Text>
            <Text className="text-primary-500 font-semibold text-base">
              ${total}
            </Text>
          </View>
        </View>

        <View className="flex mt-4 bg-white p-4 rounded-xl">
          <View className="w-full pb-2">
            <Text className="font-bold text-xl">Nominar entradas</Text>
          </View>
          <View className="w-full py-2 border-b border-secondary-100 pb-4">
            <Text className="text-secondary-300 text-base">
              Las entradas de este evento son nominativas, por lo que
              <Text className="text-secondary-300 font-bold text-base">
                {" "}
                solo podrá ser validad junto a tu cédula de identidad asociada a
                estos datos.
              </Text>
            </Text>
          </View>
          <View className="pt-4 pb-8">
            <AccordionView
              orderId={orderId}
              tickets={nominees}
              assignTicket={assignTicket}
            />
          </View>
        </View>
      </ScrollView>
      {nominees.reduce((acc: boolean, cur: any) => acc && cur?.email, true) ? (
        <View className="flex w-full absolute bottom-12 bg-transparent items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSubmit()}
            className="bg-primary-400 w-[95%] ml-4 p-4 rounded-3xl items-center justify-center border border-primary-700"
          >
            <Text className="text-white font-bold">Pagar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Checkout;

function AccordionView({ orderId, tickets, assignTicket }: any) {
  const [form, setForm] = useState(tickets);
  const [activeSections, setActiveSections] = useState([]);

  const closeAccordion = () => {
    setActiveSections([]);
  };

  const _renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <View className="flex flex-row bg-white justify-between w-full pb-2">
        <View className="flex flex-row gap-2">
          <Text className="font-bold text-xl">Entrada N° {index + 1}</Text>
          <View className="bg-primary-300 rounded-xl p-2 px-4 items-center opacity-80">
            <Text>{section.name}</Text>
          </View>
        </View>
        <View>
          <Ionicons
            name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
            size={32}
            color={Colors.primary[500]}
          />
        </View>
      </View>
    );
  };

  const _renderContent = (section: any, index: number) => {
    return (
      <View className="flex w-full pb-6">
        <View>
          <FormField
            title="R.u.t"
            placeholder="R.u.t"
            value={form[index]?.dni}
            handleChangeText={(e: any) => {
              form[index] = {
                ...form[index],
                dni: format(e),
              };
              setForm([...form]);
            }}
            textStyle="text-secondary-500"
          />
        </View>
        <View>
          <FormField
            title="Email"
            placeholder="Email"
            value={form[index]?.email}
            handleChangeText={(e: any) => {
              form[index] = {
                ...form[index],
                email: e,
              };
              setForm([...form]);
            }}
            keyboardType="email-address"
            textStyle="text-secondary-500"
            autoCapitalize="none"
          />
        </View>
        <View>
          <CustomButton
            title="Nominar"
            handlePress={() => {
              console.log(
                "orderId, section, form[index]",
                orderId,
                section,
                index,
                form
              );
              assignTicket(orderId, section, form[index]);
              closeAccordion();
            }}
            containerStyles="mt-7"
            // isLoading={isSubmitting}
          />
        </View>
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    setActiveSections(activeSections);
  };

  return (
    <Accordion
      sections={tickets}
      activeSections={activeSections}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={_updateSections}
    />
  );
}
