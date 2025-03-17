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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { InputField } from "../../components/common/InputField";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateJobTitleApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";

interface RouteParams {
  back: number;
}
const JobTitle = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [jobTitle, setJobTitle] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;

  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const updateDetails = async () => {
    try {
      const response = await updateJobTitleApi(
        jobTitle,
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
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ padding: 15 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <View style={styles.contentWrapper}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
            }}
          >
            Job Title
          </Text>
          <InputField
            label="Enter Job Title"
            placeholder="Enter Here"
            text={jobTitle}
            onChangeText={setJobTitle}
          />
        </View>
      </View>
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
  contentWrapper: {
    padding: 5,
    marginTop: 60,
  },
});

export default JobTitle;
