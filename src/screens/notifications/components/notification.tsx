import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { AppColors } from "../../../utility/AppColors";
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
import moment from "moment";

const Notification = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  console.log(props.notification);

  return (
    <View style={styles.container} key={props.index}>
      <View style={styles.iconContainer}>
        <Fontisto name="bell" size={24} color="black" />
      </View>
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text
          style={[
            styles.titleText,
            {
              fontFamily: "Poppins_500Medium",
            },
          ]}
        >
          {props?.notification?.title}
        </Text>
        <Text
          style={[
            styles.descText,
            {
              fontFamily: "Poppins_400Regular",
            },
          ]}
        >
          {props?.notification?.content}
        </Text>
      </View>
      <Text
        style={[
          styles.descText,
          {
            fontFamily: "Poppins_400Regular",
            marginHorizontal: 10,
          },
        ]}
      >
        {moment(props?.notification?.createdAt).format('HH:mm')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 15,
    flexDirection: "row",
  },
  iconContainer: {
    backgroundColor: AppColors.appThemeColor,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 200,
  },
  titleText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  descText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
});

export default Notification;
