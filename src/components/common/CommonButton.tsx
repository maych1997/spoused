/* eslint-disable react/react-in-jsx-scope */
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AppColors } from "../../utility/AppColors";
import React from "react";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

const CommonButton = (props: any) => {
  useFonts({
    Poppins_600SemiBold,
  });
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flexDirection: "row",
      padding: 15,
      paddingHorizontal: 25,
      borderRadius: 220,
      width: "100%",
      backgroundColor: props.disable
        ? "rgba(209, 209, 209, 1)"
        : AppColors.appThemeColor,
      marginVertical: 20,
      alignSelf:'baseline',
    },
  });
  return (
    <TouchableOpacity
      disabled={props.disable}
      style={[styles.container, props.buttonStyle]}
      onPress={props.pressHandler}
    >
      <Text
        style={{
          color: props.disable ? AppColors.whiteColor : AppColors.blackColor,
          fontSize: 16,
          fontFamily: "Poppins_600SemiBold",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default CommonButton;


export const DateButton = (props: any) => {
  useFonts({
    Poppins_600SemiBold,
  });
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: 8,
      paddingHorizontal: 12,
      borderRadius: 220,
      width: "50%",
      backgroundColor: props.disable
        ? "rgba(209, 209, 209, 1)"
        : AppColors.appThemeColor,
    },
  });
  return (
    <TouchableOpacity
      style={[styles.container, props.buttonStyle]}
      onPress={props.pressHandler}
    >
      <Text
        style={{
          color: props.disable ? AppColors.whiteColor : AppColors.blackColor,
          fontSize: 12,
          fontFamily: "Poppins_600SemiBold",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};