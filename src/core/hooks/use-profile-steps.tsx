// hooks/useProfileSteps.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfession, updateEthnicGroup, updateEducation } from "../../../redux/authSlice";

export const useProfileSteps = (showToast, navigation) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [push, setPush] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    if (push) {
      handleOnBoardSubmit();
      navigation.navigate("Verification", { currentFlow: 1 });
      setPush(false);
    }
  }, [push]);

  const handleNextStep = (stepData) => {
    if (currentStep === 1 && !stepData.prof) {
      showToast("Profession Required", "Please select your profession.");
      return;
    }
    dispatch(updateProfession(stepData.prof));
    setCurrentStep(currentStep + 1); // Move to next step
  };

  const handleOnBoardSubmit = async () => {
    try {
      // API call logic here...
    } catch (error) {
      console.error("Error during profile completion: ", error);
    }
  };

  return {
    currentStep,
    handleNextStep,
  };
};
