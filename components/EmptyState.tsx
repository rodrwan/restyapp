import { router } from "expo-router";
import { View, Text, Image } from "react-native";

// import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }: any) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title="Comprar tickets"
        handlePress={() => router.push("../")}
        containerStyles="my-5 justify-center items-center"
        textStyles="text-white text-center"
      />
    </View>
  );
};

export default EmptyState;
