import { ActivityIndicator, Platform, View } from "react-native";
import React from "react";
import * as AppleAuthentication from "expo-apple-authentication";

import { router } from "expo-router";
import useSession from "@/hooks/useSession";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import { useAuthContext } from "@/context/AuthProvider";
import Colors from "@/constants/Colors";

const SignWithApple = ({ setUser, redirectTo }: any) => {
  const [isSubmitting, setSubmitting] = React.useState(false);
  const { createSession, createUser } = useSession();
  const { signIn } = useAuthContext();
  const { getEvents } = useGetEventsFromUser();

  // Verificar si Apple Sign In está disponible
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = React.useState(false);

  React.useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        console.log("Apple Sign In disponible:", isAvailable);
        setIsAppleAuthAvailable(isAvailable);
      } catch (error) {
        console.error("Error verificando disponibilidad:", error);
      }
    };

    checkAvailability();
  }, []);

  const _signIn = async ({ id, email, familyName, givenName }: any) => {
    setSubmitting(true);
    try {
      const sessionResp = await createSession(email, id, "apple");

      // Create user if not exists
      // TODO: this logic need to be moved to other view to ask for privacy policy acceptance.
      if (!sessionResp) {
        const sessionResp = await createUser(
          givenName ?? "",
          familyName ?? "",
          email,
          id,
          "",
          "apple"
        );

        setUser({
          id,
          email,
          familyName,
          givenName,
          ...sessionResp.user,
        });

        signIn(sessionResp?.access_token);
        getEvents();

        console.log("redirectTo", redirectTo);
        router.replace(`/${redirectTo}`);
      } else {
        setUser({
          id,
          email,
          familyName,
          givenName,
          ...sessionResp.user,
        });

        signIn(sessionResp?.access_token);
        getEvents();

        console.log("redirectTo", redirectTo);
        router.replace(`/${redirectTo}`);
      }
    } catch (error) {
      console.log("Resty Apple error", error);
    }

    setSubmitting(false);
  };

  if (Platform.OS !== "ios") {
    return null;
  }

  if (!isAppleAuthAvailable) {
    console.log("Apple Sign In no está disponible");
    return null;
  }

  return (
    <View className="flex items-center justify-center w-[48%] min-h-[60px] bg-black rounded-xl">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        className="w-[60px] min-h-[60px]"
        onPress={async () => {
          setSubmitting(true);
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            _signIn({
              email: credential?.email,
              id: credential?.user,
              familyName: credential?.fullName?.familyName,
              givenName: credential?.fullName?.givenName,
            });
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              console.log("Usuario canceló el inicio de sesión");
            } else {
              console.error("Error no manejado:", e);
            }
          } finally {
            setSubmitting(false);
          }
        }}
      />

      {isSubmitting && (
        <ActivityIndicator
          animating={isSubmitting}
          color={Colors.secondary[500]}
          size="small"
          className="ml-2"
        />
      )}
    </View>
  );
};

export default SignWithApple;
