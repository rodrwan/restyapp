import { useLayoutEffect, useState } from "react";
import { Link, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import useSession from "@/hooks/useSession";
import useAuthStore from "@/stores/useAuth";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useUserStore from "@/stores/useUser";

const SignUp = () => {
  const { createUser } = useSession();
  const { getEvents, getUserFirstUpcomingEvent } = useGetEventsFromUser();
  const { login, setAccessToken } = useAuthStore();
  const { setUser } = useUserStore();

  const navigation = useNavigation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => router.push("/")}
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
  }, []);

  const submit = async () => {
    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.password === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const sessionResp = await createUser(
      form.firstName ?? "",
      form.lastName ?? "",
      form.email,
      form.password,
      "",
      "mangoticket"
    );

    setUser({
      ...sessionResp.user,
    });
    login();
    setAccessToken(sessionResp.access_token);
    getEvents();
    getUserFirstUpcomingEvent();
    router.replace("/(dashboard)");
  };

  return (
    <SafeAreaView className="bg-secondary-500 h-full">
      <KeyboardAwareScrollView className="bg-secondary-500">
        <View
          className="w-full flex justify-center h-full px-4 my-6 bg-secondary-500"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Logo />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Registro
          </Text>

          <FormField
            title="Nombre"
            value={form.firstName}
            handleChangeText={(e: any) => setForm({ ...form, firstName: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Apellido"
            value={form.lastName}
            handleChangeText={(e: any) => setForm({ ...form, lastName: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Registrarse"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Ya tienes cuenta?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-primary-500"
            >
              Login
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
