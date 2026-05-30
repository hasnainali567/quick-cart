import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const EmojiPicker = ({ children, isVisible, onClose }: Props) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className="h-1/4 w-full bg-[#25292e] rounded-tr-lg rounded-tl-lg absolute bottom-0">
        <View className="h-1/6 bg-[#464c55] rounded-tr-lg rounded-tl-lg py-4 p-2 flex-row items-center justify-between">
          <Text className="text-white text-lg font-medium">
            Chooose a Sticker
          </Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color={"white"} size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default memo(EmojiPicker);
