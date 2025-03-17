import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { AppColors } from "../../../utility/AppColors";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

const UserAction = (props: any) => {
  useFonts({
    Poppins_700Bold,
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={props.handleSwipeLeft}
        style={styles.iconContainer}>
        <Entypo name="cross" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={props.handleSwipeRight}
      >
        <Entypo name="heart" size={24} color="black" />
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            color: AppColors.blackColor,
            fontSize: 16,
            marginHorizontal: 10,
          }}
        >
          Send Match
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.handleInstantChat}
        style={styles.iconContainer}>
        <MaterialCommunityIcons name="message-text" size={24} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 20,
  },
  iconContainer: {
    backgroundColor: AppColors.appThemeColor,
    padding: 20,
    borderRadius: 120,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default UserAction;
