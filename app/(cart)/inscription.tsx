import { ActivityIndicator, Platform, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import queryString from "query-string";
import useConfirmInscription from "@/hooks/useConfirmInscription";
import useUserStore from "@/stores/useUser";

const Payment = () => {
  const params: any = useLocalSearchParams();
  const router = useRouter();
  const { confirmInscription } = useConfirmInscription();
  const { setTbkCardNumber } = useUserStore();

  return (
    <View className="flex flex-1">
      <WebView
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
          flex: 1,
          alignItems: "center",
        }}
        source={{
          uri: params.url,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `TBK_TOKEN=${params.token}`,
        }}
        cacheEnabled={false}
        onNavigationStateChange={async (navState) => {
          console.log("navState", navState);
          if (navState.url.indexOf("/api/inscription") > -1) {
            const parsed: any = queryString.parseUrl(navState.url);

            const { TBK_TOKEN } = parsed.query;
            // call confirm payment using token_ws
            if (TBK_TOKEN) {
              try {
                const result = await confirmInscription(TBK_TOKEN);
                if (result) {
                  console.log("success");
                  router.dismissAll();
                  setTbkCardNumber(result?.tbk_user, result?.card_number);
                  return router.push(`/(cart)`);
                }
                console.log("failure");
                router.dismissAll();
                // rejected by other mean.
                return router.push("/(cart)/failure");
              } catch (err) {
                console.log("failure", err);
                router.dismissAll();
                // rejected by other mean.
                return router.push("/(cart)/failure");
              }
            } else {
              console.log("failure");
              // this happen when a payment is cancelled
              // call confirm payment using TBK_TOKEN
              return router.back();
            }
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error: ", nativeEvent);
        }}
        injectedJavaScript={`
            const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
            if (!iOS) {
              const meta = document.createElement('meta');
              let initialScale = 1;
              if(screen.width <= 800) {
               initialScale = ((screen.width / window.innerWidth) + 0.1).toFixed(2);
              }
              const content = 'width=device-width, initial-scale=' + initialScale ;
              meta.setAttribute('name', 'viewport');
              meta.setAttribute('content', content);
              document.getElementsByTagName('head')[0].appendChild(meta);
            }
          `}
        scalesPageToFit={Platform.OS === "ios"}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="black"
            size="large"
            className="flex self-center "
          />
        )}
      />
    </View>
  );
};

export default Payment;
