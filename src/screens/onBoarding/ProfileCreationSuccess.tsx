import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import Header from "./components/Header";
import { AppImages } from "../../utility/AppImages";
import { FULL_HEIGHT, FULL_WIDTH } from "../../utility/Constant";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";

const ProfileCreationSuccess = (props: any) => {
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
  });
  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: 10,
        }}
        style={{
          height: FULL_HEIGHT,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
            color: AppColors.blackColor,
          }}
        >
          Congratulations
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: AppColors.secondaryText,
            marginVertical: 10,
          }}
        >
          Your Profile Is Successfully Created
        </Text>
        <Image
          source={AppImages.START_JOURNEY}
          style={styles.image}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
            color: AppColors.blackColor,
          }}
        >
          Your Journey Starts Here
        </Text>
        <CommonButton
          title={"Find Someone"}
          pressHandler={() => {
            props.navigation.navigate("Tab");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  contentWrapper: {
    padding: 15,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    height: "100%",
    flex: 1,
  },
  image: {
    width: FULL_WIDTH - 20,
    height: 350,
    marginVertical: 60,
  },
});

export default ProfileCreationSuccess;
