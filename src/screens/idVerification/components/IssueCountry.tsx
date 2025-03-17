import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { s } from "react-native-size-matters";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { AppColors } from "../../../utility/AppColors";
import CountryPicker from 'react-native-country-picker-modal'


export function IssueCountry({
  placeholder,
  text,
  style,
  secureTextEntry,
  onChangeText,
  onBlur,
  onFocus,
  editable,
  height = 50,
  label,
  country,
  setCountry
}: any) {
  useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const [visible, setVisible] = useState(false)

  const onSelect = (country: Country) => {
    setCountry(country)
  }

  const styles = StyleSheet.create({
    inputContainer: {
      color: AppColors.primaryText,
      borderColor: AppColors.appThemeColor,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
      height,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
    },
    input: {
      paddingHorizontal: s(5),
      width: "80%",
    },
  });

  return (
    <View style={{ marginVertical: 30 }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          color: AppColors.blackColor,
          fontSize: 12,
        }}
      >
        Issuing country
      </Text>
      <View style={styles.inputContainer}>
        <Text
          onPress={() => { }}
          style={{
            fontFamily: "Poppins_500Medium",
            color: AppColors.blackColor,
            textAlign: "center",
          }}
        >
          {country ? country.name : "Select Country"}
        </Text>
        <Text
          onPress={() => setVisible(true)}
          style={{
            fontFamily: "Poppins_700Bold",
            color: AppColors.blackColor,
            textAlign: "center",
            marginRight: 20,
          }}
        >
          Change
        </Text>
      </View>

      <CountryPicker withFlag withFilter visible={visible} onSelect={onSelect} withCountryNameButton={false} renderFlagButton={() => null} />
    </View>
  );
}
