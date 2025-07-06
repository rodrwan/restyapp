import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProfileBannerProps {
  onPress: () => void;
}

const ProfileBanner: React.FC<ProfileBannerProps> = React.memo(
  ({ onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="p-2 mx-4 justify-center items-center bg-white rounded-xl mb-4"
      activeOpacity={0.8}
    >
      <Text className="text-base font-base text-center">
        ¡Hola! Para brindarte la mejor experiencia, necesitamos algunos datos
        adicionales de tu perfil. Con esta información podremos recomendarte
        eventos que realmente te interesen.
      </Text>
      <View className="flex flex-row justify-center items-center bg-primary-500 p-4 rounded-xl mt-4">
        <Text className="text-base font-base text-white">Completar perfil</Text>
      </View>
    </TouchableOpacity>
  )
);

export default ProfileBanner;
