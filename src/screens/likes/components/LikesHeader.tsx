import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
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
import { AppImages } from "../../../utility/AppImages";
import navigation from "@/core/navigation";
import {parseJson} from "ajv/dist/runtime/parseJson";
import position = parseJson.position;

const LikesHeader = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
    const iconStyle =
        props.position === "right" ? styles.iconContainerRight : styles.iconContainer;



  return  (
      <View style={styles.container}>
          { props.position === "right"  &&(
              <TouchableOpacity style={ styles.iconContainerRight2} onPress={props.backhandler} >


                  <Ionicons
                      name="chevron-back"
                      size={24}
                      // onPress={() => props.navigation.navigate("Profile")}
                      color="black"
                      style={styles.icon2}
                  />
              </TouchableOpacity>
          )}




          <TouchableOpacity style={iconStyle} onPress={props.filterHandler} >
              <Image
                  style={{ width: 17, height: 14 }}
                  source={AppImages.FILTER_ICON}
                  resizeMode="contain"
              />
          </TouchableOpacity>



          <Text
              style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 16,
                  color: AppColors.blackColor,
              }}
          >
              Liked You
          </Text>
          <View style={styles.likeCountContainer}>
              <Text
                  style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: AppColors.blackColor,
                  }}
              >
                  {props.likeCount > 100 ? `${props.likeCount}+` : props.likeCount}
              </Text>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
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
    iconContainerRight: {
        backgroundColor: AppColors.appThemeColor,
        width: 45,
        height: 45,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        position: "absolute",
        right: 0, // Move the icon to the right
    },

    iconContainerRight2: {
        backgroundColor: AppColors.appThemeColor,
        width: 45,
        height: 45,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        position: "absolute",
        left: 0, // Move the icon to the right
    },



    likeCountContainer: {
        backgroundColor: AppColors.appThemeColor,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 100,
        marginHorizontal: 5,
    },



});

export default LikesHeader;
