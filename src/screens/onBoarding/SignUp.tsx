import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Keyboard } from "react-native";
import BlackHeader from "../../components/common/BlackHeader";
import { InputField } from "../../components/common/InputField";
import { signUpApi } from "../../../api/Auth/PostApis/signUpApi";
import * as Location from "expo-location";
import messaging from "@react-native-firebase/messaging";
import navigation from "@/core/navigation";
import TermsConditionsFooter, { TermsConditionsCheckbox } from "@/components/common/terms-conditions";
import { Button, IS_IOS, Text, ScrollView } from "@/ui";
import { ScreenView } from "@/components/screen";
import { useInfoModal } from "@/context/ModalContext";
import { PasswordCheckBox, controlPassword } from "@/components/password-check";

const SignUp = () => {
  const { openModal } = useInfoModal();
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    isChecked: false,
    coordinates: [0, 0],
    fcm: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Location.getCurrentPositionAsync({}).then((location) => {
      setState((prev) => ({ ...prev, coordinates: coordinates }));
    });
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => setState((prev) => ({ ...prev, fcm: token })));
    } else {
      return;
    }
  }, []);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { email, password, confirmPassword, isChecked, coordinates, fcm } = state;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(IS_IOS ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener(IS_IOS ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const data = await signUpApi(state);

      if (data.message === "Email not verified. Verification email sent.") {
        navigation.navigate("VerificationCode", { email: email });
      }

      if (data.error === "User Already exists.") {
        openModal("Oops!",data.error , "Try again", "error");
        // showToast("User already exists", "Please try with another email");
        return;
      }

      navigation.navigate("VerificationCode", { email: email });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView>
      <KeyboardAvoidingView behavior={IS_IOS ? "padding" : "height"}>
        <BlackHeader backHandler={() => navigation.navigate("GetStarted")} />
        <ScrollView>
          <Text className="text-2xl font-bold">Create An Account</Text>
          <Text className="text-gray-500 text-sm">Please Fill The Details And Tap Create</Text>
          <InputField
            label={"Email"}
            text={email}
            onChangeText={(value: any) => setState((prev) => ({ ...prev, email: value }))}
            placeholder="Enter Email"
            //lowercase
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <InputField
            label={"Password"}
            text={password}
            onChangeText={(value: any) => setState((prev) => ({ ...prev, password: value }))}
            placeholder="Enter Password"
            secureTextEntry={true}
            keyboardType="password"
          />
          <PasswordCheckBox password={password} />
          <InputField
            label={"Confirm Password"}
            text={confirmPassword}
            onChangeText={(value: any) => setState((prev) => ({ ...prev, confirmPassword: value }))}
            placeholder="Enter Confirm Password"
            secureTextEntry={true}
          />
          {password !== confirmPassword && confirmPassword !== "" && (
            <Text className="text-xs text-red-500 mb-5">Password and confirm password should be same</Text>
          )}
          <TermsConditionsCheckbox isChecked={isChecked} onValueChange={(value) => setState((prev) => ({ ...prev, isChecked: value }))} />
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disText="Create Account"
            disabled={
              email === "" ||
              password === "" ||
              confirmPassword === "" ||
              !isChecked ||
              password !== confirmPassword ||
              controlPassword(password) === false
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <TermsConditionsFooter />
    </ScreenView>
  );
};

export default SignUp;
