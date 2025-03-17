import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { InputField } from "../../components/common/InputField";
import CommonButton from "../../components/common/CommonButton";
import PhoneNumberInput from "../onBoarding/components/PhoneNumberInput";
import globalStyles from "../../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { updatePhone } from "../../../api/ProfileCompletion/PostApis/updatePhone";
import { updatemyprofile } from "../../../redux/authSlice";
interface RouteParams {
  back: number;
}
const PhoneNumber = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const reduxState = useSelector((state) => state);
  const { back } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    setCode(reduxState?.auth?.user?.myprofile?.phoneCode);
    setPhone(reduxState?.auth?.user?.myprofile?.phoneNumber);
  }, []);


  const backHandler = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  const updateNumber = async () => {

    try {
      const res = await updatePhone(code, phone, reduxState.auth.token);

      if (!res.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleDone = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      updateNumber();
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <View style={styles.contentWrapper}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
            }}
          >
            What Is your Phone Number?
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: AppColors.secondaryText,
              marginVertical: 10,
            }}
          >
            Please enter your phone number
          </Text>
          <PhoneNumberInput onChangeText={setPhone} text={phone} code={code} setCode={setCode} />
        </View>
      </ScrollView>
      <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={handleDone} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentWrapper: {
    padding: 5,
    marginTop: 60,
  },
});

export default PhoneNumber;
