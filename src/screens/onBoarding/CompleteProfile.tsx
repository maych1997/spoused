
import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView ,Alert} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { education, ethnicOrigin, ethnicity, maritalStatus, profession, religion, star } from "../../data/ProfileQuestions";
import { ProgressStatus } from "./components/ProgressStatus";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { onBoardingApi } from "../../../api/ProfileCompletion/PostApis/onBoardingApi";
import { OnboardingHeader } from "./components/Header";
import navigation from "@/core/navigation";
import { ScreenView } from "@/components/screen";
import { Button, IS_IOS } from "@/ui";
import DynamicQuestion from "./components/DynamicQuestion";
import { updateBiographyApi, updateChildrenApi, updateDatingPreferenceApi, updateDrinkingApi, updateEducationApi, updateEthnicityApi, updateEthnicOriginApi, updateHeightApi, updateInterestsApi, updateMaritalApi, updatePersonalityApi, updateProfessionApi, updateReligionApi, updateSmokerApi, updateStarApi } from "api/ProfileCompletion/PutApis/updateProfileApi";
import { updateUser } from "redux/authSlice";

const CompleteProfile = () => {
  const [push, setPush] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [emptySearch,setEmptySearch]=useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const formFields = [
    { api: updateProfessionApi, step: 1, mode: "question", name: 'profession', label: "What Is Your Profession?", options: profession},
    { api: updateProfessionApi, step: 1, mode: "question", name: 'profession', label: "What Is Your Profession?", options: profession, subTitle:"Please select your profession"},
    { api: updateEthnicityApi, step: 2, mode: "question", name: 'ethnicGroup', label: "Which Of These Best Describes You?", options: ethnicity, subTitle:"Please select your ethnicity"},
    { api: updateEducationApi, step: 3, mode: "question", name: 'education', label: "How Much Education Do You Have?", options: education,subTitle: "Please select your highest level of education"},
    { api: updateEthnicOriginApi, step: 4, mode: "question", name: 'location', label: "Where Are You From?", options: ethnicOrigin, subTitle:"Please select your home country"},
    { api: updateHeightApi, step: 5, mode: "height", name: 'height', label: "What Is Your Height?"},
    { api: updateMaritalApi, step: 6, mode: "question", name: 'maritalStatus', label: "What Is Your Marital Status?", options: maritalStatus, subTitle:"Please select your marital status"},
    { api: updateDatingPreferenceApi, step: 7, mode: "interestedIn", name: 'datingPreferences', label: "What Is Your Preferred Gender To Date?",subTitle: "Please select a gender"},
    { api: updateSmokerApi, step: 8, mode: "question", name: 'smoking', label: "Do You Smoke?", options: ["Yes", "No"],subTitle: "Please select from the option below"},
    { api: updateChildrenApi, step: 9, mode: "question", name: 'children', label: "Do You Want To Have Children?", options: ["Yes", "No", "Maybe"],subTitle: "Please select one of the following options"},
    { api: updateStarApi, step: 10, mode: "question", name: 'lookingFor', label: "What Are You Looking For?", options: ["Marriage", "Long term relationship", "Others"],subTitle: "Please select the kind of match you are looking for"},
    { api: updateReligionApi, step: 11, mode: "question", name: 'religion', label: "What Is Your Religion?", options: religion,subTitle: "Please select the religion that you identify with."},
    { api: updateDrinkingApi, step: 12, mode: "question", name: 'drink', label: "Do You Drink?", options: ["Yes", "No"],subTitle: "Please select from the option below"},
    { api: updateStarApi, step: 13, mode: "question", name: 'starSign', label: "What’s Your Zodiac Sign?", options: star,subTitle: "Please select your horoscope below"},
    { api: updatePersonalityApi, step: 14, mode: "personality", name: 'personalityTraits', label: "Select Your Personality Traits" },
 
    { api: updateInterestsApi, step: 15, mode: "interest", name: 'interests', label: "Select Your Interests" },
    { api: updateBiographyApi, step: 16, mode: "biography", name: 'biography', label: "Add Biography"},
  ];
  useEffect(() => {
    if (push) {
      handleOnBoardSubmit();
      navigation.navigate("Verification", { currentFlow: 1 });
      setPush(false);
    }
  }, [push]);
  const handleOnBoardSubmit = async () => {
    try {
      const data = await onBoardingApi(
        user.profession,
        user.ethnicGroup,
        user.education,
        user.location,
        user.maritalStatus,
        user.height,
        user.datingPreferences,
        user.smoking,
        user.children,
        user.lookingFor,
        user.religion,
        user.drink,
        user.starSign,
        user.interests,
        user.personalityTraits,
        user.biography,
        token
      );
    } catch (error) {
      console.error("Error occurred during onboarding: ", error);
    }
  };

  useEffect(() => {
    const name = formFields[currentStep].name;
    if(currentStep){
      setSelected(user[name]);
    }
    if(emptySearch){
      setEmptySearch(false);
    }
  }, [currentStep,emptySearch]);

  const handleNextStep = async () => {
    let tempUser = { ...user };
    tempUser[formFields[currentStep].name] = selected;
    try {
      console.log(selected)
      const response = await formFields[currentStep].api(
        selected,
        token// token from redux state
      );

      if (!response.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (response.success) {
        dispatch(updateUser(tempUser));
        if (currentStep < 16) {
          setLoading(true)
          setCurrentStep((prev) => prev + 1);
          setEmptySearch(true);
        } else {
          setPush(true)
        }
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching user matches:", error);
    }

  };
  console.log(selected);
  console.log(currentStep);
  return (
    <View style={styles.container}>
        <ScreenView>
          <OnboardingHeader
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            handlePreviousScreen={() => navigation.navigate("Registration")}
          />
          <ProgressStatus currentStep={currentStep} />
          <DynamicQuestion
            addSearch={true}
            emptySearch={emptySearch}
            mode={formFields[currentStep].mode}
            options={formFields[currentStep].options}
            sectionTitle={formFields[currentStep].label}
            name={formFields[currentStep].name}
            selected={selected}
            setSelected={setSelected}
            subTitle={formFields[currentStep]?.subTitle||formFields[currentStep].label}
          />
        </ScreenView>
        <View style={styles.buttonContainer}>
        <Button
          title={"Next"}
          onPress={handleNextStep}
          disabled={!selected || (currentStep === 14 && selected.length < 5)}
          loading={loading}
          disText={"Select an option to continue!"}
          loadingText=" Loading ... "
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  buttonContainer:{    
    width:'100%',
    padding:10,
    position:'absolute',
    bottom:0,
  },
  nextButton: {
    width: 300,
  },
});

export default CompleteProfile;
