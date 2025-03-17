import { Text, TouchableOpacity, View } from "@/ui";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { AppColors } from "@/utility/AppColors";
import { StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

export const openTermsPage = async () => {
  await WebBrowser.openBrowserAsync("https://www.getspoused.com/terms");
};

export const openPolicyPage = async () => {
  await WebBrowser.openBrowserAsync("https://www.getspoused.com/privacy");
};

export const TermsConditionsCheckbox = ({ isChecked, onValueChange }: { isChecked: boolean; onValueChange: (value: boolean) => void }) => {
  return (
    <View className="flex-row items-center mb-4 gap-2">
      <Checkbox
        style={{
          borderRadius: 5,
        }}
        value={isChecked}
        onValueChange={onValueChange}
        color={isChecked ? AppColors.appThemeColor : AppColors.blackColor}
      />
      <View className="flex-row gap-1">
        <Text className="text-gray-500 text-sm">I agree to the</Text>
        <TouchableOpacity onPress={openTermsPage}>
          <Text className="text-black text-sm">Terms And Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TermsConditionsFooter = () => {
  return (
    <View className="justify-center items-center w-full">
      <Text className="text-gray-500">By continuing you agree to our</Text>
      <View className="flex-row">
        <Text className="underline" onPress={openTermsPage}>
          TERMS OF SERVICE
        </Text>
        <Text> & </Text>
        <Text onPress={openPolicyPage} className="underline">
          PRIVACY POLICY
        </Text>
      </View>
    </View>
  );
};

export default TermsConditionsFooter;
