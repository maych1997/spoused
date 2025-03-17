import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  GestureResponderEvent,
} from "react-native";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppColors } from "@/utility/AppColors";
import { horizontalScale, verticalScale } from "@/styles/scaling";

// Define ButtonProps interface
interface ButtonProps {
  title: string;
  loadingText: string;
  disText: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loadingText = "Loading ...",
  disText="Select an Option First",
  disabled = false,
  loading = false,
  onPress,
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  // Rotation animation
  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Bounce animation on press
  const handlePressIn = () => {
    Animated.spring(bounceValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(bounceValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      if (!loading && !disabled) onPress({} as GestureResponderEvent); // Trigger onPress if button is not disabled or loading
    });
  };

  useEffect(() => {
    if (loading) {
      startRotation();
    } else {
      rotateValue.setValue(0); // Reset rotation when not loading
    }
  }, [loading]);

  // Interpolating rotation value to degrees
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ scale: bounceValue }]}}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.subscribeButton,
          disabled && styles.disabledButton,
        ]}
        disabled={loading || disabled} // Disable button when loading
      >
        {loading ? (
          <View
            style={{
              flexDirection: "row",
              columnGap: 5,
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[styles.spinner, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.subscribeText}>{loadingText}</Text>
          </View>
        ) : (
          <Text style={[styles.subscribeText, disabled && styles.disText]}>
            {disabled ? disText : title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subscribeButton: {
    backgroundColor: AppColors.appThemeColor,
    borderRadius: 220,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginHorizontal: horizontalScale(20),
  },
  disabledButton: {
    backgroundColor: AppColors.gray_8A8A8A,
  },
  subscribeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: AppColors.blackColor,
  },
  disText: {
    color: AppColors.whiteColor,
  },
  spinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: AppColors.blackColor,
    borderTopColor: "transparent",
    borderRadius: 12,
  },
});
