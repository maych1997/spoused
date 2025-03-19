import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { AppColors } from "../utility/AppColors";
import { AppImages } from "../utility/AppImages";
import { FULL_WIDTH } from "../utility/Constant";
import * as Location from "expo-location";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { appleLoginApi } from "../../api/Auth/PostApis/appleLoginApi";
import { useDispatch } from "react-redux";
import { getMyProfileApi } from "../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { login, updatemyprofile } from "../../redux/authSlice";
import { googleLoginApi } from "../../api/Auth/PostApis/googleLoginApi";
import messaging from "@react-native-firebase/messaging";
import navigation from "@/core/navigation";
import { Image } from "expo-image";
import { IS_IOS, Text, View, TouchableOpacity } from "@/ui";
import TermsConditionsFooter from "@/components/common/terms-conditions";
import { ScreenView } from "@/components/screen";
import { useInfoModal } from "@/context/ModalContext";

GoogleSignin.configure({
  iosClientId: "552083144237-m5rm1eaadoh1ns6fdmbchnl22o7k9scu.apps.googleusercontent.com",
  scopes: ["profile", "email"],
});

const GetStarted = (props: any) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [coordinates, setCoordinates] = useState<number[]>([0, 0]);
  const [fcm, setFcm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { openModal } = useInfoModal();
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationGranted(false);
        setErrorMsg("Permission to access location was denied");
        Alert.alert("Location Access", "Please enable location access to use the app.");
        return; // Stop execution if permission is denied
      }
      
      setLocationGranted(true);
      
      // Get the user's location
      let location = await Location.getCurrentPositionAsync({});
      setCoordinates([location.coords.latitude, location.coords.longitude]);
    };
  
    requestLocationPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  };

  useEffect(() => {
    console.log('GetStarted Screen');
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => setFcm(token));
    } else {
      return;
    }
  }, []);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      // const data = await appleLoginApi(credential.email, credential.fullName, credential.user, fcm, coordinates);
      const data = await appleLoginApi(credential.email, credential.fullName, credential.user, fcm, [51.5074, 0.1278]);
      if (data.success) {
        if (!data.user.isEmailVerified) {

          openModal("Email Not Verified", "Please verify your email", "OK", "error");
          setLoading(false);
          return;
        }
        dispatch(login(data));
        try {
          // const response = await getMyProfileApi(data.user.id, coordinates);
          const response = await getMyProfileApi(data.user.id, [51.5074, 0.1278],);
          dispatch(updatemyprofile(response.data));

          if (!data.user.generalInfoCompleted) {
            setLoading(false);
            navigation.navigate("OnboardingNavigator");
            return;
          }

          if (!data.user.onboardingCompleted) {
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
        openModal("Invalid email or password", "Please enter a valid email and password", "OK", "error");
      }

      // signed in
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        return;
      } else {
        // handle other errors
        openModal("Error", "Please try again", "OK", "error");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // log in using Google account (on Android it will only work if google play services are installed)
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo) {
        Alert.alert("Error", "Please try again");
        return;
      }

      // const data = await googleLoginApi(userInfo.user.email, userInfo.user.name, userInfo.user.id, fcm, coordinates);
      const data = await googleLoginApi(userInfo.user.email, userInfo.user.name, userInfo.user.id, fcm, [51.5074, 0.1278],);

      if (data.success) {
        if (!data.user.isEmailVerified) {
          openModal("Email Not Verified", "Please verify your email", "OK", "error");
          setLoading(false);
          return;
        }
        dispatch(login(data));
        try {
          // const response = await getMyProfileApi(data.user.id, coordinates);
          const response = await getMyProfileApi(data.user.id, [51.5074, 0.1278],);
          dispatch(updatemyprofile(response.data));

          if (!data.user.generalInfoCompleted) {
            setLoading(false);
            navigation.navigate("OnboardingNavigator");
            return;
          }

          if (!data.user.onboardingCompleted) {
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
        openModal("Invalid email or password", "Please enter a valid email and password", "OK", "error");
      }
    } catch (error: any) {
      openModal("Error", error.code + " " + error.message, "OK", "error");
    }
  };

  return (
    <ScreenView style={styles.container}>
      <View style={styles.container2}>
        <Image source={AppImages.GET_STARTED_HEADER} style={styles.headerImage} contentFit="contain" className="flex w-full h-5/6" />
        <Image cachePolicy={"disk"} source={AppImages.LOGO} contentFit="contain" className="flex items-center justify-center w-72 h-48" />
        <Text className="text-center font-bold text-4xl my-5">Date With Purpose!</Text>
      </View>

      {IS_IOS && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={30}
          style={[styles.button, { padding: 27 }]}
          onPress={handleAppleSignIn}
        />
      )}

      {/* Continue with Google */}
      <TouchableOpacity style={[styles.button, { backgroundColor: AppColors.whiteColor }]} onPress={()=>{
        if(!locationGranted){
          Alert.alert("Location Access", "Please enable location access to use the app.");
        }else{
          handleGoogleSignIn();
        }
      }}>
        <Image style={styles.googleIcon} source={AppImages.GOOGLE_ICON} />
        <Text className="text-center text-lg ml-2">Continue with Google</Text>
      </TouchableOpacity>

      <View className="flex my-5">
        <Text
          onPress={() => {
            // if(!locationGranted){
            //   Alert.alert("Location Access", "Please enable location access to use the app.");
            // }else{
              navigation.navigate('SignIn');
            // }
          }}
          className="underline font-semibold text-center"
        >
          Continue with Email
        </Text>

        {/*<Text*/}
        {/*  onPress={() => {*/}
        {/*    navigation.navigate("SignUp");*/}
        {/*  }}*/}
        {/*  className="underline font-semibold text-center mt-5"*/}
        {/*>*/}
        {/*  Create an account*/}
        {/*</Text>*/}
      </View>
      <TermsConditionsFooter />
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.appThemeColor,
  },
  container2: {
    flex: 0.78,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    position: "absolute",
    top: -220,
    width: FULL_WIDTH,
  },
  logo: {
    width: 250,
    marginTop: 50,
  },
  button: {

    width: "100%",
    borderRadius: 100,
    flexDirection: "row",
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  googleIcon: {
    height: 24,
    width: 24,
  },
});

export default GetStarted;
