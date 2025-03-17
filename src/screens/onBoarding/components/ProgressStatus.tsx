import React from "react";
import { View } from "@/ui";

type ProgressStatusProps = {
  currentStep: number;
  totalSteps?: number; // Allow passing total steps as a prop for flexibility
};

const DEFAULT_TOTAL_STEPS = 16;

export const ProgressStatus = ({ currentStep, totalSteps = DEFAULT_TOTAL_STEPS }: ProgressStatusProps) => {
  const renderStepIndicator = (step: number) => {
    const isActive = step <= currentStep;
    return <View key={step} className={`flex-1 m-0.5 h-1 rounded-xl ${isActive ? "bg-main" : "bg-gray-400"}`} />;
  };

  return (
    <View className="flex-row justify-center items-center my-5">{[...Array(totalSteps)].map((_, index) => renderStepIndicator(index + 1))}</View>
  );
};
