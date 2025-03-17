import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
} from "react-native"; import {
  updatemyprofile,
} from "../../../redux/authSlice";

import { useSelector, useDispatch } from "react-redux";
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
import { RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CommonButton, { DateButton } from "../../components/common/CommonButton";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import { updateBirthdayApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";
interface RouteParams {
  back: number;
}
const DateOfBirth = (props: any) => {
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
  const reduxState = useSelector((state) => state);
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();
  const { openModal } = useInfoModal();
  useEffect(() => {
    if (reduxState?.auth?.user?.myprofile?.birthday) {
      setDate(new Date(reduxState?.auth?.user?.myprofile?.birthday));
    }
  }, []);

  const showToast = (title: string, message: string) => {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  }

  const updateDetails = async () => {
    if (getAge(date) < 18) {
      openModal("Age Requirement", "You must be 18 years or older to use the app", "Try Again", "error");

      return;
    }
    const birthday = date.toISOString().split('T')[0];
    const age = getAge(date);

    try {
      const response = await updateBirthdayApi(
        birthday, // Ignore gender
        age,
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      display: 'spinner',
      maximumDate: new Date(),
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onAppleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const backHandler = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
        />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginVertical: 20,
            marginLeft: 20,
          }}
        >
          Tell Us Your Birthday
        </Text>
        <View style={{ flexDirection: "row" }}></View>
        <View style={{ height: 350, alignSelf: "center" }}>

          {Platform.OS === "ios" ? (
            <RNDateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onAppleChange}
              maximumDate={new Date()}
            />
          ) :
            <DateButton
              title={"Select Date"}
              pressHandler={showDatepicker}
            />
          }
          <Text
            style={{
              marginTop: 40,
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 13,
              color: "lightgrey",
            }}
          >
            You're
          </Text>
          <Text
            style={{ marginTop: 10, marginLeft: 20, alignSelf: "center" }}
          >
            {getAge(date)}{" "}
            Years old
          </Text>
        </View>
      </View>
      <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={updateDetails} />
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

export default DateOfBirth;
