import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { Entypo } from "@expo/vector-icons";
import { s } from "react-native-size-matters";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";

export function InputField({
  placeholder,
  text,
  style,
  secureTextEntry,
  onChangeText,
  onBlur,
  editable,
  label,
  keyboardType,
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

  const toggleSecureEntry = () => {
    setIsSecureTextEntry(!isSecureTextEntry);
  };

  const styles = StyleSheet.create({
    inputContainer: {
      color: AppColors.primaryText,
      borderColor: isFocused ? AppColors.appThemeColor : AppColors.greyOutline,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
    },
    input: {
      paddingHorizontal: s(5),
      width: "100%",
      justifyContent:'center',
      alignItems:'center',
      display:'flex',
      paddingVertical:10,
      flexDirection:'row',
    },
  });

  return (
    <View style={{ marginVertical: 10 }}>
      <Text
        style={{ fontFamily: "Poppins_500Medium", color: AppColors.blackColor }}
      >
        {label}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style, { fontFamily: "Poppins_500Medium" }]}
          placeholder={placeholder}
          placeholderTextColor={AppColors.greyOutline}
          defaultValue={text}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          secureTextEntry={isSecureTextEntry}
          editable={editable}
          textContentType="oneTimeCode"
          keyboardType={keyboardType || "default"}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={{ width: "10%",right:30 }}
          >
            {!isSecureTextEntry ? (
              <Entypo name="eye" color={AppColors.lightGrey} size={20} />
            ) : (
              <Entypo
                name="eye-with-line"
                color={AppColors.lightGrey}
                size={20}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export function EmailField({
  placeholder,
  text,
  style,
  secureTextEntry,
  onChangeText,
  onBlur,
  editable,
  label,
}: any) {
  useFonts({
    Poppins_500Medium,
  });

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
      borderColor: isFocused ? AppColors.appThemeColor : AppColors.greyOutline,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
    },
    input: {
      paddingHorizontal: s(5),
      width: "100%",
      justifyContent:'center',
      alignItems:'center',
      display:'flex',
      paddingVertical:10,
      flexDirection:'row',
    },
  });

  return (
    <View style={{ marginVertical: 10 }}>
      <Text
        style={{ fontFamily: "Poppins_500Medium", color: AppColors.blackColor }}
      >
        {label}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style, { fontFamily: "Poppins_500Medium" }]}
          placeholder={placeholder}
          placeholderTextColor={AppColors.greyOutline}
          value={text}
          autoCapitalize="none"
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          editable={editable}
          inputMode="email"
          textContentType="oneTimeCode"
        />
      </View>
    </View>
  );
}
