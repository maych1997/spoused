import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ActivityIndicator } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { AppColors } from "../../utility/AppColors";
import { OtpInput } from "react-native-otp-entry";
import CommonButton from "../../components/common/CommonButton";
import { Ionicons } from "@expo/vector-icons";
import { AppImages } from "../../utility/AppImages";
import { verificationCodeApi } from "../../../api/Auth/PostApis/verificationCodeApi";
import { resendCodeApi } from "../../../api/Auth/PutApis/resendCodeApi";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../../../redux/authSlice";
import { ScreenView } from "@/components/screen";
import { useRoute } from "@react-navigation/native";
import navigation from "@/core/navigation";
import {useInfoModal} from "@/context/ModalContext";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const VerificationCode = () => {
  const route = useRoute<any>();
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [resent,setResent]=useState(false);
  const [load,setLoad]=useState(false);
  const [showTick,setShowTick]=useState(false);
  const dispatch = useDispatch();
    const { openModal } = useInfoModal();

  const handleCode = async () => {
    try {
      const data = await verificationCodeApi(email, otp);
      if (data.success) {
        console.log("we are in the success");
        console.log(data);
        console.log("we are in the success");
        
        
        dispatch(register(data)); // Make sure 'data' contains the token
        navigation.navigate("OnboardingNavigator");
      } else {
        console.log("we are in the else unfourtunalty");
          openModal("Oops!", "Invalid code. Please check the code and try again.", "Okay", "error");
        console.error("Login failed: ", data.errorMessage);
      }
    } catch (error) {
      console.error("Error occurred during login: ", error);
    }
  };
  const reduxState = useSelector((state) => state);

  const handleResendCode = async () => {
    setLoad(true);
    try {
      const data = await resendCodeApi();
      if(data!=undefined){
        setResent(true);
        setLoad(false);
        setShowTick(true);
      }
    } catch (error) {
      console.error("Error occurred during login: ", error);
    }
  };
useEffect(()=>{
  setTimeout(()=>{
    if(showTick==true){
      setShowTick(false);
    }
  },10000)
},[showTick])
  return (
    <ScreenView style={[styles.container]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingTop: 10,
        }}
      >
        <Ionicons
          style={{ position: "absolute", left: 15, top: 10 }}
          name="chevron-back"
          size={24}
          color={AppColors.blackColor}
          onPress={() => navigation.navigate("SignIn")}
        />
        <Image source={AppImages.LOGO_BLACK} resizeMode="contain" style={{ width: 75 }} />
      </View>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            color: AppColors.blackColor,
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
          }}
        >
          Authentication Code
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
          Enter the one-time code sent to{" "}
          <Text
            style={{
              color: AppColors.appThemeColor,
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              marginVertical: 10,
              marginBottom: 40,
            }}
          >
            {email}
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
          pressHandler={() => {
            handleCode();
          }}
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
          Didn’t receive an authentication code?
        </Text>
       <View style={{display:'flex',flexDirection:'row',gap:5,justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity  onPress={() => {
            handleResendCode();
          }}>
       <Text
         
          style={{
            color: AppColors.appThemeColor,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          RESEND CODE
        </Text>
        </TouchableOpacity>
        <ActivityIndicator style={{display:load?'flex':'none'}} size={'small'} animating={load} color={AppColors.appThemeColor}></ActivityIndicator>
        <AntDesign style={{display:showTick?'flex':'none'}} name="checkcircle" color={'#34b233'} size={15}></AntDesign>
       </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
    paddingTop: 10,
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

export default VerificationCode;
