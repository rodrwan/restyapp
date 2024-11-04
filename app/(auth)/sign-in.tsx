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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import SignWithGoogle from "@/components/SignWithGoogle";
import useUserStore from "@/stores/useUser";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
  const navigation = useNavigation();
  const params: any = useLocalSearchParams();
  console.log("params", params);
  const { setUser } = useUserStore();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
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
    });
  }, []);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  return (
    <SafeAreaView className="bg-secondary-500 h-full">
      <KeyboardAwareScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Logo />
          <Text className="text-2xl font-semibold text-white mt-16 font-psemibold">
            Inicia Sesión
          </Text>
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
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <SignWithGoogle setUser={setUser} redirectTo={params.redirectTo} />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              No tienes cuenta?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-primary-500"
            >
              Registrate
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
