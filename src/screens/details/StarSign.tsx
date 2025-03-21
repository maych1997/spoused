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
import { star } from "../../data/ProfileQuestions";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateStarApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile, updatestarsignfilter } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const StarSign = (props: any) => {
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
  const { back, setStarFilter, starFilter } = route.params;
  const [selectedStar, setSelectedStar] = useState(starFilter);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();

  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.starSign) {
      setSelectedStar(reduxState?.auth?.user?.myprofile?.starSign);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateStarApi(
        selectedStar, // Ignore gender
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
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        console.log("this is the star sign from advance filter");
        setStarFilter(selectedStar);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      } else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  const starForFilter = (arr: any) => {
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
          data={star}
          options={back === 2 ? starForFilter(star) : removeAny(star)}
          setSelected={setSelectedStar}
          heading="What’s Your Star Sign?"
          subheading="Select The Option That Best Describes You"
          addSearch={false}
        >
          <OptionSelect
            options={star}
            setSelected={(value: string) => {
              setSelectedStar(value);
            }}
            selected={selectedStar}
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

export default StarSign;
