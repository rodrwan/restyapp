import React, { useRef, useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import ActionButton from "./ActionButton";

interface ActionButtonData {
  icon: any;
  title: string;
  count: number;
  onPress: () => void;
  width: number;
  height: number;
}

interface ActionButtonsCarouselProps {
  buttons: ActionButtonData[];
}

const { width: screenWidth } = Dimensions.get("window");

const ActionButtonsCarousel: React.FC<ActionButtonsCarouselProps> = React.memo(
  ({ buttons }) => {
    const containerWidth = screenWidth;
    const widthByButtons = containerWidth / buttons.length;
    const buttonWidth = Math.min(
      widthByButtons,
      buttons.length === 2 ? 190 : 134
    );

    return (
      <View className="mt-4 relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{
            justifyContent: "space-between",
            gap: 4,
          }}
          style={{
            maxWidth: containerWidth,
            flex: 1,
            flexGrow: 1,
            flexShrink: 0,
          }}
        >
          {buttons.map((button, index) => (
            <View
              key={index}
              style={{
                width: buttonWidth,
              }}
            >
              <ActionButton
                icon={button.icon}
                title={button.title}
                count={button.count}
                onPress={button.onPress}
                width={button.width}
                height={button.height}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
);

export default ActionButtonsCarousel;
