import { useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";

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

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear() - 18
  );
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDateConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    setForm({ ...form, birth_date: newDate });
    setShowDatePicker(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Completa tu perfil",
      headerTintColor: Colors.primary[500],
    });
  }, [scrollY]);

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

      return router.back();
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
              ¡Ayúdanos a conocerte mejor!
            </Text>

            <Text className="text-base text-white mt-4 font-psemibold">
              Completa tu DNI, género y fecha de nacimiento para que podamos
              recomendarte eventos que vayan contigo. 😉 ¡Personaliza tu
              experiencia al máximo!
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
                className="bg-gray-700 p-4 rounded-lg flex-row justify-between items-center"
              >
                <Text className="text-white">
                  {form.birth_date.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Modal
              isVisible={showDatePicker}
              onBackdropPress={() => setShowDatePicker(false)}
              className="m-0 justify-end"
            >
              <View className="bg-secondary-800 rounded-t-3xl p-4">
                <View className="flex-row justify-between items-center mb-4">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-primary-500">Cancelar</Text>
                  </TouchableOpacity>
                  <Text className="text-white font-psemibold">
                    Fecha de nacimiento
                  </Text>
                  <TouchableOpacity onPress={handleDateConfirm}>
                    <Text className="text-primary-500">Confirmar</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row">
                  <Picker
                    selectedValue={selectedDay}
                    onValueChange={setSelectedDay}
                    style={{ flex: 1, color: "white" }}
                  >
                    {Array.from(
                      { length: getDaysInMonth(selectedYear, selectedMonth) },
                      (_, i) => (
                        <Picker.Item
                          key={i + 1}
                          label={String(i + 1)}
                          value={i + 1}
                          color="white"
                        />
                      )
                    )}
                  </Picker>

                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={setSelectedMonth}
                    style={{ flex: 1, color: "white" }}
                  >
                    {months.map((month) => (
                      <Picker.Item
                        key={month}
                        label={new Date(2000, month - 1, 1).toLocaleString(
                          "es-ES",
                          {
                            month: "long",
                          }
                        )}
                        value={month}
                        color="white"
                      />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={setSelectedYear}
                    style={{ flex: 1, color: "white" }}
                  >
                    {years.map((year) => (
                      <Picker.Item
                        key={year}
                        label={String(year)}
                        value={year}
                        color="white"
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>

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
