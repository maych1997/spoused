import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppColors } from "../../../utility/AppColors";
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
export default function VerificationSteps(props: any) {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.whiteColor,
      marginVertical: 30,
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    roundContainer: {
      backgroundColor: "#E5E5E5",
      borderRadius: 100,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
    },
    headerContainer: {
      flexDirection: "row",
      padding: 15,
      alignItems: "center",
    },
    contentWrapper: {
      padding: 15,
      marginTop: 30,
    },
    standardText: {
      fontSize: 14,
      color: AppColors.blackColor,
    },
    separator: {
      height: 50,
      borderLeftWidth: 2,
      borderColor:
        props.step === 1 ? AppColors.blackColor : AppColors.lightGrey,
      alignSelf: "flex-start",
      marginLeft: 20,
      marginVertical: 5,
    },
  });

  return (
    <View style={styles.container}>
      {/* step 1 */}
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.roundContainer,
            { width: 40 },
            props.step >= 1 && { backgroundColor: AppColors.appThemeColor },
          ]}
        >
          <Text
            style={[{ fontFamily: "Poppins_500Medium" }, styles.standardText]}
          >
            01
          </Text>
        </View>
        <View
          style={[
            styles.roundContainer,
            { flex: 1 },
            props.step >= 1 && { backgroundColor: AppColors.appThemeColor },
          ]}
        >
          <Text
            style={[{ fontFamily: "Poppins_500Medium" }, styles.standardText]}
          >
            Photo Of Your ID Document
          </Text>
        </View>
      </View>

      {/* separator */}
      <View style={styles.separator} />
      {/* separator */}

      {/* step 2 */}
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.roundContainer,
            { width: 40 },
            props.step === 2 && { backgroundColor: AppColors.appThemeColor },
          ]}
        >
          <Text
            style={[{ fontFamily: "Poppins_500Medium" }, styles.standardText]}
          >
            02
          </Text>
        </View>
        <View
          style={[
            styles.roundContainer,
            { flex: 1 },
            props.step === 2 && { backgroundColor: AppColors.appThemeColor },
          ]}
        >
          <Text
            style={[{ fontFamily: "Poppins_500Medium" }, styles.standardText]}
          >
            A Quick Scan Of Your Face
          </Text>
        </View>
      </View>
    </View>
  );
}
