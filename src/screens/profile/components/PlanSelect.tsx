import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { s } from "react-native-size-matters";
import Checkbox from "expo-checkbox";
import { AppColors } from "../../../utility/AppColors";

const PlanSelect = ({ options, setSelected }: any) => {
  const [selectedOption, setSelectedOption] = useState(1);
  
  useFonts({ Poppins_500Medium });

  const handleOptionChange = (option: any) => {
    setSelectedOption(option.identifier);
    setSelected(option.identifier);
  };

  const renderOptionContent = (description: string, priceString: string) => {
    const [plan, feature] = description.replace("Get the Premium Features for ", '').split(" ");

    return (
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionPlanText}>{plan}</Text>
        <View>
        <Text style={styles.optionFeatureText}>{capitalizeFirstLetter(feature)}</Text>
        <Text style={styles.optionPriceText}>{priceString}</Text>
        </View>

      </View>
    );
  };

  const renderOptions = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => handleOptionChange(item)}
      style={[
        styles.inputContainer,
        selectedOption === item.identifier && styles.selectedOption,
      ]}
    >
      <View style={styles.optionContainer}>
        {renderOptionContent(item.product.description, item.product.priceString)}
      </View>
      <Checkbox
        style={styles.checkbox}
        value={selectedOption === item.identifier}
        color={
          selectedOption === item.identifier
            ? AppColors.appThemeColor
            : AppColors.greyOutline
        }
      />
    </TouchableOpacity>
  );
  return (
    <View >
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={options}
        renderItem={renderOptions}
        keyExtractor={(item) => item.identifier.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    color: AppColors.primaryText,
    borderColor: AppColors.greyOutline,
    paddingLeft: 10,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.listGray,
    borderWidth: 1,
    padding: 10,
    paddingVertical: 20,
    marginRight: 12,
  },
  selectedOption: {
    borderColor: AppColors.appThemeColor,
  },
  checkbox: {
    borderRadius: 500,
    marginLeft: 94,
    opacity: 0,
  },
  optionContainer: {
    flexDirection:"row",
    alignItems: "center",
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems:"center"
  },
  optionPlanText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginHorizontal: 10,
  },
  optionFeatureText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  optionPriceText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
});

export default PlanSelect;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
