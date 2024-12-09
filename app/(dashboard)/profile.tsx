import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { UserInfoSkeleton } from "@/components/skeletons/home";
import Colors from "@/constants/Colors";
import useUserStore from "@/stores/useUser";
import { CreditCard } from "@/components/CreditCard";
import useCreateInscription from "@/hooks/useCreateInscription";
import useMe from "@/hooks/useMe";
import { LinearGradient } from "expo-linear-gradient";

const ProfilePage = () => {
  const { user } = useUserStore();
  const { me, loadingUserData } = useMe();
  const { createInscription } = useCreateInscription();

  React.useEffect(() => {
    me();
  }, []);

  if (loadingUserData) {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={["#04121A", "#092838"]}
        className="flex h-full"
      >
        <View className="h-full items-center justify-center">
          <ActivityIndicator size={"small"} />
        </View>
      </LinearGradient>
    );
  }

  const onSubmitRegisterCard = async () => {
    try {
      const newPayment = await createInscription();
      const { url, token } = newPayment;
      console.log(`/(events)/inscription?url=${url}&token=${token}`);
      return router.push(
        `/(cart)/inscription?url=${url}&token=${token}&redirectTo=(dashboard)/profile`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView className="flex h-full pb-8">
      <LinearGradient
        // Background Linear Gradient
        colors={["#04121A", "#092838"]}
        className="flex h-full"
      >
        {/* Profile view */}
        {!Boolean(user) ? (
          <UserInfoSkeleton />
        ) : (
          <View className="flex flex-row bg-white rounded-xl mx-4 py-6 px-8 justify-between mb-4">
            <View className="w-1/4">
              {user && (
                <Image
                  source={{ uri: user?.picture }}
                  className="w-[80px] h-[80px] rounded-full shadow-2xl border border-secondary-500"
                  style={styles.elevationLow}
                />
              )}
            </View>
            <View className="w-3/4 justify-center ml-4">
              <Text className="text-base " numberOfLines={1}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text className="text-base ">{user?.dni}</Text>
              <Text className="text-xs text-secondary-200 ">{user?.email}</Text>
            </View>
          </View>
        )}

        <View className="flex flex-row mx-4 py-6 justify-between mb-8">
          {user?.tbk_card_number === "" ? (
            <View className="flex bg-secondary-50 p-4 rounded-xl w-full">
              <Text className="text-lg text-black font-bold">
                Inscribir medio de pago
              </Text>
              <View className="self-center justify-center justify-center">
                <View className="flex-row w-full h-[140px] items-center m-auto justify-center ">
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
                      width: "100%",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/transbank.png")}
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
          ) : (
            <MemoizedPaymentSection user={user} />
          )}
        </View>
        <View className="flex-grow mt-4 justify-between items-end">
          <TouchableOpacity
            className="p-4 rounded-xl w-full"
            onPress={() => router.push("/(modal)/delete")}
          >
            <Text className="text-primary-300 text-md font-regular underline">
              Eliminar cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const MemoizedPaymentSection = React.memo(({ user }: { user: any }) => (
  <View className="flex w-full">
    <Text className="text-lg text-white font-bold">Medios de pago</Text>
    <View className="flex items-center rounded-3xl mt-4 mb-2">
      <TouchableOpacity
        onPress={() => router.push("/(modal)/payments")}
        className="w-full backdrop-blur-lg bg-white/10 rounded-2xl p-1"
      >
        {/* <CreditCard
          cardNumber={user?.tbk_card_number ?? ""}
          firstname={user?.firstname ?? ""}
          lastname={user?.lastname ?? ""}
        /> */}
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
));

export default ProfilePage;

const styles = StyleSheet.create({
  elevationLow: {
    width: 80,
    height: 80,
    ...Platform.select({
      ios: {
        shadowColor: "#171717",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

const Memoized = ({ upcomingEvent, user, nextEventUrl, startAt }: any) =>
  React.useMemo(
    () => (
      <View className="flex mx-2">
        <View className="mb-4">
          <Text className="text-white font-bold text-xl mx-2">
            Tu próximo evento
          </Text>
        </View>
        <View className="bg-white rounded-xl mx-2 mb-4">
          <View className="flex p-4 pb-0 flex-col bg-white rounded-xl">
            <View className="flex w-full">
              <Image
                source={{ uri: upcomingEvent.event?.image }}
                className="rounded-lg w-full h-[160px]"
                resizeMode="cover"
              />
            </View>
            <View className="flex flex-col w-3/4 mt-2">
              <Text
                numberOfLines={1}
                className="overflow-hidden font-bold text-lg "
              >
                {upcomingEvent.event?.name}
              </Text>
              <Text className="text-primary-500 text-base">{startAt}</Text>
              <Text numberOfLines={1} className="text-secondary-300 text-sm">
                {upcomingEvent.event?.description}
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.primary[500]}
                />
                <Text numberOfLines={1} className="text-secondary-300 text-sm">
                  {upcomingEvent?.event?.place}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-between gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(nextEventUrl as Href)}
              className="flex bg-white rounded-xl grow p-4 justify-between"
            >
              <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
                <Image
                  source={require("../../assets/images/ticket.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View className="ml-2">
                <Text className="text-xs text-secondary-300">
                  {user?.tickets?.filter(
                    (drink: any) => drink.event.id === upcomingEvent?.event?.id
                  )?.length ?? 0}{" "}
                  Disponibles
                </Text>
                <Text className="font-bold">Tickets</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  `/(dashboard)/events/${upcomingEvent.event?.id}/drinks`
                )
              }
              className="flex bg-white rounded-xl grow p-4 justify-between"
            >
              <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
                <Image
                  source={require("../../assets/images/glass.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View className="ml-2">
                <Text className="text-xs text-secondary-300">
                  {user?.drinks?.filter(
                    (drink: any) => drink.event.id === upcomingEvent?.event?.id
                  )?.length ?? 0}{" "}
                  Disponibles
                </Text>
                <Text className="font-bold">Tragos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [upcomingEvent, user, nextEventUrl, startAt]
  );
