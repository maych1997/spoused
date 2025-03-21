import { useEffect, useState } from "react";
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
import {Question} from "../onBoarding/components/Question";
import { ethnicOrigin, religion } from "../../data/ProfileQuestions";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateReligionApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile, updatereligionfilter } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const Religion = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const reduxState = useSelector((state) => state); ``
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back, setReligionFilter, religionFilter } = route.params;
  const [selectedReligion, setSelectedReligion] = useState(religionFilter);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();

  useEffect(() => {
    console.log("this is the religion handler");
    console.log(reduxState?.auth?.user?.myprofile?.religion);
    console.log(reduxState?.auth?.user?.myprofile);


    if (back === 0 && reduxState?.auth?.user?.myprofile?.religion) {
      console.log("its not connected to this one ");

      setSelectedReligion(reduxState?.auth?.user?.myprofile?.religion);
    }
  }, []);

  const updateDetails = async () => {
    try {

      console.log("this is the selected religion ");
      console.log(selectedReligion);

      const response = await updateReligionApi(
        selectedReligion, // Ignore gender
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
      console.log("this is back == 0");
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      console.log("this is back == 1");
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      console.log("this is back == 2");
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        console.log("this is the religion from advance filter");
        setReligionFilter(selectedReligion);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      } else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  const religionForFilter = (arr: any) => {
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
      <ScrollView style={{ padding: 5 }}>
        <Question
          backHandler={backHandler}
          data={{religion}}
          options={back === 2 ? religionForFilter(religion) : removeAny(religion)}
          setSelected={setSelectedReligion}
          heading="What Is Your Religion?"
          subheading="Select The Religion That Best Describes You"
          addSearch={false}
        >
          <OptionSelect
            options={religion}
            setSelected={(value: string) => {
              setSelectedReligion(value);
            }}
            selected={selectedReligion}
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

export default Religion;
