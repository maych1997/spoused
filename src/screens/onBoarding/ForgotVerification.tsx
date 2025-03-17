import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AppColors } from "../../utility/AppColors";
import { OtpInput } from "react-native-otp-entry";
import { resetPasswordApi } from "../../../api/Auth/PostApis/resetPasswordApi";
import { forgotPasswordApi } from "../../../api/Auth/PostApis/ForgotPasswordApi";
import navigation from "@/core/navigation";
import { useRoute } from "@react-navigation/native";
import { useInfoModal } from "@/context/ModalContext";
import { ScreenView } from "@/components/screen";
import BlackHeader from "@/components/common/BlackHeader";
import { Button, Text, View, colors } from "@/ui";
import { verticalScale } from "react-native-size-matters";

const ForgotVerification = () => {
  const route = useRoute<any>();
  const { email } = route.params;
  const { openModal } = useInfoModal();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCode = async () => {
    try {
      setLoading(true);
      const data = await resetPasswordApi(otp);

      if (data.success) {
        navigation.navigate("NewPassword", { otp: otp });
      } else {
        openModal("Oops!", data.error, "Try again", "error");
      }
    } catch (error: any) {
      openModal("Oops!", error.message, "Try again", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await forgotPasswordApi(email);
      openModal("Success", "Code has been sent to your email", "Ok", "success");
    } catch (error: any) {
      openModal("Oops!", error.message, "Try again", "error");
    }
  };

  return (
    <ScreenView>
      <BlackHeader />
      <View>
        <Text className="text-2xl font-bold">Authentication Code</Text>
        <Text className="text-sm font-normal mb-5 text-gray-500">
          Enter the one-time code sent to <Text className="text-sm font-semibold mb-5 text-main">{email}</Text>
        </Text>
        <View style={styles.numbersView}>
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
              backgroundColor: colors.main,
            },
          }}
        />
        </View>

        <Button title="Confirm" disText="Confirm" onPress={handleCode} disabled={otp.length !== 5 || loading || otp === ""} className="my-5" loading={loading} />

        <Text className="text-center text-gray-500 text-sm">Didn’t receive an authentication code?</Text>
        <Text
          onPress={() => {
            handleResendCode();
          }}
          className="text-center text-main text-sm underline font-semibold uppercase my-5"
        >
          Resend Code
        </Text>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 30,
  },
  checkbox: {
    borderRadius: 5,
  },
  numbersView: {
    marginBottom: verticalScale(40)
  },
  otpContainerStyle: {
    width: "18%",
    borderColor: "rgba(0, 0, 0, 0.05)",
    marginVertical: 10,
    backgroundColor: "rgba(250, 250, 250, 1)",
  },
  pinCodeText: { color: AppColors.blackColor },
});

export default ForgotVerification;
