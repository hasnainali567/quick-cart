import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const placeholderImage = require("../../assets/images/splash-icon.png");
const About = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#25292e] py-4">
      <Text className="text-white">About</Text>
    </SafeAreaView>
  );
};

export default About;
