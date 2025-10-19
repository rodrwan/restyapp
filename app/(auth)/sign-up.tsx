import { useLayoutEffect, useState } from "react";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import useSession from "@/hooks/useSession";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useUserStore from "@/stores/useUser";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthProvider";
import { POLICY_URL } from "@/constants";
import * as WebBrowser from "expo-web-browser";

const SignUp = () => {
  const { createUser } = useSession();
  const { getEvents } = useGetEventsFromUser();
  const { signIn } = useAuthContext();
  const { setUser } = useUserStore();
  const params: any = useLocalSearchParams();

  const navigation = useNavigation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptedTerms: false,
  });

  const [scrollY, setScrollY] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" && scrollY <= 30 ? (
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
  }, [navigation, scrollY]);

  const submit = async () => {
    setSubmitting(true);
    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.password === "" ||
      !form.acceptedTerms
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Debes llenar todos los campos y aceptar las políticas de privacidad",
        onHide: () => {
          setSubmitting(false);
        },
      });
      return;
    }

    try {
      const sessionResp = await createUser(
        form.firstName ?? "",
        form.lastName ?? "",
        form.email,
        form.password,
        "",
        "resty"
      );
      if (!sessionResp) {
        throw new Error("Error al iniciar sesión");
      }

      setUser({
        ...sessionResp.user,
      });

      signIn(sessionResp?.access_token);
      getEvents();
      return router.replace(`/${params?.redirectTo}`);
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
    <LinearGradient
      colors={[Colors.black[100], Colors.white]}
      className="flex-1"
    >
      <SafeAreaView className="h-full">
        <KeyboardAwareScrollView
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          <View
            className="w-full flex justify-start h-full px-4"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Logo />
            <Text className="text-2xl font-semibold text-black-900 font-psemibold">
              Registro
            </Text>

            <FormField
              title="Nombre"
              value={form.firstName}
              handleChangeText={(e: any) => setForm({ ...form, firstName: e })}
              otherStyles="mt-7"
              autoComplete="name"
            />

            <FormField
              title="Apellido"
              value={form.lastName}
              handleChangeText={(e: any) => setForm({ ...form, lastName: e })}
              otherStyles="mt-4"
              autoComplete="name-family"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: any) => setForm({ ...form, email: e })}
              otherStyles="mt-4"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: any) => setForm({ ...form, password: e })}
              otherStyles="mt-4 mb-7"
              autoComplete="password"
            />

            <TouchableOpacity
              className="w-full self-center justify-center flex-row items-center gap-2"
              onPress={() =>
                setForm({ ...form, acceptedTerms: !form.acceptedTerms })
              }
            >
              <View
                className={`w-5 h-5 border rounded ${
                  form.acceptedTerms
                    ? "bg-primary-500 border-primary-500"
                    : "border-gray-400"
                } justify-center items-center`}
              >
                {form.acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View className="flex-row flex-wrap">
                <Text className="text-black-400">Acepto las </Text>
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await WebBrowser.openBrowserAsync(POLICY_URL);
                  }}
                >
                  <Text className="text-primary-500 font-psemibold">
                    Política de privacidad
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>

            <CustomButton
              title="Registrarse"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2 pb-8">
              <Text className="text-lg text-black-400 font-pregular">
                Ya tienes cuenta?
              </Text>
              <Link
                href={`/sign-in?redirectTo=${params.redirectTo}`}
                className="text-lg font-psemibold text-primary-500"
              >
                Login
              </Link>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;
