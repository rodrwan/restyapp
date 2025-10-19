import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/Colors";
import { Dish, CustomizationOption } from "@/app/(rest)/types";

interface DishDetailModalProps {
  visible: boolean;
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    selectedOptions: CustomizationOption[],
    totalPrice: number
  ) => void;
}

const DishDetailModal: React.FC<DishDetailModalProps> = ({
  visible,
  dish,
  onClose,
  onAddToCart,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Map<string, CustomizationOption>
  >(new Map());

  // Reiniciar opciones seleccionadas cuando cambia el plato
  React.useEffect(() => {
    setSelectedOptions(new Map());
  }, [dish]);

  const toggleOption = (option: CustomizationOption) => {
    setSelectedOptions((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(option.description)) {
        newMap.delete(option.description);
      } else {
        newMap.set(option.description, option);
      }
      return newMap;
    });
  };

  const totalPrice = useMemo(() => {
    if (!dish) return 0;
    const basePrice = dish.price;
    const optionsPrice = Array.from(selectedOptions.values()).reduce(
      (sum, option) => sum + option.priceModifier,
      0
    );
    return basePrice + optionsPrice;
  }, [dish, selectedOptions]);

  const handleAddToCart = () => {
    if (!dish) return;
    const options = Array.from(selectedOptions.values());
    onAddToCart(dish, options, totalPrice);
    onClose();
  };

  if (!dish) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        {/* Header con botón cerrar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            paddingTop: 50, // Espacio para el status bar
            borderBottomWidth: 1,
            borderBottomColor: Colors.grayWhite,
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.black[600],
              flex: 1,
            }}
          >
            Personalizar pedido
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.lightWhite,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={20} color={Colors.black[900]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 100 }} // Más espacio para el footer
        >
          {/* Imagen del plato */}
          {dish.imageUrl && (
            <Image
              source={{ uri: dish.imageUrl }}
              style={{ width: "100%", height: 256 }}
              resizeMode="cover"
            />
          )}

          {/* Información del plato */}
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: Colors.black[600],
                marginBottom: 8,
              }}
            >
              {dish.name}
            </Text>
            {dish.description && (
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black[400],
                  marginBottom: 16,
                }}
              >
                {dish.description}
              </Text>
            )}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: Colors.primary[500],
                marginBottom: 16,
              }}
            >
              ${dish.price.toLocaleString("es-CL")}
            </Text>

            {/* Opciones de personalización */}
            {dish.customizationOptions &&
              dish.customizationOptions.length > 0 && (
                <View
                  style={{
                    marginBottom: selectedOptions.size === 0 ? 40 : 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: Colors.black[600],
                      marginBottom: 12,
                    }}
                  >
                    Personaliza tu pedido ({dish.customizationOptions.length}{" "}
                    opciones)
                  </Text>
                  {dish.customizationOptions.map((option, index) => {
                    const isSelected = selectedOptions.has(option.description);
                    return (
                      <Pressable
                        key={`${option.description}-${index}`}
                        onPress={() => toggleOption(option)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 16,
                          marginBottom: 8,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: isSelected
                            ? Colors.primary[500]
                            : Colors.grayWhite,
                          backgroundColor: isSelected
                            ? Colors.warning[50]
                            : Colors.white,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              borderWidth: 2,
                              borderColor: isSelected
                                ? Colors.primary[500]
                                : Colors.black[200],
                              backgroundColor: isSelected
                                ? Colors.primary[500]
                                : Colors.white,
                              marginRight: 12,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="white"
                              />
                            )}
                          </View>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 16,
                              color: isSelected
                                ? Colors.black[600]
                                : Colors.black[400],
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            {option.description}
                          </Text>
                        </View>
                        {option.priceModifier !== 0 && (
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: isSelected
                                ? Colors.primary[500]
                                : Colors.black[400],
                            }}
                          >
                            {option.priceModifier > 0 ? "+" : ""}$
                            {option.priceModifier.toLocaleString("es-CL")}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}

            {/* Resumen de opciones seleccionadas */}
            {selectedOptions.size > 0 && (
              <View
                style={{
                  marginBottom: 40,
                  padding: 16,
                  backgroundColor: Colors.lightWhite,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: Colors.black[600],
                    marginBottom: 8,
                  }}
                >
                  Opciones seleccionadas:
                </Text>
                {Array.from(selectedOptions.values()).map((option, index) => (
                  <View
                    key={`selected-${index}`}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: Colors.black[600] }}>
                      • {option.description}
                    </Text>
                    {option.priceModifier !== 0 && (
                      <Text style={{ fontSize: 14, color: Colors.black[400] }}>
                        {option.priceModifier > 0 ? "+" : ""}$
                        {option.priceModifier.toLocaleString("es-CL")}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer con precio total y botón agregar - Fixed */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            paddingBottom: 34, // Espacio para el home indicator en iOS
            borderTopWidth: 1,
            borderTopColor: Colors.lightWhite,
            backgroundColor: "white",
            shadowColor: Colors.black[900],
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, color: Colors.black[400] }}>
              Precio total:
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: Colors.primary[500],
              }}
            >
              ${totalPrice.toLocaleString("es-CL")}
            </Text>
          </View>
          <CustomButton
            title="Agregar al carrito"
            handlePress={handleAddToCart}
            containerStyles="min-h-[52px] rounded-xl"
            textStyles="text-lg font-semibold"
          />
        </View>
      </View>
    </Modal>
  );
};

export default DishDetailModal;
