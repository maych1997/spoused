import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import BlackHeader from "../../components/common/BlackHeader";
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
import { EmailField, InputField } from "../../components/common/InputField";
import { login, updatemyprofile } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";
import { loginApi } from "../../../api/Auth/PostApis/loginApi";
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import * as Location from "expo-location";
import messaging from "@react-native-firebase/messaging";
import { ScreenView } from "@/components/screen";
import navigation from "@/core/navigation";
import { Button, Text, VALID_EMAIL_REGEX } from "@/ui";
import { useInfoModal } from "@/context/ModalContext";
import TermsConditionsFooter from "@/components/common/terms-conditions";
import { verticalScale } from "react-native-size-matters";
import { controlPassword } from "@/components/password-check";

const SignIn = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const dispatch = useDispatch();
  const { openModal } = useInfoModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<number[]>([0, 0]);
  const [fcm, setFcm] = useState<string | null>(null);

  // useEffect(() => {
  //   Location.getCurrentPositionAsync({}).then((location) => {
  //     setCoordinates([location.coords.latitude, location.coords.longitude]);
  //   });
  // }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => setFcm(token));
    } else {
      return;
    }
  }, []);

  const handleLogin = async () => {
    if (email === "") {
      openModal("Email Required", "Please enter your email", "OK", "error");
      return;
    }

    if (VALID_EMAIL_REGEX.test(email) === false) {
      openModal("Invalid Email", "Please enter a valid email", "OK", "error");
      return;
    }

    if (password === "") {
      openModal("Password Required", "Please enter your password", "OK", "error");
      return;
    }

    try {
      setLoading(true);
      // const data = await loginApi(email, password, coordinates, fcm);
      const data = await loginApi(email, password, [0.1278, 51.5074], fcm);

      if (data.success) {
        if (!data.user.isEmailVerified) {
          openModal("Email Verification", "Please verify your email to continue", "OK", "error");
          setLoading(false);
          console.log('here')
          navigation.navigate("VerificationCode", { email: email });
          return;
        }
        dispatch(login(data));
        try {
          const response = await getMyProfileApi(data.user.id, coordinates);
          console.log('This is my Profile Data:::::::::::::::::::::::::::::',response);
          dispatch(updatemyprofile(response.data));

          if (!data?.user?.generalInfoCompleted) {
            setLoading(false);
            navigation.navigate("OnboardingNavigator");
            return;
          }

          if (!data?.user?.onboardingCompleted) {
            setLoading(false);
            navigation.navigate("OnboardingNavigator", { screen: "CompleteProfile" });
            return;
          }

          setLoading(false);
          navigation.navigate("Tab", { screen: "HomeNavigator" });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      } else {
        if(data.error=="Reset User Password"){
          openModal("Oops!", "Invalid Password", "Reset Password", "error");
          navigation.navigate("ForgotPassword")
        }else{
          openModal("Oops!", data.error, "Try again", "error");
        }
        setLoading(false);
      }
    } catch (error: any) {
      openModal("Oops!", error.message, "Try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView>
      <BlackHeader backHandler={() => navigation.navigate("GetStarted")} />
      <View style={styles.viewUp}>
        <Text className="text-2xl font-bold">Continue With Email</Text>

        <EmailField label={"Email"} text={email} onChangeText={setEmail} placeholder="Enter Email" />
        <InputField label={"Password"} text={password} onChangeText={setPassword} placeholder="Enter Password" secureTextEntry={true} />
        {/* forgot password */}

        <Text className="text-sm">

          <Text onPress={() => navigation.navigate("ForgotPassword")} className="text-main -2 underline font-bold">
            Forgot your Password?
          </Text>
        </Text>
      </View>
        <View style={styles.viewStyle}>
        <Button
          title="Continue"
          loading={loading}
          disText="Continue"
          onPress={() => handleLogin()}          //disable button if email or password is empty and loading is true
          // disabled={email === "" || password === "" || loading === true || VALID_EMAIL_REGEX.test(email) === false}
          disabled={email === "" || password === "" || loading === true || VALID_EMAIL_REGEX.test(email) === false || controlPassword(password) === false}
        />
        <TermsConditionsFooter />
        </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  viewUp: {
    flex:6.5,
  },
  viewStyle: {
    display:'flex',
    rowGap:10,
    paddingVertical:10
  },
});

export default SignIn;
