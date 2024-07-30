// import SkeletonLoading from "expo-skeleton-loading";
import { Text, View } from "react-native";

export const UserInfoSkeleton = () => {
  /* Profile view */
  return (
    <View className="flex flex-row bg-white rounded-xl mx-2 py-6 px-8 justify-between mb-8">
      <View className=" w-[30%]">
        <View className="w-[80px] h-[80px] rounded-full shadow-2xl bg-secondary-100" />
      </View>
      <View className="justify-center -ml-8 w-[50%] ">
        <View className=" bg-secondary-100 w-[100%] h-[16px] mb-4" />
        <View className=" bg-secondary-100 w-[100%] h-[16px] mb-4" />
        <View className=" bg-secondary-100 w-[100%] h-[16px] mb-4" />
      </View>
      <View className="justify-center -ml-8 w-[20%]" />
    </View>
  );
};

export const UserActionsSkeleton = () => {
  return (
    <View className="mb-8">
      <View className="mb-4 w-[30%] ml-4">
        <View className=" bg-secondary-100 w-[100%] h-[16px] mb-2" />
      </View>
      <View className="flex flex-row p-2 justify-between gap-4">
        <View className="flex bg-white rounded-xl grow p-4 justify-between">
          <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
            <View className="h-[64px] w-[64px]" />
          </View>
          <View className=" bg-secondary-100 w-[100%] h-[8px] mb-2" />
          <View className=" bg-secondary-100 w-[100%] h-[16px] mb-2" />
        </View>
        <View className="flex bg-white rounded-xl grow p-4 justify-between">
          <View className="flex items-center bg-secondary-100 p-8 rounded-xl mb-2">
            <View className="h-[64px] w-[64px]" />
          </View>
          <View className=" bg-secondary-100 w-[100%] h-[8px] mb-2" />
          <View className=" bg-secondary-100 w-[100%] h-[16px] mb-2" />
        </View>
      </View>
    </View>
  );
};

export const UserEventsSkeleton = () => {
  /* next events */
  return (
    <View className="flex mx-2">
      <View className="mb-4">
        <Text className="text-white font-bold text-xl mx-2">
          Tus próximos eventos
        </Text>
      </View>
      <View className="mb-4 bg-secondary-100 h-[16px] w-[30%] " />
      <View className="mb-4">
        <View className=" bg-secondary-100 w-[100%] h-[16px] mb-2" />
      </View>
      <View className="bg-white rounded-xl mx-2"></View>
    </View>
  );
};
