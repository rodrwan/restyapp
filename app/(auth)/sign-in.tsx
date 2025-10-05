import { useLayoutEffect, useState } from "react";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import SignWithGoogle from "@/components/SignWithGoogle";
import useUserStore from "@/stores/useUser";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useSession from "@/hooks/useSession";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import Toast from "react-native-toast-message";
import useGetUserFirstUpcomingEvent from "@/hooks/useGetUserFirstUpcomingEvent";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthProvider";
import SignWithApple from "@/components/SignWithApple";
import * as WebBrowser from "expo-web-browser";
import { POLICY_URL, TERMS_URL } from "@/constants";

const SignIn = () => {
  const { createSession } = useSession();
  const { signIn } = useAuthContext();
  const { getEvents } = useGetEventsFromUser();
  const { getUserFirstUpcomingEvent } = useGetUserFirstUpcomingEvent();

  const navigation = useNavigation();
  const params: any = useLocalSearchParams();
  const { setUser } = useUserStore();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => router.push("../")}
            className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2 bg-secondary-500"
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
    });
  }, [navigation]);

  const submit = async () => {
    setSubmitting(true);
    if (form.email === "" || form.password === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes llenar todos los campos",
        onHide: () => {
          setSubmitting(false);
        },
      });
      return;
    }

    setError(null);
    try {
      const sessionResp = await createSession(
        form.email,
        form.password,
        "mangoticket"
      );

      if (!sessionResp) {
        throw new Error("Error al iniciar sesión");
      }
      setUser({
        ...sessionResp.user,
      });

      signIn(sessionResp.access_token);
      getEvents();
      getUserFirstUpcomingEvent();

      return router.replace(`/${params?.redirectTo ?? "(dashboard)"}`);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error al iniciar sesión",
        onHide: () => {
          setSubmitting(false);
        },
      });
    }
  };

  return (
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      <SafeAreaView className="h-full">
        <KeyboardAwareScrollView>
          <View
            className="w-full flex justify-start h-full px-4"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Logo />
            <Text className="text-2xl font-semibold text-white mt-12 font-psemibold">
              Inicia Sesión
            </Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: any) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: any) => setForm({ ...form, password: e })}
              otherStyles="mt-3"
              autoComplete="password"
              autoCapitalize="none"
            />
            <CustomButton
              title="Login"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className="flex flex-row items-center justify-center mt-6">
              <Text className="text-base text-gray-100 font-pregular ">
                ¡Ingresa con!
              </Text>
            </View>

            {
              Platform.OS === "ios" ? (
                <View className="flex flex-row items-center justify-between mt-6 rounded-xl">
                  <SignWithGoogle
                    setUser={setUser}
                    redirectTo={params?.redirectTo ?? "(dashboard)"}
                  />

                  {/* <SignWithApple
                  setUser={setUser}
                  redirectTo={params?.redirectTo ?? "(dashboard)"}
                /> */}
                </View>
              ) : null
              // <View className="flex flex-row items-center justify-between mt-6 rounded-xl">
              //   <SignWithGoogle
              //     setUser={setUser}
              //     redirectTo={params?.redirectTo ?? "(dashboard)"}
              //   />
              // </View>
            }

            <View className="flex flex-row items-center justify-center mt-6">
              <Text className="text-sm text-gray-100 font-pregular text-center">
                Al iniciar sesión con Google o Apple, aceptas nuestras{" "}
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await WebBrowser.openBrowserAsync(TERMS_URL);
                  }}
                >
                  <Text className="text-primary-500 font-psemibold">
                    Condiciones de uso
                  </Text>
                </TouchableWithoutFeedback>{" "}
                y nuestra{" "}
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await WebBrowser.openBrowserAsync(POLICY_URL);
                  }}
                >
                  <Text className="text-primary-500 font-psemibold">
                    Política de privacidad
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>

            <View className="flex justify-center pt-6 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                No tienes cuenta?
              </Text>
              <Link
                href={`/sign-up?redirectTo=${
                  params?.redirectTo ?? "(dashboard)"
                }`}
                className="text-lg font-psemibold text-primary-500"
              >
                Registrate
              </Link>
            </View>

            <View className="flex justify-center pt-4 flex-row gap-2 pb-8">
              <Link
                href="/forgot-password"
                className="text-base font-psemibold text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;
