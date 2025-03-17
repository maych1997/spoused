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
import RangeSlider from "react-native-range-slider-expo";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";

interface RouteParams {
  back: number;
}
const AgePreference = (props: any) => {
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
  const backHandler = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <View style={{ padding: 15, marginTop: 50 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
            }}
          >
            What Kind of Partner Do You Prefer?
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: AppColors.secondaryText,
              marginVertical: 10,
            }}
          >
            Who Would You Like To Date
          </Text>
          <View style={[styles.rowContainer, { marginTop: 35 }]}>
            <Text
              style={[styles.standardText, { fontFamily: "Poppins_700Bold" }]}
            >
              Age
            </Text>
            <Text
              style={[
                styles.standardText,
                { fontFamily: "Poppins_400Regular" },
              ]}
            >
              Any Age
            </Text>
          </View>
          <RangeSlider
            toKnobColor={AppColors.appThemeColor}
            fromKnobColor={AppColors.appThemeColor}
            min={18}
            max={85}
            fromValueOnChange={(value) => console.log(value)}
            toValueOnChange={(value) => console.log(value)}
            initialFromValue={11}
            barHeight={4}
            showValueLabels={false}
          />
        </View>
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
  standardText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
});

export default AgePreference;
