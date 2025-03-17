import { Text, View } from "@/ui";
import { AppColors } from "@/utility/AppColors";
import React from "react";
import { StyleSheet } from "react-native";

export const HeaderTexts = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <View>
      <Text className="text-2xl font-bold">{title}</Text>
      <Text style={styles.subheading}>{subTitle}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  subheading: {
    fontSize: 16,
    color: AppColors.secondaryText,
    marginTop: 8,
  },

});
