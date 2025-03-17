import React, { useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { AppColors } from "../../../utility/AppColors";
import boostStyles from "@/styles/boostStyles";
import { scaleFontSize } from "@/styles/scaling";

const BoostPlan = ({ options, setSelected }: any) => {
  const [selectedOption, setSelectedOption] = useState(1);
  const animatedValues = useRef(
    options.map(() => new Animated.Value(1))
  ).current;
  useFonts({ Poppins_500Medium });

  const handleOptionChange = (option: any, index: number) => {
    // Animate scaling for all options
    animatedValues.forEach((value, i) => {
      Animated.timing(value, {
        toValue: i === index ? 1.1 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    setSelectedOption(option.identifier);
    setSelected(option);
  };

  const extractNumberFromDescription = (text: string) => {
    const number = text.match(/\d+/);
    return number ? number[0] : null;
  };

  const calculatePerBoostPrice = (price: number, boosts: number) => {
    return (price / boosts).toFixed(2);
  };

  const calculateSavePercentage = (price: number, boosts: number) => {
    let totalPrice=boosts*price;
    let savings=(price/totalPrice)*100;
    return savings;
  };


  const renderPopularBadge = () => (
    <View style={styles.popularBadge}>
      <Text style={styles.popularText}>Most Popular</Text>
    </View>
  );

  const renderOptionContent = (option: any) => {
    const boostCount = extractNumberFromDescription(option.identifier);
    console.log('This is my option',option.product);
    return (
      <View>
        <Text style={styles.boostCountText}>{boostCount}</Text>
        <Text style={styles.boostLabelText}>Boosts</Text>
        <Text style={styles.perBoostPriceText}>
          {option.product.currencyCode} {calculatePerBoostPrice(option.product.price, boostCount)} Each
        </Text>
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>SAVE {calculateSavePercentage(option.product.price, boostCount)}%</Text>
        </View>
      </View>
    );
  };

  const renderOptions = (option: any, index: any) => {
    const animatedStyle = { transform: [{ scale: animatedValues[index] }] };
    const isMostPopular = option.product.description.includes("5"); // Adjust condition based on your data
    const isSelected = selectedOption === option.identifier;

    return (
      <Animated.View
        key={index}
        style={[animatedStyle, styles.animatedContainer]}
      >
        <TouchableOpacity
          onPress={() => handleOptionChange(option, index)}
          style={[
            boostStyles.inputContainer,
            isSelected && boostStyles.selectedOption,
          ]}
        >
          {isMostPopular && renderPopularBadge()}
          {renderOptionContent(option)}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={options}
        horizontal
        renderItem={({ item, index }) => renderOptions(item, index)}
      />
    </View>
  );
};

const styles = {
  flatListContainer: {
    marginVertical: 10,
  },
  animatedContainer: {
    marginHorizontal: 6,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: AppColors.blackColor,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  popularText: {
    color: AppColors.whiteColor,
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaleFontSize(12),
  },
  boostCountText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_800ExtraBold",
    fontSize: scaleFontSize(35),
    textAlign: "center",
  },
  boostLabelText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaleFontSize(15),
    textAlign: "center",
    marginTop: scaleFontSize(-5),
  },
  perBoostPriceText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_500Medium",
    fontSize: scaleFontSize(14),
    textAlign: "center",
    marginTop: 20,
  },
  savingsContainer: {
    backgroundColor: AppColors.appThemeColor,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "center",
  },
  savingsText: {
    color: AppColors.blackColor,
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaleFontSize(14),
    textAlign: "center",
  },
};

export default BoostPlan;
