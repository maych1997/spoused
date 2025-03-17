import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { Image } from "react-native";
import { AppImages } from "../../../utility/AppImages";

const HomeHeader = (props: any) => {
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
      <TouchableOpacity
        onPress={props.backButtonDisabled ? props.handleRewind : props.backHandler}
        style={[
          styles.iconContainer,
          {
            backgroundColor: props.backButtonDisabled || props.swiped
              ? AppColors.greyFill
              : AppColors.appThemeColor,
          },
        ]}
      >
        <Ionicons name={props.backButtonDisabled ? "play-back" : "chevron-back"} size={24} color="black" />
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        {props.showNotification && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={props?.notificationHandler}
          >
            <Fontisto name="bell" size={24} color="black" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.boost}
                          onPress={() => props.navigation.navigate("Boosting", { back: 10 })}
        >

          <MaterialCommunityIcons
            name="lightning-bolt-circle"
            size={24}
            color="black"
          />
          <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 5 }}
          >
            Boost
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              backgroundColor: props.activeFilter
                ? AppColors.appThemeColor
                : AppColors.greyFill,
            },
          ]}
          onPress={props.filterHandler}
        >
          <Image
            style={{ width: 17, height: 14 }}
            source={AppImages.FILTER_ICON}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconContainer: {
    backgroundColor: AppColors.greyFill,
    width: 45,
    height: 45,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  boost: {
    backgroundColor: AppColors.appThemeColor,
    borderRadius: 300,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
});
export default HomeHeader;
