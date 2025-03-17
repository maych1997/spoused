import React, {useState} from "react";
import { View, StyleSheet, Text, Image, Platform } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../../../utility/AppColors";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AppImages } from "../../../utility/AppImages";
import { FULL_WIDTH } from "../../../utility/Constant";
import {BlurView} from "expo-blur";

const ChatHeader = (props: any) => {
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
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          name="chevron-back"
          size={30}
          style={{ marginRight: 15 }}
          color="black"
          onPress={props.goBack}
        />



          <View style={{ position: "relative" }}>
              {/* Image to be blurred */}
              <Image style={styles.profilePicture} source={{ uri: props?.image }} />

              {/* Conditionally render BlurView */}
              {props?.data?.photoPrivacy && (
                  <BlurView
                      intensity={7} // Adjust the blur intensity
                      style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          borderRadius: styles.profilePicture.borderRadius, // Match the Image borderRadius
                          overflow: "hidden",
                      }}
                  />
              )}
          </View>





        <View style={{ marginLeft: 10, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: "AppColors.blackColor",
              fontSize: 14,
            }}
          >
            {props?.data?.fullName}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          columnGap: Platform.OS === "ios" ? 20 : 15,
        }}
      >
        <FontAwesome
          name="video-camera"
          size={Platform.OS === "ios" ? 30 : 25}
          color={AppColors.appThemeColor}
          onPress={props.onCall}
        />
        <FontAwesome
          name="phone"
          size={Platform.OS === "ios" ? 30 : 25}
          color={AppColors.appThemeColor}
          onPress={props.onVoiceCall}
        />
        <Entypo
          name="dots-three-vertical"
          size={Platform.OS === "ios" ? 30 : 25}
          color={AppColors.appThemeColor}
          onPress={props.menuHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    backgroundColor: AppColors.whiteColor,
    height: FULL_WIDTH * 0.15,
    justifyContent: "space-between",
    flexDirection: "row",
    width: FULL_WIDTH,
    paddingHorizontal: FULL_WIDTH * 0.03,
  },
  iconContainer: {
    backgroundColor: AppColors.appThemeColor,
    width: 45,
    height: 45,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    position: "absolute",
    left: 0,
  },
  likeCountContainer: {
    backgroundColor: AppColors.appThemeColor,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  profilePicture: {
    height: 37,
    width: 37,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: AppColors.appThemeColor,
  },
});

export default ChatHeader;
