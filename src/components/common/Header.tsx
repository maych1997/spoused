import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppColors } from "../../utility/AppColors";

export default function Header(props: any) {
  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="chevron-back"
        size={24}
        color={AppColors.blackColor}
        onPress={props.backHandler}
      />
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          marginHorizontal: 10,
          color: AppColors.blackColor,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  headerContainer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  contentWrapper: {
    padding: 15,
    marginTop: 30,
  },
  buttonContainer: {
    // position: "absolute",
    // bottom: 20,
    width: "100%",
    paddingHorizontal: 15,
  },
  blurPhotoContainer: {
    width: "100%",
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
