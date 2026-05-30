import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

type Props = {
  onPress: () => void;
};

const AddButton = ({ onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white size-16 items-center justify-center rounded-full"
    >
      <Ionicons name="add" size={38} color="black" />
    </Pressable>
  );
};

export default React.memo(AddButton);
