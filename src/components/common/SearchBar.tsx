import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { AppColors } from "../../utility/AppColors";
import { s } from "react-native-size-matters";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";

export function SearchBar({
  placeholder,
  text,
  style,
  secureTextEntry,
  onChangeText,
  onBlur,
  editable,
  value,
  height = 50,
}: any) {
  useFonts({
    Poppins_500Medium,
  });

  const [isSecureTextEntry, setIsSecureTextEntry] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };
  const styles = StyleSheet.create({
    inputContainer: {
      color: AppColors.primaryText,
      borderColor: isFocused ? AppColors.appThemeColor : AppColors.greyFill,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
      height,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
    },
    input: {
      paddingHorizontal: s(5),
      width: "80%",
    },
  });
  return (
    <View style={styles.inputContainer}>
      <Feather name="search" size={24} color={AppColors.secondaryText} />
      <TextInput
        style={[styles.input, style, { fontFamily: "Poppins_500Medium" }]}
        placeholder={placeholder}
        placeholderTextColor={AppColors.greyOutline}
        defaultValue={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        secureTextEntry={isSecureTextEntry}
        editable={editable}
      />
    </View>
  );
}
