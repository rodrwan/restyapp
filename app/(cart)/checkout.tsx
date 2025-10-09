import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import Colors from "@/constants/Colors";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { MANGO_FEE, TERMS_URL } from "@/constants";
import { validate, format } from "rut.js";
import useUserStore from "@/stores/useUser";
import useCartStore from "@/stores/useCart";
import useEventStore from "@/stores/useEvent";
import useAuthorizeTransaction from "@/hooks/useAuthorizeTransaction";
import { CreditCard } from "@/components/CreditCard";
import RadioButton from "@/components/RadioButton";
import useCreateInscription from "@/hooks/useCreateInscription";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import useCreatePayment from "@/hooks/useCreatePayment";

const Checkout = () => {
  const navigation = useNavigation();
  const params: any = useLocalSearchParams();

  const { orderId } = params;
  const { user }: any = useUserStore();
  const { items, nominees, assignTicket, clearCart, clearTicketToNominate } =
    useCartStore();
  const { event } = useEventStore();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [termAndConditions, setTermAndConditions] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [installments, setInstallments] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" && scrollY <= 30 ? (
          <TouchableOpacity
            onPress={() => {
              clearTicketToNominate();

              return router.back();
            }}
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
      headerRight: () =>
        scrollY <= 30 && (
          <TouchableOpacity
            onPress={() => {
              clearCart();
              if (params?.goBackTo) {
                router.dismissAll();
                return router.replace(`/${params?.goBackTo}?canceled=true`);
              }

              return router.replace("/(home)?canceled=true");
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
  }, [scrollY, navigation, params, clearCart, clearTicketToNominate]);

  React.useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return;
      }
    })();
  });

  React.useEffect(() => {
    if (user?.firstname === "") {
      // logout
      router.replace("/(auth)/sign-in?redirectTo=(cart)");
    }
  }, [user?.firstname]);

  const onAuthenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirma tu compra",
      fallbackLabel: "Usar contraseña",
    });
    if (result.success) {
      onSubmit();
    } else {
      console.log("Failed to authenticate");
    }
  };

  const { authorizeTransaction } = useAuthorizeTransaction();
  console.log("event", event);
  const { createInscription } = useCreateInscription(event?.id);
  const { createPayment } = useCreatePayment();

  const onSubmit = async () => {
    setLoadingSubmit(true);
    try {
      if (event.nominated) {
        const newPayment = await authorizeTransaction(
          orderId,
          nominees,
          installments
        );
        console.log("newPayment", newPayment);
        const { status } = newPayment;
        if (status === "AUTHORIZED") {
          setLoadingSubmit(false);
          return router.push(
            `/(cart)/success?orderId=${orderId}&eventId=${event?.id}`
          );
        }
      }

      console.log("NOT NOMINATED");
      console.log("orderId", orderId);
      console.log("installments", installments);
      const newPayment = await authorizeTransaction(orderId, [], installments);
      console.log("newPayment", newPayment);
      const { status } = newPayment;
      if (status === "AUTHORIZED") {
        setLoadingSubmit(false);
        return router.push(
          `/(cart)/success?orderId=${orderId}&eventId=${event?.id}`
        );
      }
    } catch (error) {
      console.log(">>>>", error);
      setLoadingSubmit(false);
    }
  };

  const onSubmitRegisterCard = async () => {
    try {
      const newPayment = await createInscription();
      const { url, token } = newPayment;

      return router.push(
        `/(cart)/inscription?url=${url}&token=${token}&redirectTo=(cart)/checkout&orderId=${orderId}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitWebpay = async () => {
    try {
      const newPayment = await createPayment(
        orderId,
        event.nominated ? nominees : []
      );
      const { url, token } = newPayment;

      return router.push(
        `/(cart)/payment?url=${url}&token=${token}&orderId=${orderId}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const subTotal = items.reduce((acc: number, cur: any) => {
    return acc + cur.price * cur.quantity;
  }, 0);

  const fee = items.reduce((acc: number, cur: any) => {
    if (cur.type === "ENTRANCE") {
      return acc + cur.price * cur.quantity * MANGO_FEE;
    }

    return acc;
  }, 0);

  const total = items.reduce((acc: number, cur: any) => {
    if (cur.type === "ENTRANCE") {
      return acc + cur.price * cur.quantity * (1 + MANGO_FEE);
    }

    return acc + cur.price * cur.quantity;
  }, 0);

  const allNomineesSetted = nominees.every((nominee) => {
    return nominee?.dni && nominee?.email;
  });

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#04121A", "#041e2b"]}
      style={{ flex: 1, height: "100%" }}
    >
      <SafeAreaView className="flex h-full p-2">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={30}
          style={{ flex: 1 }}
        >
          <ScrollView
            className="flex grow relative"
            onScroll={(event) => {
              setScrollY(event.nativeEvent.contentOffset.y);
            }}
          >
            <Text className="self-center text-white font-bold text-xl">
              Checkout
            </Text>

            <View className="flex flex-col w-full bg-secondary-700 mt-4 p-4 rounded-xl">
              <View className="w-full border-b border-secondary-200 pb-2">
                <Text className="text-white font-bold text-xl">
                  Facturación
                </Text>
              </View>
              <View className="flex flex-row justify-between py-4">
                <Text className="text-secondary-200 font-semibold text-base">
                  Subtotal
                </Text>
                <Text className="text-secondary-200 font-semibold text-base">
                  ${Number(subTotal).toLocaleString("es-CL")}
                </Text>
              </View>
              <View className="flex flex-row justify-between py-2 pb-4">
                <Text className="text-secondary-200 font-semibold text-base">
                  Cargo por servicio
                </Text>
                <Text className="text-secondary-200 font-semibold text-base">
                  ${Number(fee).toLocaleString("es-CL")}
                </Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text className="text-white font-semibold text-base">
                  Total a pagar
                </Text>
                <Text className="text-primary-500 font-semibold text-base">
                  ${Number(total).toLocaleString("es-CL")}
                </Text>
              </View>
            </View>

            {event.nominated && nominees?.length > 0 ? (
              <View className="flex mt-4 bg-white p-4 rounded-xl">
                <View className="w-full pb-2">
                  <Text className="font-bold text-xl">Nominar entradas</Text>
                </View>
                <View className="w-full py-2 border-b border-secondary-100 pb-4">
                  <Text className="text-secondary-300 text-base">
                    Las entradas de este evento son nominativas, por lo que
                    <Text className="text-secondary-300 font-bold text-base">
                      {" "}
                      solo podrá ser validad junto a tu cédula de identidad
                      asociada a estos datos.
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
            ) : null}

            <View className="w-full mt-6 rounded-lg">
              <Text className="text-xl text-white font-bold mb-4">
                Medios de pago
              </Text>
              {user?.tbk_card_number === "" ? (
                <Text className="text-white text-base mb-4">
                  Para continuar debes elegir un medio de pago.
                </Text>
              ) : (
                <Text className="text-white text-base mb-4">
                  Tienes tu tarjeta registrada, puedes continuar con el pago.
                </Text>
              )}

              {user?.tbk_card_number === "" ? (
                <PaymentMethodSection
                  onSubmitRegisterCard={onSubmitRegisterCard}
                  onSubmitWebpay={onSubmitWebpay}
                />
              ) : (
                <View className="flex items-center ">
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        `/(modal)/payments?redirectTo=(cart)/checkout&orderId=${orderId}`
                      )
                    }
                    className="w-full backdrop-blur-lg bg-white/10 rounded-lg p-1"
                  >
                    <CreditCard
                      cardNumber={user?.tbk_card_number ?? ""}
                      cardHolder={`${user?.firstname} ${user?.lastname}`}
                      expiryDate="XX/XX"
                    />
                  </TouchableOpacity>

                  {!["RedCompra", "PrePago"].includes(user.tbk_card_type) && (
                    <View className="flex flex-col items-center justify-between w-full px-2">
                      <FormField
                        title="Cuotas"
                        value={installments}
                        handleChangeText={(e: any) => setInstallments(e)}
                        otherStyles="mt-1 mb-4"
                        autoComplete="name"
                        textStyle="ml-5"
                        keyboardType="numeric"
                        defaultValue={installments ?? 0}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>

            {user?.tbk_card_number !== "" ? (
              <View className="items-center mb-20">
                <View className="flex-row mb-2">
                  <TouchableOpacity
                    onPress={() => setTermAndConditions(!termAndConditions)}
                    className="flex flex-row items-center justify-center mt-4"
                  >
                    <RadioButton selected={termAndConditions} />
                    <Text
                      className={`font-base text-base ml-4 ${
                        termAndConditions ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Términos y condiciones
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full flex-row mx-2 mb-2 items-center justify-center">
                  <Text className="text-center text-primary-500">
                    Debes aceptar los términos y condiciones antes de continuar.
                    <TouchableWithoutFeedback
                      onPress={async () =>
                        await WebBrowser.openBrowserAsync(TERMS_URL)
                      }
                    >
                      <Text className="text-white"> Ver más</Text>
                    </TouchableWithoutFeedback>
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {!event.nominated && user?.tbk_card_number !== "" && (
            <View className="flex w-full absolute bottom-4 items-center justify-center">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onAuthenticate()}
                className={`flex-row w-full p-4 rounded-3xl items-center justify-center border border-primary-700 ${
                  user?.tbk_card_number === "" || !termAndConditions
                    ? "bg-primary-200"
                    : "bg-primary-400"
                }`}
                disabled={
                  user?.tbk_card_number === "" ||
                  loadingSubmit ||
                  !termAndConditions
                }
              >
                <Text className="text-lg text-white font-bold">Pagar</Text>

                {loadingSubmit && (
                  <ActivityIndicator
                    animating={loadingSubmit}
                    color="#fff"
                    size="small"
                    className="ml-2"
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          {event.nominated &&
            user?.tbk_card_number !== "" &&
            allNomineesSetted && (
              <View className="flex w-full absolute bottom-8 items-center justify-center">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => onAuthenticate()}
                  className={`flex-row w-[95%] ml-4 p-4 rounded-3xl items-center justify-center border border-primary-700 ${
                    user?.tbk_card_number === "" || !termAndConditions
                      ? "bg-primary-200"
                      : "bg-primary-400"
                  }`}
                  disabled={
                    user?.tbk_card_number === "" ||
                    loadingSubmit ||
                    !termAndConditions
                  }
                >
                  <Text className="text-lg text-white font-bold">Pagar</Text>

                  {loadingSubmit && (
                    <ActivityIndicator
                      animating={loadingSubmit}
                      color="#fff"
                      size="small"
                      className="ml-2"
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
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
                dni: format(e, { dots: false }),
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
              assignTicket(orderId, section, form[index]);
              closeAccordion();
            }}
            containerStyles="mt-7"
            // isLoading={loadingSubmit}
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

function WebpayView({ onSubmitWebpay }: any) {
  const [termAndConditions, setTermAndConditions] = useState(false);

  return (
    <View className="flex bg-secondary-700 p-4 rounded-xl w-full">
      <View className="flex flex-col w-full">
        <Text className="text-white text-xl sm:text-2xl lg:text-3xl mb-4">
          ¡Último paso! 🎉
        </Text>
        <Text className="text-white mb-4 text-base">
          ¡Ya casi tienes tus entradas! Te vamos a dirigir a Transbank para
          procesar tu pago de forma segura.
        </Text>
        <Text className="text-white text-base">
          Te avisamos que al continuar, estarás en la página de Transbank. Como
          es un sitio externo, asegúrate de verificar que estés en la página
          oficial antes de ingresar tus datos. ¡Tu seguridad es importante para
          nosotros! 🔒
        </Text>
      </View>

      <View className="items-center">
        <View className="flex-row mb-2">
          <TouchableOpacity
            onPress={() => setTermAndConditions(!termAndConditions)}
            className="flex flex-row items-center justify-center mt-4"
          >
            <RadioButton selected={termAndConditions} />
            <Text
              className={`font-base text-base ml-4 ${
                termAndConditions ? "text-primary-500" : "text-gray-600"
              }`}
            >
              Términos y condiciones
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex-row mx-2 mb-2 items-center justify-center">
          <Text className="text-center text-white">
            Debes aceptar los términos y condiciones antes de continuar.
            <TouchableWithoutFeedback
              onPress={async () => await WebBrowser.openBrowserAsync(TERMS_URL)}
            >
              <Text className="text-white"> Ver más</Text>
            </TouchableWithoutFeedback>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onSubmitWebpay()}
          className={`flex-row w-[100%] p-4 rounded-3xl items-center justify-center border border-primary-700 ${
            !termAndConditions ? "bg-primary-200" : "bg-primary-400"
          }`}
          disabled={!termAndConditions}
        >
          <Text className="text-white font-bold text-center">Pagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function OneClickView({ onSubmitRegisterCard }: any) {
  return (
    <View className="flex bg-secondary-700 p-4 rounded-xl w-full">
      <View>
        <Text className="text-white text-base mt-2">
          Se realizará un cobro de $50 pesos de forma temporal que te será
          devuelto al confirmar tu tarjeta. El proceso es seguro y se realizará
          una sola vez.
        </Text>
        <TouchableOpacity
          onPress={() => onSubmitRegisterCard()}
          className="bg-primary-400 rounded-full p-4 rounded-3xl items-center justify-center border border-primary-700 mt-4"
        >
          <Text className="text-white font-bold text-center">
            Inscribir tarjeta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PaymentMethodSection({ onSubmitRegisterCard, onSubmitWebpay }: any) {
  const [webpay, setWebpay] = useState(false);
  const [inscription, setInscription] = useState(false);

  return (
    <View className="w-full">
      <View className="flex flex-row w-full justify-between mb-4">
        <TouchableOpacity
          onPress={() => {
            setInscription(!inscription);
            setWebpay(false);
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#9ba5aa",
            paddingVertical: 4,
            width: "49%",
            backgroundColor: inscription ? "#fff" : "#000",
          }}
        >
          <Image
            source={require("../../assets/images/oneclick.png")}
            style={{
              height: 50,
              width: "100%",
              opacity: inscription ? 1 : 0.5,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setWebpay(!webpay);
            setInscription(false);
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#9ba5aa",
            paddingVertical: 4,
            width: "49%",
            backgroundColor: webpay ? "#fff" : "#000",
          }}
        >
          <Image
            source={require("../../assets/images/webpay.png")}
            style={{
              height: 50,
              width: "100%",
              opacity: webpay ? 1 : 0.5,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {inscription && (
        <OneClickView onSubmitRegisterCard={onSubmitRegisterCard} />
      )}

      {webpay && <WebpayView onSubmitWebpay={onSubmitWebpay} />}
    </View>
  );
}
