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
import { ethnicOrigin } from "../../data/ProfileQuestions";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateDrinkingApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatedrinkfilter, updatemyprofile } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const Drink = (props: any) => {
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
  const { back, setDrinkFilter, drinkFilter } = route.params;
  const [selectedDrink, setSelectedDrink] = useState(drinkFilter);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const { openModal: triggerInfoModal } = useInfoModal();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.drink) {
      setSelectedDrink(reduxState?.auth?.user?.myprofile?.drink);
    }
  }, []);


  const updateDetails = async () => {
    try {
      const response = await updateDrinkingApi(
        selectedDrink, // Ignore gender
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
      console.log("it is in back = 0");
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      console.log("it is in back = 1");
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      console.log("it is in back = 2");
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        console.log("this is the drink from pro filters");
        setDrinkFilter(selectedDrink);
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      } else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true)
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 5 }}>
        {/* <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        /> */}
        <Question
          backHandler={backHandler}
          data={["Yes", "No"]}
          options={back === 2 ? ["No Preference", "Yes", "No"] : ["Yes", "No"]}
          setSelected={setSelectedDrink}
          heading="Do You Drink?"
          subheading="Select The Option That Best Describes You"
          addSearch={false}
        >
          <OptionSelect
            options={["Yes", "No"]}
            setSelected={(value: string) => {
              setSelectedDrink(value);
            }}
            selected={selectedDrink}
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

export default Drink;
