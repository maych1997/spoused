import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { FocusAwareStatusBar, IS_IOS, SafeAreaView, colors } from "@/ui";
import { AppColors } from "@/utility/AppColors";

interface ScreenViewProps {
  children?: React.ReactNode;
  style?: object;
  safeAreaViewProps?: object;
}

export const ScreenView: React.FC<ScreenViewProps> = ({
  children,
  style,
  safeAreaViewProps,
}) => {
  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{ flexGrow: 1}}
      scrollEnabled={true}
    >
      <SafeAreaView style={[styles.container, style]} {...safeAreaViewProps}>
        <FocusAwareStatusBar />
        {children}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
    paddingTop: !IS_IOS ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },
});

ScreenView.defaultProps = {
  style: {},
  safeAreaViewProps: {},
};
