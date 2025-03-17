/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text, View } from "react-native";
import { AppColors } from "../utility/AppColors";
import Likes from "../screens/likes/Likes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import HomeNavigator from "./HomeNavigator";
import ChatNavigator from "./ChatNavigator";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import ProfileNavigator from "./ProfileNavigator";
import likeNavigator from "./likeNavigator";
const Tab = createBottomTabNavigator();

interface FocusedTabBarIconProps {
  tabName: number;
}

const ActiveBar = () => {
  return (
    <View
      style={{
        height: 6,
        backgroundColor: AppColors.blackColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 3,
        position: "absolute",
        bottom: 0,
        width: 35,
      }}
    />
  );
};

const FocusedTabBarIcon: React.FC<FocusedTabBarIconProps> = ({ tabName }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {tabName === 1 ? (
        <>
          <MaterialCommunityIcons name="cards" size={27} color="black" />
          <ActiveBar />
        </>
      ) : null}
      {tabName === 2 ? (
        <>
          <Image
            source={require("../assets/images/likes.png")}
            style={{ width: 27, height: 27 }}
          />
          <ActiveBar />
        </>
      ) : null}
      {tabName === 3 ? (
        <>
          <AntDesign name="wechat" size={27} color="black" />
          <ActiveBar />
        </>
      ) : null}
      {tabName === 4 ? (
        <>
          <FontAwesome6 name="user-large" size={27} color="black" />
          <ActiveBar />
        </>
      ) : null}
    </View>
  );
};

const TabNavigator: React.FC = () => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: AppColors.whiteColor,
        padding: 0,
        margin: 0,
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconComponent;
            if (route.name === "HomeNavigator") {
              iconComponent = focused ? (
                <FocusedTabBarIcon tabName={1} />
              ) : (
                <MaterialCommunityIcons
                  name="cards"
                  size={27}
                  color="rgba(0, 0, 0, 0.4)"
                />
              );
            } else if (route.name === "likeNavigator") {
              iconComponent = focused ? (
                <FocusedTabBarIcon tabName={2} />
              ) : (
                <Image
                  source={require("../assets/images/likes_inactive.png")}
                  style={{ width: 27, height: 27 }}
                />
              );
            } else if (route.name === "ChatNavigator") {
              iconComponent = focused ? (
                <FocusedTabBarIcon tabName={3} />
              ) : (
                <AntDesign name="wechat" size={27} color="rgba(0, 0, 0, 0.4)" />
              );
            } else if (route.name === "ProfileNavigator") {
              iconComponent = focused ? (
                <FocusedTabBarIcon tabName={4} />
              ) : (
                <FontAwesome6
                  name="user-large"
                  size={27}
                  color="rgba(0, 0, 0, 0.4)"
                />
              );
            }

            return iconComponent;
          },
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 75,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: AppColors.appThemeColor,
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 0,
          },
        })}
      >
        <Tab.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="likeNavigator"
          component={likeNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ChatNavigator"
          component={ChatNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ProfileNavigator"
          component={ProfileNavigator}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
