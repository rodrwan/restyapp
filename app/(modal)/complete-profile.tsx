import { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import useUserStore from "@/stores/useUser";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "rut.js";
import useSession from "@/hooks/useSession";

const genderOptions = [
  { label: "Masculino", value: "male" },
  { label: "Femenino", value: "female" },
  { label: "Otro", value: "other" },
];

const CompleteProfile = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUserStore();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { updateUserExtra } = useSession();

  const [form, setForm] = useState({
    dni: "",
    gender: "",
    birth_date: new Date(),
  });

  const [scrollY, setScrollY] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" && scrollY <= 30 ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex flex-row items-center rounded-full border border-primary-400 justify-center items-center p-2 bg-secondary-500"
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.primary[500]}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [scrollY]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm({ ...form, birth_date: selectedDate });
    }
  };

  const submit = async () => {
    setSubmitting(true);
    if (!form.dni || !form.gender) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos",
        onHide: () => {
          setSubmitting(false);
        },
      });
      return;
    }

    try {
      await updateUserExtra({ ...form });

      setUser({
        ...user,
        dni: form.dni,
        gender: form.gender,
        birth_date: form.birth_date,
      });

      router.replace("/");
    } catch (err: any) {
      console.log("err", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error al actualizar el perfil",
        onHide: () => {
          setSubmitting(false);
        },
      });
    }
  };

  return (
    <LinearGradient colors={["#04121A", "#092838"]} className="flex-1">
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
            <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
              Completa tu perfil
            </Text>

            <FormField
              title="DNI"
              value={form.dni}
              handleChangeText={(e: string) =>
                setForm({ ...form, dni: format(e) })
              }
              otherStyles="mt-7"
              keyboardType="numeric"
            />

            <View className="mt-4">
              <Text className="text-gray-100 mb-2">Género</Text>
              <View className="flex-row gap-4">
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setForm({ ...form, gender: option.value })}
                    className={`px-4 py-2 rounded-full ${
                      form.gender === option.value
                        ? "bg-primary-500"
                        : "bg-gray-700"
                    }`}
                  >
                    <Text className="text-white">{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-gray-100 mb-2">Fecha de nacimiento</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <Text className="text-white">
                  {form.birth_date.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={form.birth_date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <CustomButton
              title="Guardar"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </KeyboardAwareScrollView>
        <Toast topOffset={100} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CompleteProfile;
