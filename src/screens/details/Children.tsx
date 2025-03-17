import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Alert } from "react-native";
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
import {Question} from "../onBoarding/components/Question";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateChildrenApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const Children = (props: any) => {
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
  const { back, setChildFilter, childFilter } = route.params;
  const [value, setValue] = useState(childFilter);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();

  useEffect(() => {
    if (reduxState?.auth?.user?.myprofile?.children && back === 0) {
      setValue(reduxState?.auth?.user?.myprofile?.children);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateChildrenApi(value, reduxState.auth.token);

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
        console.log("this is the children from advance filter and you may have premium plan enabled");

        setChildFilter(value);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      }
      else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 10 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <Question
          options={back === 2 ? ["No Preference", "Yes", "No", "Maybe"] : ["Yes", "No", "Maybe"]}
          setSelected={setValue}
          heading="Do You Want To Have Children?"
          subheading="Select One Of The Following Options"
          addSearch={false}
        >
          <OptionSelect
            setSelected={setValue}
            selected={value}
          />
        </Question>
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
});

export default Children;
