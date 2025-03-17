import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { AppImages } from "../../utility/AppImages";
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
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { useDispatch, useSelector } from "react-redux";
import { updatemyprofile } from "../../../redux/authSlice";

interface RouteParams {
  currentFlow: number;
}

const UnderReview = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { currentFlow } = route.params;
  const ReduxState = useSelector((state) => state);
  const dispatch = useDispatch();

  const handlePress = async () => {
    if (currentFlow === 1) {
      props.navigation.navigate("AddPhotos");
    } else {
      props.navigation.navigate("Home");
    }
  }
  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View
        style={{
          padding: 15,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <MaterialIcons
          onPress={() => props.navigation.navigate("Home")}
          name="cancel"
          size={34}
          color="white"
          style={{ margin: 5, position: "absolute", left: 15, top: 20 }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
              textAlign: "center",
            }}
          >
            Congratulations! {"\n"}Your Profile is Verified.
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: AppColors.secondaryText,
              marginVertical: 20,
            }}
          >
            Now you can access all the features of the app.
          </Text>
          <Image
            source={AppImages.DOCUMENT_REVIEW}
            style={{ height: 281, width: 281 }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={{ padding: 15 }}>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: AppColors.blackColor,
            padding: 15,
            borderRadius: 220,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              color: AppColors.whiteColor,
            }}
          >
            Okay
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.appThemeColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  lightText: {
    color: AppColors.secondaryText,
    textAlign: "center",
    marginVertical: 10,
  },
  contentContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 12,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 5,
  },
});

export default UnderReview;
