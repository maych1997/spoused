import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppColors } from "../../utility/AppColors";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { AntDesign } from "@expo/vector-icons";
const StepProgress = ({ currentStep }: any) => {
  const steps = [
    { id: 1, completed: false },
    { id: 2, completed: false },
    { id: 3, completed: false },
    { id: 4, completed: false },
    { id: 5, completed: false },
  ];
  useFonts({
    Poppins_500Medium,
  });

  return (
      <View style={styles.container}>
        {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <View
                  style={[
                    styles.step,
                    (step.completed && styles.completed) ||
                    (currentStep >= step.id && styles.current) ||
                    styles.incomplete,
                  ]}
              >
                {(step.completed || currentStep > step.id) && (
                    <AntDesign name="check" size={15} color={AppColors.blackColor} />
                )}
                {!step.completed && currentStep === step.id && (
                    <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: 15,
                          color: AppColors.blackColor,
                        }}
                    >
                      {step.id}
                    </Text>
                )}
              </View>
              {index !== steps.length - 1 && (
                  <View
                      style={[
                        styles.line,
                        (currentStep > step.id && styles.completed) ||
                        styles.incomplete,
                      ]}
                  ></View>
              )}
            </React.Fragment>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(223, 223, 223, 1)",
  },
  completed: {
    backgroundColor: AppColors.appThemeColor,
  },
  current: {
    backgroundColor: AppColors.appThemeColor,
  },
  incomplete: {
    backgroundColor: "rgba(223, 223, 223, 1)",
  },
  line: {
    height: 2,
    backgroundColor: "rgba(223, 223, 223, 1)",
    flex: 1,
  },
});

export default StepProgress;
