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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateGenderApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updateGenderFilter, updatemyprofile } from "../../../redux/authSlice";
import {Question} from "../onBoarding/components/Question";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}

const Gender = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });


  const [selectedGender, setSelectedGender] = useState("");
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;
  const { openModal } = useInfoModal();

  useEffect(() => {
    setSelectedGender(reduxState?.auth?.user?.myprofile.gender);
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateGenderApi(
        selectedGender,
        reduxState.auth.token
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
      console.log("this is the one");
      openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
      updateDetails();
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      console.log("this is the 2");
      updateDetails();
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      dispatch(updateGenderFilter(selectedGender));
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        <Question
          backHandler={backHandler}
          heading={back === 2 ? "Gender" : "What is your Gender"}
          subheading={back === 2 ? "Please Select the Gender" : "Please Select your Gender"}
          options={["Male", "Female", "Non-Binary"]}
        >
          <OptionSelect
            options={["Male", "Female", "Non-Binary"]}
            setSelected={(value: string) => {
              setSelectedGender(value);
            }}
            selected={selectedGender}
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
  contentWrapper: {
    padding: 15,
    marginTop: 60,
  },
});

export default Gender;
