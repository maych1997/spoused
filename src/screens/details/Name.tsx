import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, Alert } from "react-native";
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
import { ScrollView } from "react-native-virtualized-view";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { InputField } from "../../components/common/InputField";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { updateNameApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { useSelector, useDispatch } from "react-redux";
import { updatemyprofile } from "../../../redux/authSlice";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const Name = (props: any) => {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [profileData, setProfileData] = useState({});
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const [fullName, setFullName] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;
  const { openModal } = useInfoModal();
  useEffect(() => {
    setFullName(reduxState?.auth?.user?.myprofile.fullName);
  }, []);

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

      const newFullName = fullName; // Replace this with the new full name
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(newFullName) || newFullName.length < 2) {
        openModal("Oops!","Please enter a valid name ", "Try Again", "error");

        return;
      }

    try {
      const response = await updateNameApi(
        fullName,
        reduxState.auth.token // token from redux state
      );

      if (!response.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (response.success) {
        dispatch(updatemyprofile(response.user));
        if (back === 0) {
          console.log("this is the one")
          props.navigation.navigate("ViewProfile");
          openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");

        } else if (back === 1) {
          props.navigation.navigate("Settings");
        } else if (back === 2) {
          props.navigation.navigate("Tab", { screen: "Filters" });
        }
      }

    } catch (error) {
      console.error("Error fetching user matches:", error);
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

  if (!fontsLoaded) {
    return null; // Optionally render a loading indicator
  }

  const onFocusTextInput = () => {
    // Keyboard opened
  };

  const onBlurTextInput = () => {
    // Keyboard closed
  };

  if (!fontsLoaded) {
    return null; // Optionally render a loading indicator
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={{ padding: 15 }}>
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
              Full Name
            </Text>
            <InputField
              label="Enter full name."
              placeholder="Write Here"
              text={fullName}
              onChangeText={setFullName}
              onFocus={onFocusTextInput}
              onBlur={onBlurTextInput}
            />
          </View>
          <View style={{ padding: 15 }}>
            <CommonButton title={"Done"} pressHandler={updateDetails} />
          </View>
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
  contentWrapper: {
    padding: 5,
    marginTop: 60,
  },
});

export default Name;
