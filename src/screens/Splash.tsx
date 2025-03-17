import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Image, Alert, ActivityIndicator, Text } from "react-native";
import { AppColors } from "../utility/AppColors";
import { AppImages } from "../utility/AppImages";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileApi } from "../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { logout, updatemyprofile } from "../../redux/authSlice";
import * as Location from 'expo-location';
import {getUserMatchesApi} from "../../api/UserMatches/GetApis/getUserMatchesApi";
import { setUserMatches, setLoadingComplete } from "../../redux/authSlice";
import { Button } from "react-native";



const Splash = (props) => {
  const [progress] = useState(new Animated.Value(0));
  const reduxState = useSelector((state) => state);
  const token = reduxState.auth.token;
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert("Location Access", "Please enable location access to use the app.");
        return;
      }
    };
    requestLocationPermission();
  },[]);

  useEffect(() => {
    console.log("Splash Screen22222");
    // dispatch(logout());
    const fetchCoordinatesAndProfile = async () => {
      try {
        // Navigate to the next screen after fetching profile data
        if (reduxState.auth.token) {
          const location=Location.hasServicesEnabledAsync();
          // const location = await Location.getCurrentPositionAsync({});
          // const coordinates = [location.coords.latitude, location.coords.longitude];
          const coordinates = [51.5074, 0.1278];
          const response = await getMyProfileApi(reduxState.auth.token, coordinates);

         const response2= await getUserMatchesApi(reduxState.auth.token);
          console.log("token:" , reduxState.auth.token);
          
          dispatch(updatemyprofile(response.data));
          
          if(!response.data.generalInfoCompleted){
            props.navigation.navigate("OnboardingNavigator");
            return;
          }
          console.log("are we here?");
          
          if (!response.data.onboardingCompleted || !response.data.onboardingCompleted) {
            props.navigation.navigate("OnboardingNavigator", { screen: "CompleteProfile" });
            return;
          }
          console.log("are we here?");
              // Fetch User Matches and Update Redux
          const matches = await getUserMatchesApi(reduxState.auth.token);
          dispatch(setUserMatches(matches));
          dispatch(setLoadingComplete(true));


          
          props.navigation.navigate("Tab");
        } else {
          props.navigation.navigate("GetStarted");
        }
      } catch (error) {
        console.error("Error fetching profile data:1", error);
      }
    };

    fetchCoordinatesAndProfile();
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: AppColors.appThemeColor,
      alignItems: "center",
      justifyContent: "center",
    },
    logoStyle: {
      height: 140,
    },
    progressBar: {
      width: "80%",
      height: 10,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      marginTop: 20,
      borderRadius: 5,
      position: "absolute",
      bottom: 30,
    },
    progressFill: {
      height: "100%",
      backgroundColor: AppColors.whiteColor,
      borderRadius: 5,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoStyle}
        source={AppImages.LOGO_STACKED}
        resizeMode="contain"
      />
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

export default Splash;
