import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { User } from "./types";

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = React.memo(
  ({ user }) => (
    <View className="flex flex-row bg-white rounded-xl mx-4 py-6 px-8 justify-between my-4">
      <View className="w-1/4">
        <Image
          source={{ uri: user.picture }}
          className="w-[80px] h-[80px] rounded-full shadow-2xl border border-secondary-500"
          style={styles.elevationLow}
        />
      </View>
      <View className="w-3/4 justify-center ml-4">
        <Text className="text-base" numberOfLines={1}>
          {user.firstname} {user.lastname}
        </Text>
        <Text className="text-base">{user.dni}</Text>
        <Text className="text-xs text-secondary-200">{user.email}</Text>
      </View>
    </View>
  )
);

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

export default UserProfileCard;
