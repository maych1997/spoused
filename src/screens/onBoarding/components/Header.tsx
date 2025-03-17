import React from "react";
import { Text, TouchableOpacity, View, colors } from "@/ui";
import { ArrowLeft } from "@/ui/icons";

type OnboardingHeaderProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handlePreviousScreen: () => void;
  totalSteps?: number; // Allow total steps to be passed as a prop for flexibility
  title?: string; // Allow customizable title
};

const DEFAULT_TITLE = "Complete Your Profile";
const TOTAL_STEPS = 16; // Move total steps to a constant

export const OnboardingHeader = ({
  currentStep,
  setCurrentStep,
  handlePreviousScreen,
  totalSteps = TOTAL_STEPS,
  title = DEFAULT_TITLE,
}: OnboardingHeaderProps) => {
  const handleStepChange = () => {
    if (currentStep === 1) {
      handlePreviousScreen();
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgress = () => ((currentStep / totalSteps) * 100).toFixed(0);

  return (
    <View className="flex-row justify-between items-center">
      {currentStep >= 1 && (
        <TouchableOpacity onPress={handleStepChange}>
          <ArrowLeft color={colors.black} width={20} height={20} />
        </TouchableOpacity>
      )}
      <Text className="text-base font-semibold text-black">{title}</Text>
      <Text className="text-lg font-semibold text-main">{renderProgress()}%</Text>
    </View>
  );
};
