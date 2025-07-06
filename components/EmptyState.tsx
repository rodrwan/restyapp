import { router } from "expo-router";
import { View, Text, Image } from "react-native";

// import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle, withButton }: any) => {
  return (
    <View className="flex justify-start items-center px-4 h-screen">
      <View className="flex justify-center items-center">
        <Text className="text-sm font-medium text-gray-100">{title}</Text>
      </View>
      <View className="flex justify-center items-center">
        <Text className="text-xl text-center font-semibold text-white mt-4">
          {subtitle}
        </Text>
      </View>

      <View className="flex justify-start items-center w-full h-full">
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
