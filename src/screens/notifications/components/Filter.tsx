import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { AppColors } from "../../../utility/AppColors";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";

const Filter = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: props.isWhite ? "white" : "rgba(245, 245, 245, 1)",
      padding: 20,
      borderRadius: 10,
      paddingLeft: 20,
      flexDirection: "row",
      marginVertical: 10,
    },
    title: {
      color: AppColors.blackColor,
      fontSize: 14,
      marginBottom: 10,
    },
    description: { color: AppColors.secondaryText, fontSize: 12 },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={props.pressHandler}>
      <View>
        <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
          {props.title}
        </Text>
        {props.incomplete ? (
          (
            <Text
              style={[
                styles.description,
                {
                  fontFamily: "Poppins_600SemiBold",
                  color: AppColors.appThemeColor,
                },
              ]}
            >
              Complete Your Profile
            </Text>
          )
        ) : (
          <Text
            style={[styles.description, { fontFamily: "Poppins_500Medium" }]}
          >
            {props.content}
          </Text>
        )}
      </View>
      <FontAwesome5 name="caret-right" size={34} color="black" />
    </TouchableOpacity>
  );
};

export default Filter;
