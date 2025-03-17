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
import { ethnicity } from "../../data/ProfileQuestions";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateEthnicityFilter, updatemyprofile } from "../../../redux/authSlice";
import { updateEthnicityApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const Ethnicity = (props: any) => {
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
  const { back ,setEthnicFilter, ethnicFilter } = route.params;
  const [selectedEthnicity, setSelectEthnicity] = useState(ethnicFilter);
  const { openModal } = useInfoModal();
  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.ethnicGroup) {
      setSelectEthnicity(reduxState?.auth?.user?.myprofile?.ethnicGroup);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateEthnicityApi(
        selectedEthnicity, // Ignore gender
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
    if(back === 0){
      console.log("this is the one")
      updateDetails();
      props.navigation.navigate("ViewProfile");
      openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    }else if(back === 1){
      props.navigation.navigate("Settings");
    } else if(back === 2){
      setEthnicFilter(selectedEthnicity);
      props.navigation.navigate("Tab", { screen: "Filters" });
      openModal("Filters Saved!", "Filters changed successfully", "Okay", "success");
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
          back={back}
          data={ethnicity}
          options={ethnicity}
          setSelected={setSelectEthnicity}
          heading="Ethnicity"
          subheading="Select Ethnicity"
          addSearch={true}
          placeholder={"Search Ethnic Group"}
        >
          <OptionSelect
            setSelected={(value: string) => {
              setSelectEthnicity(value);
            }}
            selected={selectedEthnicity}
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Ethnicity;
