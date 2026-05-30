import AddButton from "@/components/AddButton";
import Button from "@/components/Button";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const placeHolderImage = require("../../assets/images/background-image.png");

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [pickedEmoji, setPickerEmoji] = useState<string | undefined>(undefined);
  const [showOption, setShowOption] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowOption(true);
    } else {
      alert("You did not select any image");
    }
  };

  const onReset = () => {
    setShowOption(false);
  };

  const onAdd = () => {
    setVisible(true);
  };
  const onSave = useCallback(() => {}, []);

  const useThisPhoto = () => {};

  const onCloseModal = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#25292e]">
      <View className="flex-1 items-center p-8 gap-4">
        <Text className="text-2xl font-medium text-white">Sticker Smash</Text>
        <View className="flex-1 w-full">
          <ImageViewer imageSource={selectedImage || placeHolderImage} />
          {pickedEmoji && (
            <EmojiSticker imageSize={80} stickerSource={pickedEmoji} />
          )}
        </View>
        {showOption ? (
          <View className="flex-row gap-12 items-center justify-center w-full py-8">
            <IconButton label="Reset" icon="refresh" onPress={onReset} />
            <AddButton onPress={onAdd} />
            <IconButton icon="download" label="Save" onPress={onSave} />
          </View>
        ) : (
          <View className="h-fit w-full py-4 flex-col">
            <Button
              label="Choose an Image"
              icon="image-outline"
              className="text-lg bg-white rounded-md p-4 h-16 border-1 border-[#25292e]"
              onPress={pickImageAsync}
            />
            <Button
              label="use this photo"
              className="!text-white underline h-16"
              onPress={() => setShowOption(true)}
            />
          </View>
        )}
      </View>
      <EmojiPicker isVisible={visible} onClose={onCloseModal}>
        <EmojiList onSelect={setPickerEmoji} onCloseModal={onCloseModal} />
      </EmojiPicker>
    </SafeAreaView>
  );
};

export default Home;
