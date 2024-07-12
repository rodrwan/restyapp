import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

import useCreateOrder from "@/hooks/useCreateOrder";
import useAuthStore from "@/stores/useAuth";
import useCartStore from "@/stores/useCart";

const Cart = () => {
  const navigation = useNavigation();
  const { items, addToCart, removeFromCart, setTicketToNominate, clearCart } =
    useCartStore();
  const { auth }: any = useAuthStore();

  useEffect(() => {
    if (!auth.isLogged) {
      return router.push("/(auth)/sign-in?redirectTo=/events/cart");
    }
  }, [auth.isLogged]);

  const { create } = useCreateOrder();

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

  const onSubmit = async () => {
    try {
      const newOrder = await create(items);
      setTicketToNominate(
        newOrder.items.filter((item: any) => item.type === "ENTRANCE")
      );
      return router.push(`/events/checkout?orderId=${newOrder.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const tickets = items.filter((item: any) => item.type === "ENTRANCE");
  const drinks = items.filter((item: any) => item.type === "DRINK");

  return (
    <SafeAreaView className="flex h-full bg-secondary-500">
      <Text className="self-center text-white font-bold text-xl mb-8">
        Carro de compras
      </Text>

      {/* Tickets */}
      {tickets.length ? (
        <View className="bg-secondary-700 py-8 mb-8 mx-1 rounded-3xl">
          <FlatList
            scrollEnabled={false}
            data={tickets}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item, index }) => {
              return (
                <View
                  className={`flex flex-row justify-between ${
                    index % 2 === 0 ? "bg-secondary-500" : "bg-secondary-300"
                  } p-4 mx-2 rounded-xl`}
                >
                  <View>
                    <Text className="text-white text-base font-bold mb-2">
                      {item?.name}
                    </Text>
                    <Text className="text-primary-500 text-base mb-2">
                      ${item?.price} c/u
                    </Text>
                  </View>
                  <View className="flex flex-row gap-2 items-center">
                    <TouchableOpacity onPress={() => removeFromCart(item)}>
                      <Ionicons
                        name="remove-circle-outline"
                        color={Colors.white}
                        size={32}
                      />
                    </TouchableOpacity>
                    <Text className="text-white text-xl">
                      {(items?.length &&
                        items.filter((item: any) => item.type === "ENTRANCE")[
                          index
                        ]?.quantity) ??
                        0}
                    </Text>
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <Ionicons
                        name="add-circle-outline"
                        color={Colors.primary[500]}
                        size={32}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListHeaderComponent={() => (
              <View className="flex justify-center p-4">
                <Text className="text-white text-left text-xl font-bold">
                  Tickets
                </Text>
              </View>
            )}
          />
        </View>
      ) : null}

      {/* Drinks */}
      {drinks.length ? (
        <View className="bg-secondary-700 py-8 mb-8 mx-1 rounded-3xl">
          <FlatList
            scrollEnabled={false}
            data={drinks}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item, index }) => {
              return (
                <View
                  className={`flex flex-row justify-between ${
                    index % 2 === 0 ? "bg-secondary-500" : "bg-secondary-300"
                  } p-4 mx-2 rounded-xl`}
                >
                  <View>
                    <Text className="text-white text-base font-bold mb-2">
                      {item?.name}
                    </Text>
                    <Text className="text-primary-500 text-base mb-2">
                      ${item?.price} c/u
                    </Text>
                  </View>
                  <View className="flex flex-row gap-2 items-center">
                    <TouchableOpacity onPress={() => removeFromCart(item)}>
                      <Ionicons
                        name="remove-circle-outline"
                        color={Colors.white}
                        size={32}
                      />
                    </TouchableOpacity>
                    <Text className="text-white text-xl">
                      {(items?.length &&
                        items.filter((item: any) => item.type === "DRINK")[
                          index
                        ]?.quantity) ??
                        0}
                    </Text>
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <Ionicons
                        name="add-circle-outline"
                        color={Colors.primary[500]}
                        size={32}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListHeaderComponent={() => (
              <View className="flex justify-center p-4">
                <Text className="text-white text-left text-xl font-bold">
                  Tragos
                </Text>
              </View>
            )}
          />
        </View>
      ) : null}

      <View className="flex items-end pr-4">
        <Text className="text-lg text-white font-bold">
          Subtotal: $
          {items.reduce((acc: number, cur: any) => {
            return acc + cur.price * cur.quantity;
          }, 0)}
        </Text>
      </View>

      {items?.length > 0 ? (
        <View className="flex w-full absolute bottom-12 bg-transparent justify-center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSubmit()}
            className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
          >
            <Text className="text-white font-bold">Ir a Pagar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Cart;
