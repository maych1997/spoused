import React, { useState } from "react";
import navigation from "@/core/navigation";
import { Button, VALID_EMAIL_REGEX, Text } from "@/ui";
import TermsConditionsFooter from "@/components/common/terms-conditions";
import { ScreenView } from "@/components/screen";
import { useInfoModal } from "@/context/ModalContext";
import { forgotPasswordApi } from "api/Auth/PostApis/ForgotPasswordApi";
import BlackHeader from "@/components/common/BlackHeader";
import { EmailField } from "@/components/common/InputField";
import {StyleSheet, View } from "react-native";
import { verticalScale } from "react-native-size-matters";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { openModal } = useInfoModal();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await forgotPasswordApi(email);
      console.log(data);
      if (data.success) {
        navigation.navigate("ForgotVerification", { email: email });
      } else {
        openModal("Oops!", data.error, "Try again", "error");
      }
    } catch (error: any) {
      openModal("Oops!", error.message, "Try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView>
      <View style={{flex:1,justifyContent:'space-between'}}>
        <View>
      <BlackHeader backHandler={() => navigation.navigate("GetStarted")} />
      <Text className="text-2xl font-bold">Reset Password </Text>
      <Text className="text-gray-500 text-sm">We will send a verification code to this email address to help you recover your password</Text>

      <EmailField label={"Email"} text={email} onChangeText={setEmail} placeholder="Enter Email" />
      </View>
      <View style={styles.footer}>
      <Button
        title="Continue"
        onPress={handleLogin}
        disText="Continue"
        loading={loading}
        disabled={loading || email === "" || VALID_EMAIL_REGEX.test(email) === false}
      />
        <TermsConditionsFooter />
      </View>
      </View>
    </ScreenView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    rowGap:10,
    paddingVertical:10,
  },
});
export default ForgotPassword;
