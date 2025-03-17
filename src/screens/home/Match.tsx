import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
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
import { AppColors } from "../../utility/AppColors";
import { AppImages } from "../../utility/AppImages";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
const Match = (props: any) => {
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
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Home")}
        style={{
          backgroundColor: AppColors.whiteColor,
          height: 30,
          width: 30,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 16,
          marginTop: 15,
        }}
      >
        <Feather name="x" size={20} color="black" />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 50,
          flex: 1,
        }}
      >
        <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 24 }}>
          Congratulations!
        </Text>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 30,
          }}
        >
          <Image
            source={AppImages.MATCHED_USER_ONE}
            style={[styles.matchedUser, { marginRight: -50 }]}
          />
          <View
            style={{
              backgroundColor: "white",
              height: 80,
              width: 80,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 120,
              zIndex: 10000,
              marginBottom: -20,
            }}
          >
            <FontAwesome
              name="heart"
              size={38}
              color={AppColors.appThemeColor}
            />
          </View>
          <Image
            style={[styles.matchedUser, { marginLeft: -50 }]}
            source={AppImages.MATCHED_USER_TWO}
          />
        </View>
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
            marginVertical: 20,
          }}
        >
          You Have A New Match
        </Text>
        <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}>
          Make A Move!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.appThemeColor,
    padding: 15,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageInput: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    flex: 1,
    marginRight: 15,
    padding: 10,
    borderRadius: 120,
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
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    justifyContent: "space-between",
    alignSelf: "flex-end",
    zIndex: 1000,
    height: "95%",
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
  matchedUser: {
    width: 140,
    height: 140,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
  },
});

export default Match;
