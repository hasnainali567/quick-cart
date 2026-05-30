import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  onPress?: () => void;
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
};

const IconButton = ({ onPress, icon, label }: Props) => {
  return (
    <Pressable className="text-white items-center " onPress={onPress}>
      <FontAwesome name={icon} size={24} className="text-inherit" />
      <Text className="text-sm font-semibold text-inherit">{label}</Text>
    </Pressable>
  );
};

export default React.memo(IconButton);
