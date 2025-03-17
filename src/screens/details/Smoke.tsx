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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateSmokerApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile, updatesmokefilter } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const Smoke = (props: any) => {
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
  const { back, setSmokeFilter, smokeFilter } = route.params;
  const [selectedSmoker, setSelectedSmoker] = useState(smokeFilter);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.smoking) {
      setSelectedSmoker(reduxState?.auth?.user?.myprofile?.smoking);
    }
  }, []);


  const updateDetails = async () => {
    try {
      const response = await updateSmokerApi(
        selectedSmoker, // Ignore gender
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
      console.log("is it in back 0");
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      console.log(" is it in back 1");
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      console.log("this is the smoke from advance filter");
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        setSmokeFilter(selectedSmoker);
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
      <ScrollView style={{ padding: 5 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <Question
          setSelected={setSelectedSmoker}
          heading="Do You Smoke?"
          options={back === 2 ? ["No Preference", "Yes", "No"] : ["Yes", "No"]}
          subheading="Select From The Options Below"
          addSearch={false}
        >
          <OptionSelect
            options={["Yes", "No"]}
            setSelected={(value: string) => {
              setSelectedSmoker(value);
            }}
            selected={selectedSmoker}
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

export default Smoke;
