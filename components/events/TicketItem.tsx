import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Item } from "@/app/types";

interface TicketItemProps {
  item: Item;
  index: number;
  type: "ENTRANCE" | "DRINK";
  itemsInCart: any[];
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
  nominated?: boolean;
  endAt?: string;
}

export function TicketItem({
  item,
  index,
  type,
  itemsInCart,
  addToCart,
  removeFromCart,
  nominated,
  endAt,
}: TicketItemProps) {
  const quantity =
    itemsInCart?.find(
      (cartItem: any) => cartItem?.type === type && cartItem?.id === item?.id
    )?.quantity ?? 0;

  const maxPerSale =
    item?.max_per_sale < item?.stock ? item?.max_per_sale : item?.stock;
  const disabledAdd = maxPerSale <= quantity;

  return (
    <View
      className={`flex flex-row justify-between ${
        index % 2 === 0 ? "bg-secondary-500" : "bg-secondary-600"
      } p-4 mx-2 rounded-xl mb-2`}
    >
      <View className="flex flex-col">
        <Text className="text-white text-base font-bold mb-2">
          {item?.name}
          {nominated && (
            <Text className="py-1.5 text-xs text-secondary-200">
              (Nominada)
            </Text>
          )}
        </Text>
        {nominated && endAt && (
          <Text className="py-1.5 text-secondary-200" numberOfLines={1}>
            Válido hasta las {endAt}
          </Text>
        )}
        <Text className="text-primary-500 text-base mb-2">
          ${Number(item?.price).toLocaleString("es-CL")} c/u
        </Text>
        {disabledAdd && (
          <Text className="text-error-300 text-xs">
            No puedes agregar más entradas
          </Text>
        )}
      </View>
      {item?.stock > 0 ? (
        <QuantityControls
          quantity={quantity}
          disabledAdd={disabledAdd}
          onAdd={() => addToCart(item)}
          onRemove={() => removeFromCart(item)}
        />
      ) : (
        <SoldOutBadge />
      )}
    </View>
  );
}

function QuantityControls({
  quantity,
  disabledAdd,
  onAdd,
  onRemove,
}: {
  quantity: number;
  disabledAdd: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="flex flex-row gap-2 items-center">
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="remove-circle-outline" color={Colors.white} size={32} />
      </TouchableOpacity>
      <Text className="text-white text-xl">{quantity}</Text>
      <TouchableOpacity onPress={onAdd} disabled={disabledAdd}>
        <Ionicons
          name="add-circle-outline"
          color={disabledAdd ? Colors.secondary[300] : Colors.primary[500]}
          size={32}
        />
      </TouchableOpacity>
    </View>
  );
}

function SoldOutBadge() {
  return (
    <View className="flex flex-col items-center justify-center">
      <Text className="text-error-300 text-xl">Agotado</Text>
    </View>
  );
}
