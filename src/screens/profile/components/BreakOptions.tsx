import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { TextInput } from "react-native";
import { s } from "react-native-size-matters";
import { CheckBox } from "@rneui/themed";
import Checkbox from "expo-checkbox";
import { AppColors } from "../../../utility/AppColors";
const BreakOptions = ({ options, setSelected }: any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  useFonts({
    Poppins_500Medium,
  });

  const styles = StyleSheet.create({
    inputContainer: {
      color: AppColors.primaryText,
      paddingRight: 20,
      paddingLeft: 10,
      borderRadius: 200,
      height: 55,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
      padding: 10,
    },
    input: {
      paddingHorizontal: s(5),
      width: "80%",
    },
    checkbox: {
      borderRadius: 500,
    },
    selectedOption: {
      backgroundColor: AppColors.appThemeColor,
    },
  });

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
    setSelected(option);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {options.map((option: any, index: number) => (
        <TouchableOpacity
          onPress={() => handleOptionChange(option)}
          key={index}
          style={[
            styles.inputContainer,
            selectedOption === option && styles.selectedOption,
          ]}
        >
          <Text
            style={{
              color: AppColors.blackColor,
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              marginHorizontal: 10,
            }}
          >
            {option}
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={selectedOption === option}
            // onValueChange={() => handleOptionChange(option)}
            color={
              selectedOption === option
                ? AppColors.blackColor
                : AppColors.greyOutline
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BreakOptions;
