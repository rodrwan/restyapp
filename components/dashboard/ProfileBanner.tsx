import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProfileBannerProps {
  onPress: () => void;
}

const ProfileBanner: React.FC<ProfileBannerProps> = React.memo(
  ({ onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="p-2 mx-2 justify-center items-center bg-white/10 rounded-xl mb-4"
      activeOpacity={0.8}
    >
      <Text className="text-base font-base text-white text-center">
        ¡Hola! Para brindarte una mejor experiencia, necesitamos algunos datos
        adicionales para completar tu perfil.
      </Text>

      <View className="flex flex-row justify-center items-center bg-primary-500 p-4 rounded-xl mt-4">
        <Text className="text-base font-bold  text-white">
          Completar perfil
        </Text>
      </View>
    </TouchableOpacity>
  )
);

export default ProfileBanner;
