import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import CommonButton from "../../components/common/CommonButton";
import { FULL_WIDTH } from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";

const ConfirmID = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const breakOptions = [
    "Met my partner on Spoused",
    "Met my partner elsewhere",
    "Taking a break",
    "Didn’t like Spoused",
    "Other",
  ];
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ padding: 15, flex: 1 }}>
        {/* header */}
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={() => props.navigation.navigate("UploadID")}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />

        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Confirm It’s You
        </Text>
        <Text
          style={[
            {
              fontFamily: "Poppins_500Medium",
            },
            styles.lightText,
          ]}
        >
          In the next step, we’ll ask you to take a quick scan of your face.
        </Text>
        <Image
          source={require("../../assets/images/better_scan.png")}
          style={{
            height: 340,
            width: FULL_WIDTH - 30,
            borderRadius: 15,
            marginTop: 30,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.lightText,
            {
              fontFamily: "Poppins_600SemiBold",
              color: AppColors.blackColor,
              marginBottom: 10,
              fontSize: 16,
            },
          ]}
        >
          For Better Scan Results
        </Text>
        <Text
          style={[
            styles.lightText,
            {
              fontFamily: "Poppins_400Regular",
              color: AppColors.blackColor,
              marginVertical: 2,
            },
          ]}
        >
          • {"  "}Find An Area With Good Lighting
        </Text>
        <Text
          style={[
            styles.lightText,
            {
              fontFamily: "Poppins_400Regular",
              color: AppColors.blackColor,
              marginVertical: 2,
            },
          ]}
        >
          • {"  "}Hold Your Phone At An Eye Level
        </Text>
      </View>
      <View style={{ padding: 15 }}>
        <CommonButton
          title="Start Scan"
          pressHandler={() => props.navigation.navigate("FrameFace")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  heading: {
    fontSize: 24,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 60,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
});
export default ConfirmID;
