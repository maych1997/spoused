import { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateDatingPreferenceApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updateDatingPreferences, updateGenderFilter, updatemyprofile, updateUser } from "../../../redux/authSlice";
import Question from "../onBoarding/components/Question";
import InterestedIn from "../onBoarding/components/InterestedIn";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const DatingPreference = (props: any) => {
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
  const reduxState = useSelector((state) => state);
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back, setGenderFilter, genderFilter } = route.params;
  const [selectedDatingPreference, setSelectedDatingPreference] = useState(genderFilter);
  const { openModal } = useInfoModal();

  const backHandler = () => {
    if (back === 0) {
      updateDetails();
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

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

  const handleDone = () => {
    if (back === 0) {
      console.log("this is the one")
      updateDetails();
      // props.navigation.navigate("ViewProfile");
      openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      if(selectedDatingPreference.length ===  0){
        showToast("Error", "Please select at least one option");
        return
      }
      setGenderFilter(selectedDatingPreference);
      props.navigation.navigate("Tab", { screen: "Filters" });
      openModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
    }
  }
  const updateDetails = async () => {
    try {
      const response = await updateDatingPreferenceApi(
        selectedDatingPreference,
        reduxState?.auth?.token
      );
       if (!response.success) {
              Alert.alert("Try Again", "Something went wrong. Please try again.");
              return
      }
      
            if (response.success) {
              console.log('::::::::::::::::::::::::',response?.user?.datingPreferences);
              console.log('::::::::::::::::::::::::',reduxState.auth.token);
              dispatch(updatemyprofile(response.user));
            }
    } catch (error) {
      console.error("Error fetching user matches:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ marginBottom: 0 }}
        />
        <InterestedIn
          heading="Gender"
          subheading=""
          selected={selectedDatingPreference}
          setSelected={(value: string) => {
            setSelectedDatingPreference(value);
          }}
        />
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
    padding: 15,
    marginTop: 60,
  },
});

export default DatingPreference;
