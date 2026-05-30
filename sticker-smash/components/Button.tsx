import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
  onPress: () => void;
};

const Button = ({ label, className, icon, onPress }: Props) => {
  return (
    <View className={`w-full items-center justify-center p-1 `}>
      <Pressable
        className={`flex-row items-center justify-center gap-2 w-full h-full ${className} rounded-lg`}
        onPress={onPress}
      >
        {icon && <Ionicons name={icon} size={24} className="text-inherit" />}
        <Text className="text-base font-semibold text-inherit">{label}</Text>
      </Pressable>
    </View>
  );
};

export default Button;
