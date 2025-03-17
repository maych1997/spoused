import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AppColors } from "../../../utility/AppColors";
import { Ionicons } from "@expo/vector-icons";
const ChatStarter = () => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          color: AppColors.secondaryText,
          fontSize: 12,
        }}
      >
        Today
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            color: AppColors.blackColor,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          You Matched
        </Text>
        <Ionicons
          name="heart"
          size={22}
          style={{ marginLeft: 5 }}
          color={AppColors.appThemeColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
  },
});
export default ChatStarter;
