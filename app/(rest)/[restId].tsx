import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import React from "react";
import EmptyState from "@/components/EmptyState";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import LoadingScreen from "@/components/LoadingScreen";
import useGetRestaurantMenuById from "@/hooks/useGetRestaurantMenuById";
import { useCart } from "@/stores/useCart";
import DishDetailModal from "@/components/food/DishDetailModal";
import { Dish, CustomizationOption } from "@/app/(rest)/types";
const baseURL = `https://placehold.co/125/${Colors.primary[400].replace(
  "#",
  ""
)}/${Colors.black[900].replace("#", "")}/png`;
const restaurantImageURL =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg";

export default function HomePage() {
  const { restId }: any = useLocalSearchParams();
  const { tableId }: any = useLocalSearchParams();
  const { setTableId, setRestaurantId, add } = useCart();

  const [selectedDish, setSelectedDish] = React.useState<Dish | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  React.useEffect(() => {
    setTableId(tableId);
    setRestaurantId(restId);
  }, [tableId, restId, setTableId, setRestaurantId]);

  const { data, loading: isLoading }: any = useGetRestaurantMenuById(restId);
  const navigation = useNavigation<any>();
  const scrollViewRef = React.useRef<any>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "ios",
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary[500],
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="flex flex-row items-center rounded-full border border-primary-500 justify-center items-center p-2 bg-primary-500"
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View />
        ),
    });
  }, [navigation]);

  const handleOpenDishModal = React.useCallback((dish: any) => {
    // Asegurarnos de que customizationOptions exista
    const dishWithOptions = {
      ...dish,
      customizationOptions: dish.customizationOptions || [],
    };
    setSelectedDish(dishWithOptions);
    setIsModalVisible(true);
  }, []);

  const handleCloseDishModal = React.useCallback(() => {
    setIsModalVisible(false);
    setSelectedDish(null);
  }, []);

  const handleAddToCart = React.useCallback(
    (
      dish: Dish,
      selectedOptions: CustomizationOption[],
      totalPrice: number
    ) => {
      add({
        id: dish.id || dish.name,
        name: dish.name,
        subtotal: dish.price,
        total: totalPrice,
        image_url: dish.imageUrl || "",
        customizationOptions: selectedOptions,
      });
    },
    [add]
  );

  const renderHeader = React.useCallback(
    () => (
      <View style={{ paddingVertical: 16 }}>
        <Text className="text-black-900 font-bold text-2xl">
          Menu
          <Ionicons name="add-outline" size={20} color={Colors.primary[500]} />
        </Text>
      </View>
    ),
    []
  );

  const renderDish = React.useCallback(
    (dish: any) => (
      <TouchableOpacity
        onPress={() => handleOpenDishModal(dish)}
        className="flex flex-row bg-white border border-black-200 rounded-xl mb-2 p-1"
      >
        <View className="mr-2 w-[125px]">
          <Image
            source={{
              uri: dish.imageUrl || baseURL,
            }}
            resizeMode="cover"
            className="rounded-xl aspect-square"
          />
        </View>
        <View className="flex-1 flex-col justify-between">
          <View className="flex flex-col">
            <Text className="text-xl text-black font-medium">{dish?.name}</Text>
            <Text
              className="text-base text-black-400 font-normal"
              numberOfLines={1}
            >
              {dish?.description}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between mt-2">
            <Text className="text-base text-black font-medium">
              $ {dish?.price.toLocaleString("es-CL")}
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-500 rounded-full p-2">
              <Ionicons name="add-outline" size={20} color={Colors.white} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleOpenDishModal]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => {
      return (
        <View className="mb-4">
          <Text className="text-xl text-black-900 font-medium mb-2">
            {item?.name}
          </Text>

          {/* Renderear dishes directos si existen */}
          {item.dishes && item.dishes.length > 0 && (
            <View className="mb-4">
              {item.dishes.map((dish: any, index: number) => (
                <View key={dish.id || `${item.id}-dish-${index}`}>
                  {renderDish(dish)}
                </View>
              ))}
            </View>
          )}

          {/* Renderear subcategorías si existen */}
          {item.subCategories && item.subCategories.length > 0 && (
            <View className="mb-4">
              {item.subCategories.map((subCategory: any, subIndex: number) => (
                <View
                  key={subCategory.id || `${item.id}-subcat-${subIndex}`}
                  className="mb-3"
                >
                  <Text className="text-base text-black-600 font-medium mb-2">
                    {subCategory?.name}
                  </Text>
                  {subCategory.dishes.map((dish: any, dishIndex: number) => (
                    <View
                      key={
                        dish.id ||
                        `${item.id}-${
                          subCategory.id || subIndex
                        }-dish-${dishIndex}`
                      }
                    >
                      {renderDish(dish)}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      );
    },
    [renderDish]
  );

  const renderEmpty = React.useCallback(
    () => (
      <EmptyState
        title="El sistema aún no ha encontrado nuevos eventos"
        subtitle="Próximamente acá aparecerán los eventos que disfrutarás"
      />
    ),
    []
  );

  return (
    <ParallaxScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      parallaxHeaderHeight={180}
      stickyHeaderHeight={100}
      contentBackgroundColor={Colors.white}
      backgroundColor={Colors.white}
      scrollViewProps={{
        showsHorizontalScrollIndicator: false,
      }}
      renderBackground={() => (
        <ImageBackground
          source={{
            uri: data?.restaurant?.imageUrl || restaurantImageURL,
          }}
          resizeMode="cover"
          blurRadius={5} // Adjust the blur amount
          style={{
            width: "100%",
            height: 180,
          }}
        >
          {/* overlay image */}
          <View className="absolute top-0 left-0 bg-black-900/40 h-full w-full" />
        </ImageBackground>
      )}
      renderStickyHeader={() => (
        <View className="mx-auto h-[90px] w-full justify-end items-center bg-transparent">
          <Text className="text-black-900 font-bold text-base">
            {data?.restaurant?.name}
          </Text>
        </View>
      )}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
      }}
    >
      <View className="flex flex-col w-full rounded-xl mx-2 py-4">
        <View className="flex items-center justify-center mb-4">
          <View className="flex flex-row items-center justify-center">
            <Text className="text-black-900 font-bold text-2xl text-center mr-2">
              {data?.restaurant?.name}
            </Text>
            <Text className="text-black-600 font-regular text-base text-center">
              {data?.restaurant?.rating}
            </Text>
            <Ionicons name="star" size={16} color={Colors.primary[500]} />
          </View>

          <Text className="text-black-500 font-regular text-medium mb-2 text-center">
            {data?.restaurant?.address}
          </Text>
        </View>

        {isLoading ? (
          <LoadingScreen message="Cargando menu..." />
        ) : data?.categories?.length === 0 ? (
          renderEmpty()
        ) : (
          data?.categories?.map((item: any, index: number) => (
            <View key={item.id || `category-${index}`}>
              {renderItem({ item })}
            </View>
          ))
        )}
      </View>

      <DishDetailModal
        visible={isModalVisible}
        dish={selectedDish}
        onClose={handleCloseDishModal}
        onAddToCart={handleAddToCart}
      />
    </ParallaxScrollView>
  );
}
