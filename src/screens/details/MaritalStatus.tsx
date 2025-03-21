import { View, StyleSheet, Text, SafeAreaView, Alert } from "react-native";
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
import {Question} from "../onBoarding/components/Question";
import { maritalStatus } from "../../data/ProfileQuestions";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateMaritalApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const MaritalStatus = (props: any) => {
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
  const { back, setMaritalFilter, maritalFilter } = route.params;
  const [status, setStatus] = useState(maritalFilter);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();
  useEffect(() => {
    if (reduxState?.auth?.user?.myprofile?.maritalStatus && back === 0) {
      setStatus(reduxState?.auth?.user?.myprofile?.maritalStatus);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateMaritalApi(status, reduxState.auth.token);

      if (!response.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (response.success) {
        dispatch(updatemyprofile(response.user));
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


  const handleDone = () => {
    if (back === 0) {
      console.log("this cames from edit profile marital status");
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        console.log("in the maratial status from the advance filters");

        setMaritalFilter(status);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      }
      else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  const maritalForFilter = (arr: any) => {
    if (arr[0] !== "No Preference") {
      arr.unshift("No Preference")
    }
    return arr;
  }

  const removeAny = (arr: any) => {
    if (arr[0] === "No Preference") {
      arr.shift();
    }
    return arr;
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 10 }}>
        <Question
          backHandler={backHandler}
          options={back === 2 ? maritalForFilter(maritalStatus) : removeAny(maritalStatus)}
          setSelected={setStatus}
          heading="What Is Your Marital Status"
          subheading="Select Your Marital Status"
          addSearch={false}
        >
          <OptionSelect
            setSelected={(value: string) => setStatus(value)}
            selected={status}
          />
        </Question>
      </ScrollView>
      <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={handleDone} />
      </View>

      <SubscriptionModal openModal={openModal} setOpenModal={setOpenModal} />
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

export default MaritalStatus;
