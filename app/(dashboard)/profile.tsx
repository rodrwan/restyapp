import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  UserProfileCard,
  PaymentMethodSection,
  isProfileIncomplete,
  ProfileBanner,
} from "@/components/dashboard";
import useUserStore from "@/stores/useUser";
import useEventStore from "@/stores/useEvent";
import useCreateInscription from "@/hooks/useCreateInscription";
import useAuth from "@/hooks/useAuth";

const ProfilePage = () => {
  const { user } = useUserStore();
  const { event } = useEventStore();
  const { loadingUserData, checkAuth } = useAuth();
  const { createInscription } = useCreateInscription(event?.id);

  React.useEffect(() => {
    // Solo hacer la llamada si no tenemos datos del usuario
    if (!user) {
      checkAuth();
    }
  }, [user]); // Removed checkAuth from dependencies to prevent infinite loop

  const profileIncomplete = useMemo(() => isProfileIncomplete(user), [user]);

  const handleCompleteProfile = useCallback(() => {
    router.push("/(modal)/complete-profile");
  }, []);

  if (loadingUserData) {
    return (
      <LinearGradient colors={["#04121A", "#041e2b"]} className="flex h-full">
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
    <LinearGradient colors={["#04121A", "#041e2b"]} className="flex-1">
      <View className="flex-1">
        <ScrollView className="flex-1">
          {/* Profile view */}
          <UserProfileCard user={user} />

          <View className="flex flex-row mx-4 py-6 justify-between mb-8">
            <PaymentMethodSection
              user={user}
              onSubmitRegisterCard={onSubmitRegisterCard}
            />
          </View>
        </ScrollView>

        {profileIncomplete && <ProfileBanner onPress={handleCompleteProfile} />}

        {/* Botón al final de la pantalla */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="p-4 rounded-xl w-full"
            onPress={() => router.push("/(modal)/delete")}
          >
            <Text className="text-primary-300 text-md font-regular underline text-center">
              Eliminar cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ProfilePage;
