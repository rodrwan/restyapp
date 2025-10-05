import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
} from "react-native";
import { User } from "./types";
import { Ionicons } from "@expo/vector-icons";

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = React.memo(
  ({ user }) => {
    return (
      <View className="flex flex-coljustify-center items-center align-center relative">
        <Image
          source={require("../../assets/images/hero_banner2.jpeg")}
          resizeMode="cover"
          className="w-full h-44 absolute top-0 left-0 rounded-b-xl"
        />
        <View className="flex flex-col rounded-b-xl items-center justify-center mb-4 bg-secondary-500/20 w-full h-44">
          {user?.picture !== "" ? (
            <Image
              source={{ uri: user?.picture }}
              className="w-[80px] h-[80px] rounded-full"
              style={styles.elevationLow}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="white" />
          )}

          <View className="w-full justify-center items-center mt-2">
            <Text className="text-base font-bold text-white" numberOfLines={1}>
              {user?.firstname} {user?.lastname}
            </Text>
            <Text className="text-base text-secondary-200 text-white">
              {user?.email}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  elevationLow: {
    width: 80,
    height: 80,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default UserProfileCard;
