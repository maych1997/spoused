import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { AppColors } from "../../utility/AppColors";
import { OtpInput } from "react-native-otp-entry";
import CommonButton from "../../components/common/CommonButton";
import { RouteProp, useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import { AppImages } from "../../utility/AppImages";
import CrossButton from "../../components/common/CrossButton";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
interface RouteParams {
  phone: string;
}

const PhoneVerification = (props: any) => {
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [otp, setOtp] = useState("");

  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { phone } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Ionicons
          style={{ position: "absolute", left: 15 }}
          name="chevron-back"
          size={24}
          color={AppColors.blackColor}
          onPress={() => props.navigation.navigate("Registration")}
        />
        <Image
          source={AppImages.LOGO_BLACK}
          resizeMode="contain"
          style={{ width: 75 }}
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            color: AppColors.blackColor,
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
          }}
        >
          Phone Verification
        </Text>
        <Text
          style={{
            color: AppColors.secondaryText,
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            marginVertical: 10,
            marginBottom: 40,
          }}
        >
          Enter verification Code sent to{" "}
          <Text
            style={{
              color: AppColors.appThemeColor,
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              marginVertical: 10,
              marginBottom: 40,
            }}
          >
            {phone}
          </Text>
        </Text>
        <OtpInput
          numberOfDigits={5}
          focusColor={AppColors.appThemeColor}
          focusStickBlinkingDuration={500}
          onFilled={(val) => {
            setOtp(val);
          }}
          theme={{
            pinCodeContainerStyle: styles.otpContainerStyle,
            pinCodeTextStyle: styles.pinCodeText,
            filledPinCodeContainerStyle: {
              backgroundColor: AppColors.appThemeColor,
            },
          }}
        />

        <CommonButton
          title={"Confirm"}
          pressHandler={() => setIsModalVisible(true)}
        />
        <Text
          style={{
            color: AppColors.secondaryText,
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            marginVertical: 10,
            textAlign: "center",
          }}
        >
          Did not get the OTP?
        </Text>
        <Text
          onPress={() => { }}
          style={{
            color: AppColors.appThemeColor,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          RESEND OTP
        </Text>
      </View>

      {/* confirmation popup modal */}
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection="up"
        style={{
          margin: 0,
        }}
      >
        <View
          style={{
            backgroundColor: AppColors.whiteColor,
            shadowColor: AppColors.transparentBlack07,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
            borderRadius: 10,
            marginTop: 15,
            marginHorizontal: 20,
            width: "90%",
          }}
        >
          <View style={{ alignSelf: "flex-end", padding: 10 }}>
            <CrossButton buttonHandler={() => setIsModalVisible(false)} />
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              marginTop: 20,
            }}
          >
            <Image
              source={AppImages.PROFILE_CREATION}
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
            />
            <Text
              style={{
                color: AppColors.blackColor,
                fontFamily: "Poppins_700Bold",
                fontSize: 24,
              }}
            >
              Congratulations!
            </Text>
            <Text
              style={{
                color: AppColors.secondaryText,
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                marginVertical: 10,
              }}
            >
              Your profile has been successfully created.
            </Text>
            <CommonButton
              title={"Amazing"}
              pressHandler={() => {
                setIsModalVisible(false);
                props.navigation.navigate("CompleteProfile");
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 30,
  },
  checkbox: {
    borderRadius: 5,
  },
  otpContainerStyle: {
    width: "18%",
    borderColor: "rgba(0, 0, 0, 0.05)",
    marginVertical: 10,
    backgroundColor: "rgba(250, 250, 250, 1)",
  },
  pinCodeText: { color: AppColors.blackColor },
});
export default PhoneVerification;
