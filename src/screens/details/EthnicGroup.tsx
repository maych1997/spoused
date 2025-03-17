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
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateEthnicOriginApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import CommonButton from "../../components/common/CommonButton";
import { updatemyprofile } from "../../../redux/authSlice";
import {useInfoModal} from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const EthnicGroup = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [selectedEthnicOrigin, setSelectEthinicOrigin] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const { openModal } = useInfoModal();

  useEffect(() => {
    if (back === 0 && reduxState?.auth?.user?.myprofile?.location) {
      setSelectEthinicOrigin(reduxState?.auth?.user?.myprofile?.location);
    }
  }, []);

  const updateDetails = async () => {
    try {
      const response = await updateEthnicOriginApi(
        selectedEthnicOrigin,
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
      openModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

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
          data={ethnicOrigin}
          options={ethnicOrigin}
          setSelected={setSelectEthinicOrigin}
          heading="Where Are You From?"
          subheading="Select Your Home Country"
          addSearch={true}
          placeholder={"Search Location"}
        >
          <OptionSelect
            options={ethnicOrigin}
            setSelected={(value: string) => {
              setSelectEthinicOrigin(value);
            }}
            selected={selectedEthnicOrigin}
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

export default EthnicGroup;
