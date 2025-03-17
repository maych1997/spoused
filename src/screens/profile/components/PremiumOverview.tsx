import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import { AppColors } from "../../../utility/AppColors";
import { AppImages } from "../../../utility/AppImages";
import { MaterialIcons } from "@expo/vector-icons";
const PremiumOverview = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [isPremium, setIsPremium] = useState(false);
  return (
    <View style={styles.container}>
      {!isPremium ? (
        <>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "rgba(0, 0, 0, 0.4)",
              flex: 1,
            }}
          >
             Our Premium plan is a{"\n"}lot more fun.
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: AppColors.blackColor,
              }}
            >

            </Text>
          </Text>

          <TouchableOpacity
            onPress={() => setIsPremium(true)}
            style={{
              backgroundColor: "#A17900",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: AppColors.whiteColor,
              }}
            >
              Go Premium
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: AppColors.blackColor,
            }}
          >
            Premium{"\n"}
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: AppColors.blackColor,
              }}
            >
              $9.00/ Monthly
            </Text>
          </Text>

          <TouchableOpacity
            onPress={props.manageSubscription}
            style={{
              borderWidth: 1,
              padding: 15,
              borderColor: AppColors.blackColor,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: AppColors.blackColor,
              }}
            >
              Manage
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: AppColors.appThemeColor,
    padding: 10,
    marginTop: 180,
    margin: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default PremiumOverview;
