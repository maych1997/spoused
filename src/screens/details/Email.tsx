import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { InputField } from "../../components/common/InputField";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { useSelector } from "react-redux";
interface RouteParams {
  back: number;
}
const Email = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [email, setEmail] = useState("");
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const reduxState = useSelector((state) => state);
  const { back } = route.params;

  useEffect(() => {
    setEmail(reduxState?.auth?.user?.myprofile?.email);
  }, []);

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
        <View style={styles.contentWrapper}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
            }}
          >
            Email Address
          </Text>
          <InputField
            label="Your Email Address"
            placeholder="Write Here"
            text={email}
            onChangeText={setEmail}
            editable={false}
          />
        </View>
      </ScrollView>
      {/* <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={backHandler} disable={true} />
      </View> */}
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

export default Email;
