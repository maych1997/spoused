import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { AppColors } from "../../../utility/AppColors";
import Checkbox from "expo-checkbox";

import { s } from "react-native-size-matters";

export default function InterestedIn(props: any) {
  const options = ['Male', 'Female', 'Non-Binary'];
  // const [selectedOpt,setSelectedOpt] = useState(props.selected?props.selected:[])
  const [selectedOpt, setSelectedOpt] = useState(Array.isArray(props.selected) ? props.selected : []);
  const styles = StyleSheet.create({
    inputContainer: {
      color: AppColors.primaryText,
      borderColor: AppColors.greyOutline,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
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
      borderColor: AppColors.appThemeColor,
    },
    container: {
      flex: 1,
      backgroundColor: AppColors.whiteColor,
    },
    subheading: {
      fontSize: 16,
      color: AppColors.secondaryText,
      marginTop: 8,
    },
  });

  useEffect(() => {
    if(props.selected)
    // setSelectedOpt(props?props.selected:[])
    setSelectedOpt(Array.isArray(props.selected) ? props.selected : []);
  },[props.selected])
  const handleOptionChange = (option) => {
          setSelectedOpt((prevSelected) => {
        if (prevSelected.includes(option)) {
          // If the option is already selected, remove it
          props.setSelected(prevSelected.filter((item) => item !== option))
          return prevSelected.filter((item) => item !== option);
        } else {
          // If the option is not selected, add it
          props.setSelected([...prevSelected, option])
          return [...prevSelected, option];
        }
          });
  }

  // useEffect(() => {
  //   if (props.back === 2 && filteredOptions[0] !== "Any") {
  //     filteredOptions.unshift("Any");
  //   }
  // }, []);

  return (
    <View style={styles.contentWrapper}>
      <Text
        style={{
          fontFamily: "Poppins_700Bold",
          fontSize: 24,
          color: AppColors.blackColor,
        }}
      >
        {props.heading}
      </Text>
      <Text
        style={styles.subheading}
      >
        {props.subheading}
      </Text>
      <FlatList
        data={options}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleOptionChange(item)}
            style={[
              styles.inputContainer,
              selectedOpt?.includes(item) && styles.selectedOption,
            ]}
          >
            <Text>{item}</Text>
            <Checkbox
              style={styles.checkbox}
              value={selectedOpt?.includes(item)}
              onValueChange={() => handleOptionChange(item)}
              color={
                selectedOpt?.includes(item)
                  ? AppColors.appThemeColor
                  : AppColors.greyOutline
              }
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

