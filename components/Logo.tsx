import * as React from "react";
import { Image } from "react-native";

function Logo(props: any) {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      className="w-24 h-24"
      resizeMode="cover"
    />
  );
}

export default Logo;
