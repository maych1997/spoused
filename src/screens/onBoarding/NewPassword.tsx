import React, { useState } from "react";
import { newPasswordApi } from "../../../api/Auth/PostApis/newPasswordApi";
import { useRoute } from "@react-navigation/native";
import navigation from "@/core/navigation";
import { ScreenView } from "@/components/screen";
import TermsConditionsFooter from "@/components/common/terms-conditions";
import { Button, Text } from "@/ui";
import BlackHeader from "@/components/common/BlackHeader";
import { InputField } from "@/components/common/InputField";
import { PasswordCheckBox, controlPassword } from "@/components/password-check";
import { useInfoModal } from "@/context/ModalContext";
import {View , StyleSheet} from "react-native"
import { verticalScale } from "react-native-size-matters";
const NewPassword = () => {
  const route = useRoute<any>();
  const { otp } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordCheck,setPasswordCheck]=useState(false);
  const { openModal } = useInfoModal();


    // Add this function above your component definition
    const isValidPassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/;
        console.log('lkjhgfd')
        console.log(password)
        return regex.test(password);
    };


    const handleLogin = async () => {

        if (!isValidPassword(password)) {
            openModal("Invalid Password", "Your password must include at least one uppercase letter, one number, and one special character.", "Try Again", "error");
            setPasswordCheck(!passwordCheck);
            return;
        }

        try {
      const data = await newPasswordApi(otp, password);
      setLoading(true);
      console.log(data);
      openModal("Password Reset", "Your password has been reset. Please try to log in again.", "Log In", "profile_success");
      setPasswordCheck(false);
      navigation.navigate("GetStarted");
    } catch (error: any) {
      openModal("Oops!", error.message, "Try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <ScreenView>

         <BlackHeader backHandler={() => navigation.navigate("GetStarted")} />
         <Text className="text-2xl font-bold">Set A New Password</Text>
         <Text className="text-sm font-normal mb-5 text-gray-500">
             Your password must include at least one uppercase letter, one number, and one special character{" "}
         </Text>
         <InputField label={" Password"} text={password} onChangeText={setPassword} placeholder="Enter Password" secureTextEntry={true} />
         {password.length!=0 && passwordCheck==true?<PasswordCheckBox password={password} />:<></>}
         <InputField
             label={"Confirm Password"}
             text={confirmPassword}
             onChangeText={setConfirmPassword}
             placeholder="Enter Password"
             secureTextEntry={true}
         />
         {password !== confirmPassword && confirmPassword !== "" && (
             <Text className="text-xs text-red-500 mb-5">Password and confirm password should be same</Text>
         )}



      <View style={styles.footer}>

      <Button
        title="Change Password"
        onPress={handleLogin}
        disText="Change Password"
        loading={loading}
        disabled={
          password === "" ||
          confirmPassword === "" ||
           !isValidPassword(password)||
          password !== confirmPassword ||
          controlPassword(password) === false ||
          controlPassword(confirmPassword) === false
        }
      />
      </View>

    </ScreenView>
  );
};
const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
    paddingVertical:10
  },
});

export default NewPassword;
