import { router } from "expo-router";
import { View, Text, Image } from "react-native";

// import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle, withButton }: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 16,
        minHeight: 400,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#f3f4f6" }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "600",
            color: "white",
          }}
        >
          {subtitle}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          flex: 1,
          marginTop: 50,
        }}
      >
        <Image
          source={require("../assets/images/splash.png")}
          style={{
            width: "80%",
            height: "60%",
            resizeMode: "contain",
            opacity: 0.1,
          }}
        />
      </View>

      {withButton && (
        <CustomButton
          title="Comprar tickets"
          handlePress={() => router.push("/(home)")}
          containerStyles="my-5 justify-center items-center"
          textStyles="text-white text-center"
        />
      )}
    </View>
  );
};

export default EmptyState;
