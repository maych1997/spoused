import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Switch } from "@rneui/themed";
import React from "react";
import { AppColors } from "../../../utility/AppColors";
const SwitchSetting = (props: any) => {
  return (
    <View style={styles.contentContainer}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
          {props.title}
        </Text>
        <Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
          {props.content}
        </Text>
      </View>
      <Switch
        value={props.toggle}
        onValueChange={(value) => props.setToggle(value)}
        color={AppColors.appThemeColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  heading: {
    fontSize: 20,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 40,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 1000,
    backgroundColor: "rgba(62, 127, 255, 1)",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: AppColors.blackColor,
    fontSize: 16,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  standardText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  contentContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(245, 245, 245, 1)",
    padding: 20,
    borderRadius: 10,
    paddingLeft: 20,
    flexDirection: "row",
    marginVertical: 10,
  },
  roundContainer: {
    borderRadius: 120,
    padding: 15,
    paddingHorizontal: 25,
    backgroundColor: AppColors.greyFill,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    borderRadius: 20,
    width: 300,
    height: 400,
    margin: 10,
  },
  description: {
    color: AppColors.secondaryText,
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
});

export default SwitchSetting;
