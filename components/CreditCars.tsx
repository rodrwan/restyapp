import { Text, View } from "react-native";

type CreditCardType = {
  cardNumber: string;
  firstname: string;
  lastname: string;
};
const CreditCard = ({ cardNumber, firstname, lastname }: CreditCardType) => {
  return (
    <View className="flex bg-secondary-700 self-center p-8 rounded-lg shadow-lg w-full">
      <Text className="flex-row text-white text-lg font-bold mb-2">
        Medio de pago
      </Text>
      <Text className="text-white text-xl font-semibold mb-4">
        {cardNumber?.match(/.{1,4}/g)?.join("  ")}
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-white text-base">
          {firstname} {lastname}
        </Text>
      </View>
    </View>
  );
};

export default CreditCard;
