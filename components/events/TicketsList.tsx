import { View, Text, FlatList } from "react-native";
import { TicketItem } from "./TicketItem";
import Colors from "@/constants/Colors";
import { Item } from "@/app/types";

interface TicketsListProps {
  items: Item[];
  type: "ENTRANCE" | "DRINK";
  title: string;
  itemsInCart: any[];
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
  nominated?: boolean;
  endAt?: string;
}

export function TicketsList({
  items,
  type,
  title,
  itemsInCart,
  addToCart,
  removeFromCart,
  nominated,
  endAt,
}: TicketsListProps) {
  if (!items?.length) return null;

  return (
    <View className="bg-secondary-700 py-8 mb-8 mx-1 rounded-3xl">
      <FlatList
        scrollEnabled={false}
        data={items}
        keyExtractor={(item: Item) => item.id}
        renderItem={({ item, index }) => (
          <TicketItem
            item={item}
            index={index}
            type={type}
            itemsInCart={itemsInCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            nominated={nominated}
            endAt={endAt}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex justify-center p-4">
            <Text className="text-white text-left text-xl font-bold">
              {title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
