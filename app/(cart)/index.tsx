import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import useCreateOrder from "@/hooks/useCreateOrder";
import useCartStore from "@/stores/useCart";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "@/context/AuthProvider";

const Cart = () => {
  const navigation = useNavigation();
  const {
    items: itemsInCart,
    addToCart,
    removeFromCart,
    setTicketToNominate,
    clearCart,
  } = useCartStore();
  const { session } = useSession();
  const params: any = useLocalSearchParams();
  console.log("cart params", params);

  React.useEffect(() => {
    if (!session) {
      return router.push("/(auth)/sign-in?redirectTo=(cart)");
    }
  }, [session]);

  const { create } = useCreateOrder();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
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
        ) : (
          <View />
        ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            clearCart();
            if (params?.goBackTo) return router.replace(`/${params?.goBackTo}`);
            return router.replace(`/(home)`);
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
      if (!session) {
        return router.push(
          `/(auth)/sign-in?redirectTo=(cart)?goBackTo=${params?.goBackTo}`
        );
      }

      console.log("itemsInCart", itemsInCart);
      const newOrder = await create(itemsInCart);
      console.log("newOrder", newOrder, !newOrder);
      if (!newOrder) {
        return router.push(
          `/(auth)/sign-in?redirectTo=(cart)?goBackTo=${params?.goBackTo}`
        );
      }
      if (newOrder?.length === 0) {
        return router.push(
          `/(auth)/sign-in?redirectTo=(cart)?goBackTo=${params?.goBackTo}`
        );
      }

      setTicketToNominate(
        newOrder.items.filter((item: any) => item.type === "ENTRANCE")
      );
      return router.push(
        `/(cart)/checkout?orderId=${newOrder.id}&goBackTo=${params?.goBackTo}`
      );
    } catch (error) {
      console.log(">>>", error);
    }
  };

  const tickets = itemsInCart.filter((item: any) => item.type === "ENTRANCE");
  const drinks = itemsInCart.filter((item: any) => item.type === "DRINK");

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#092838"]}
      style={{ flex: 1, height: "100%" }}
    >
      <SafeAreaView className="flex h-full">
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
              renderItem={({ item, index }: any) => {
                const quantity =
                  itemsInCart?.find(
                    (iic: any) =>
                      iic?.type === "ENTRANCE" && iic?.id === item?.id
                  )?.quantity ?? 0;

                const maxPerSale =
                  item?.max_per_sale < item?.stock
                    ? item?.max_per_sale
                    : item?.stock;

                const disabledAdd = maxPerSale <= quantity;

                return (
                  <View
                    className={`flex flex-row justify-between ${
                      index % 2 === 0 ? "bg-secondary-500" : "bg-secondary-600"
                    } p-4 mx-2 rounded-xl mt-2`}
                  >
                    <View>
                      <Text className="text-white text-base font-bold mb-2">
                        {`${item?.name} `}
                        {item?.cover && (
                          <Text className="py-1.5 text-xs text-secondary-200">
                            (Con cover)
                          </Text>
                        )}
                      </Text>
                      <Text className="text-primary-500 text-base mb-2">
                        ${Number(item?.price).toLocaleString("es-CL")} c/u
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
                        {(itemsInCart?.length &&
                          itemsInCart.filter(
                            (item: any) => item.type === "ENTRANCE"
                          )[index]?.quantity) ??
                          0}
                      </Text>
                      <TouchableOpacity
                        disabled={disabledAdd}
                        onPress={() => addToCart(item)}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          color={
                            disabledAdd
                              ? Colors.secondary[300]
                              : Colors.primary[500]
                          }
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
              renderItem={({ item, index }: any) => {
                const quantity =
                  itemsInCart?.find(
                    (iic: any) => iic?.type === "DRINK" && iic?.id === item?.id
                  )?.quantity ?? 0;

                const maxPerSale =
                  item?.max_per_sale < item?.stock
                    ? item?.max_per_sale
                    : item?.stock;
                const disabledAdd = maxPerSale <= quantity;

                return (
                  <View
                    className={`flex flex-row justify-between ${
                      index % 2 === 0 ? "bg-secondary-500" : "bg-secondary-600"
                    } p-4 mx-2 rounded-xl mb-2`}
                  >
                    <View>
                      <Text className="text-white text-base font-bold mb-2">
                        {item?.name}
                      </Text>
                      <Text className="text-primary-500 text-base mb-2">
                        ${Number(item?.price).toLocaleString("es-CL")} c/u
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
                        {(itemsInCart?.length &&
                          itemsInCart.filter(
                            (item: any) => item.type === "DRINK"
                          )[index]?.quantity) ??
                          0}
                      </Text>
                      <TouchableOpacity
                        disabled={disabledAdd}
                        onPress={() => addToCart(item)}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          color={
                            disabledAdd
                              ? Colors.secondary[300]
                              : Colors.primary[500]
                          }
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

        <View className="flex items-end pr-4 mb-8">
          <Text className="text-lg text-white font-bold">
            Subtotal: $
            {Number(
              itemsInCart.reduce((acc: number, cur: any) => {
                return acc + cur.price * cur.quantity;
              }, 0)
            ).toLocaleString("es-CL")}
          </Text>
        </View>

        {itemsInCart?.length > 0 ? (
          <View className="flex w-full absolute bottom-12 bg-transparent justify-center">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSubmit()}
              className="bg-primary-400 w-[90%] mx-auto left-0 right-0 p-4 rounded-3xl items-center justify-center border border-primary-700 content-center"
            >
              <Text className="text-lg text-white font-bold">Ir a Pagar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Cart;
