import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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
import Question from "../onBoarding/components/Question";
import { ethnicOrigin, languages } from "../../data/ProfileQuestions";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateLanguageApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatelanguagefilter } from "../../../redux/authSlice";
interface RouteParams {
  back: number;
}
const Language = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [selectedLanguage, setLanguage] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;

 const dispatch = useDispatch();
 const reduxState = useSelector((state) => state);
 const updateDetails = async () => {
   try {
     const response = await updateLanguageApi(
       selectedLanguage,
       reduxState.auth.token // token from redux state
     );
   } catch (error) {
     console.error("Error fetching user matches:", error);
   }
 };

 const backHandler = () => {
   if (back === 0) {
     updateDetails();

     props.navigation.navigate("ViewProfile");
   } else if (back === 1) {
     props.navigation.navigate("Settings");
   } else if (back === 2) {
     dispatch(updatelanguagefilter(selectedLanguage));
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
          data={languages}
          options={languages}
          setSelected={setLanguage}
          heading="Language"
          subheading="Select language"
          addSearch={true}
          placeholder="Search Language"
        >
          <OptionSelect
            options={languages}
            setSelected={(value: string) => {
              setLanguage(value);
            }}
            selected={selectedLanguage}
          />
        </Question>
      </ScrollView>
      <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={backHandler} />
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

export default Language;
