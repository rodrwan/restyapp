import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  inputStyle,
  textStyle,
  ...props
}: any): any => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base text-gray-100 font-pmedium ${textStyle}`}>
        {title}
      </Text>

      <View
        className={`w-full h-16 px-4 bg-black-400 bg-white rounded-2xl border-2 border-secondary-300 focus:border-secondary-50 flex flex-row items-center ${inputStyle}`}
      >
        <TextInput
          className={`flex-1 bg-white font-psemibold text-base`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <Ionicons mame="eye-outline" />
            ) : (
              <Ionicons mame="eye-off-outline" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
