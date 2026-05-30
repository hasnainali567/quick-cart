import { Image } from "expo-image";
import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";

type Props = {
  imageSource: ImageSourcePropType;
};

const ImageViewer = ({ imageSource }: Props) => {
  return (
    <Image
      source={imageSource}
      style={styles.image}
      contentFit="cover"
      transition={200}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    shadowColor: "#fffff0",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ImageViewer;
