import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
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
import { RouteProp, useRoute } from "@react-navigation/native";
import Interests from "../onBoarding/components/Interests";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateInterestsApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updateinterestsfilter, updatemyprofile } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";


interface RouteParams {
  back: number;
  oldInterests: string[];
}

const Interest = (props: any) => {

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
  const { back, setInterestsFilter, interestsFilter } = route.params;
  const [selectedInterests, setSelectedInterests] = useState(interestsFilter);
  const { openModal: triggerInfoModal } = useInfoModal();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.interests) {
      setSelectedInterests(reduxState?.auth?.user?.myprofile?.interests);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateInterestsApi(
        selectedInterests,
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
      console.log("this is the one")
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        console.log("this is the intrest from advance filter");
        setInterestsFilter(selectedInterests);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      } else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <Interests
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
        />
      </ScrollView>
      <View style={{ padding: 5 }}>
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

export default Interest;
