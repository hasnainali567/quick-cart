import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabBarItem, TabView } from "react-native-tab-view";
import About from "./about";
import Home from "./index";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const renderScene = SceneMap({
  home: Home,
  about: About,
});

export default function BottomTabExample() {
  const layout = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Sticker Smash", icon: "home" },
    { key: "about", title: "About", icon: "info" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      tabBarPosition="bottom"
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{
            backgroundColor: "#ffd33d",
            height: 3,
            top: 0,
          }}
          style={{
            backgroundColor: "#25292e",
            paddingBottom: inset.bottom,
            height: 50 + inset.bottom,
          }}
          activeColor="#ffd33d"
          renderTabBarItem={(itemProp) => {
            const { route, key } = itemProp;
            const isFocused =
              props.navigationState.index ===
              props.navigationState.routes.findIndex(
                (r) => r.key === route.key,
              );
            let iconName: IoniconName = "home-outline";
            if (route.key === "home") {
              iconName = isFocused ? "home" : "home-outline";
            } else if (route.key === "about") {
              iconName = isFocused
                ? "information-circle"
                : "information-circle-outline";
            }
            return (
              <TabBarItem
                {...itemProp}
                key={key}
                labelText=""
                icon={({ size, color }) => (
                  <Ionicons name={iconName} size={size} color={color} />
                )}
                labelStyle={{ color: isFocused ? "#ffd33d" : "#888" }}
              />
            );
          }}
        />
      )}
    />
  );
}
