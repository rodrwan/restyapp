import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import GoogleIcon from "./GoogleIcon";
import Colors from "@/constants/Colors";
import useSession from "@/hooks/useSession";
import useAuthStore from "@/stores/useAuth";
import { router } from "expo-router";

const SignWithGoogle = ({ setUser, getEvents, redirectTo }: any) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { createSession, createUser } = useSession();
  const { login, setAccessToken } = useAuthStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "769679276829-2bojhmuhkfggk5d9q98hb4i909836msg.apps.googleusercontent.com",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ], // what API you want to access on behalf of the user, default is email and profile
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      iosClientId:
        "769679276829-og604t40g8f121sikec8vtpogmkq6iie.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });
  });

  const _signIn = async () => {
    setSubmitting(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo", userInfo);
      const sessionResp = await createSession(
        userInfo?.user?.email,
        userInfo?.user?.id,
        "google"
      );

      console.log("sessionResp", sessionResp);
      if (!sessionResp && userInfo && userInfo.user) {
        console.log("create new user");
        const sessionResp = await createUser(
          userInfo?.user?.givenName ?? "",
          userInfo?.user?.familyName ?? "",
          userInfo?.user?.email,
          userInfo?.user?.id,
          userInfo?.user?.photo ?? "",
          "google"
        );

        console.log("sessionResp after create", sessionResp);

        setUser({
          ...userInfo?.user,
          ...sessionResp.user,
        });
        login();
        setAccessToken(sessionResp.access_token);
        getEvents();
        router.replace(redirectTo);
      } else {
        setUser({
          ...userInfo?.user,
          ...sessionResp.user,
        });
        login();
        setAccessToken(sessionResp.access_token);
        getEvents();
        router.replace(redirectTo);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
            console.log("Google error ", error);
        }
      } else {
        console.log("Mangoticket error", error);
      }
    }

    setSubmitting(false);
  };

  return (
    <View className="flex w-full justify-center items-center mt-4">
      <TouchableOpacity
        className="flex flex-row w-full min-h-[60px] bg-white justify-center items-center rounded-xl"
        onPress={() => {
          _signIn();
        }}
      >
        <View className="flex w-[32px] h-[32px] items-center mr-6">
          <GoogleIcon size={4} />
        </View>
        <Text className="text-lg font-semibold text-secondary-500 self-center">
          Login con Google
        </Text>
        {isSubmitting && (
          <ActivityIndicator
            animating={isSubmitting}
            color={Colors.secondary[500]}
            size="small"
            className="ml-2"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignWithGoogle;
