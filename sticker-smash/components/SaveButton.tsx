import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

type Props = {};

const SaveButton = (props: Props) => {
  return (
    <Pressable className="text-white items-center ">
      <Ionicons name="save" size={24} className="text-inherit" />
      <Text className="text-sm font-semibold text-inherit">Save</Text>
    </Pressable>
  );
};

export default SaveButton;
