import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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
import Biography from "../onBoarding/components/Biography";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updatebiography, updatebioredux, updatemyprofile } from "../../../redux/authSlice";
import { updateBiographyApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const Bio = (props: any) => {
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
  const { back } = route.params;
  const [bio, setBio] = useState(""); // State to hold the bio value
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const { openModal } = useInfoModal();
  useEffect(() => {
    if(reduxState?.auth?.user?.myprofile?.biography){
      setBio(reduxState?.auth?.user?.myprofile?.biography);
    }
  } ,[]);

  const showToast = (title: string, message: string) => {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  }


  const updateDetails = async () => {

    if(bio === ""){
      showToast("Biography is empty", "Please enter a biography");
      return;
    }
    try {
      const response = await updateBiographyApi(
        bio,
        reduxState.auth.token // token from redux state
      );

      if (!response.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (response.success) {
        dispatch(updatemyprofile(response.user));
      }
    } catch (error) {
      console.error("Error updating biography:", error);
    }
  };

  const backHandler = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  const handleDone = () => {
    if (back === 0) {
      console.log("this is the one")
      updateDetails();
      props.navigation.navigate("ViewProfile");
      openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ padding: 5 }} keyboardShouldPersistTaps="handled">
          <Ionicons
            name="chevron-back"
            size={34}
            onPress={backHandler}
            color="black"
            style={{ position: "absolute", left: 0 }}
          />
          <Biography setBio={setBio} bio={bio} />
        </ScrollView>
        <View style={{ padding: 15 }}>
          <CommonButton title={"Done"} pressHandler={handleDone} />
        </View>
      </KeyboardAvoidingView>
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
});

export default Bio;
