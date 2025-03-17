import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import CommonButton from "../../components/common/CommonButton";
import BreakOptions from "./components/BreakOptions";
import globalStyles from "../../styles/globalStyles";
import { deleteUserApi } from "../../../api/Auth/PostApis/deleteUserApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/authSlice";

const Break = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const breakOptions = [
    "Met my partner on Spoused",
    "Met my partner elsewhere",
    "Taking a break",
    "Didn’t like Spoused",
    "Other",
  ];
  const [selectedOption, setSelectedOption] = useState("");
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const res = await deleteUserApi(reduxState.auth.token);

      if (res.success) {
        dispatch(logout());
        props.navigation.navigate("GetStarted");
      }

    } catch (err) {
      console.error(err);
    }
  }


  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ padding: 15, flex: 1 }}>
        {/* header */}
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={() => props.navigation.navigate("Settings")}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />

        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Take A Break
        </Text>
        <Text
          style={[
            {
              fontFamily: "Poppins_500Medium",
              lineHeight: 20,
            },
            styles.lightText,
          ]}
        >
          Need To Take A break From Spoused?{"\n"}Don’t Worry. We’ve Got You
          Covered
        </Text>

        <BreakOptions options={breakOptions} setSelected={setSelectedOption} />
      </View>
      <View style={{ padding: 15 }}>
        <CommonButton
          title="Submit"
          disable={selectedOption === "" ? true : false}
          pressHandler={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },

  heading: {
    fontSize: 24,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 60,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 12,
  },
});
export default Break;
