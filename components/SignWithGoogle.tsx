import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import GoogleIcon from "./GoogleIcon";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import useSession from "@/hooks/useSession";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import { useAuthContext } from "@/context/AuthProvider";

const SignWithGoogle = ({ setUser, redirectTo }: any) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { createSession, createUser } = useSession();
  const { signIn } = useAuthContext();
  const { getEvents } = useGetEventsFromUser();

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
      const sessionResp = await createSession(
        userInfo?.user?.email,
        userInfo?.user?.id,
        "google"
      );

      // Create user if not exists
      // TODO: this logic need to be moved to other view to ask for privacy policy acceptance.
      if (!sessionResp && userInfo && userInfo.user) {
        const sessionResp = await createUser(
          userInfo?.user?.givenName ?? "",
          userInfo?.user?.familyName ?? "",
          userInfo?.user?.email,
          userInfo?.user?.id,
          userInfo?.user?.photo ?? "",
          "google"
        );

        setUser({
          ...userInfo?.user,
          ...sessionResp.user,
        });

        signIn(sessionResp?.access_token);
        getEvents();

        console.log("redirectTo", redirectTo);
        router.replace(`/${redirectTo}`);
      } else {
        setUser({
          ...userInfo?.user,
          ...sessionResp.user,
        });

        signIn(sessionResp?.access_token);
        getEvents();

        console.log("redirectTo", redirectTo);
        router.replace(`/${redirectTo}`);
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
    <TouchableOpacity
      className={`flex flex-row w-full min-h-[60px] bg-white justify-center items-center rounded-xl border border-black-200 ${
        Platform.OS !== "ios" ? "w-full" : ""
      }`}
      onPress={() => {
        _signIn();
      }}
    >
      {isSubmitting ? (
        <ActivityIndicator
          animating={isSubmitting}
          color={Colors.secondary[500]}
          size="small"
          className="ml-2"
        />
      ) : (
        <View className="flex w-full h-[32px] items-center">
          <GoogleIcon size={4} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SignWithGoogle;
