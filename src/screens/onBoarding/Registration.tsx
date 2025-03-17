import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
} from "react-native";
import StepProgress from "../../components/common/StepProgress";
import React, { useEffect, useState, useRef } from "react";
import { AppColors } from "../../utility/AppColors";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { InputField } from "../../components/common/InputField";
import CommonButton, { DateButton } from "../../components/common/CommonButton";
import PhoneNumberInput from "./components/PhoneNumberInput";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAge,
  updateGender,
  updatePhone,
} from "../../../redux/authSlice";
import { updateFullName } from "../../../redux/authSlice";
import { updateBirthday } from "../../../redux/authSlice";
import { updateUser } from "../../../redux/authSlice";
import { generalInfoApi } from "../../../api/ProfileCompletion/PostApis/generalInfoApi";
import RNDateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from "react-native-gesture-handler";
import { scaleFontSize } from "@/styles/scaling";
import {useInfoModal} from "@/context/ModalContext";
import AddPhotos from "./AddPhotos";


const Registration = (props: any) => {
  // fonts
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const reduxState = useSelector((state: any) => state);
  const [currentStep, setCurrentStep] = useState(1);
  const [disableButton, setDisableButton] = useState(true);
  const [fullName, setFullName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("+65");
  const [date, setDate] = useState(new Date());
  const [birthday, setBirthday] = useState("");
  const { openModal } = useInfoModal();
  const childRef = useRef();

  const stepHandler = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      props.navigation.navigate("VerificationCode");
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentStep === 1) {
      if (fullName.length === 0) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
    if (currentStep === 3) {
      setDisableButton(false);
    }
    if (currentStep === 4) {
      if (selectedGender.length === 0) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
  }, [fullName, currentStep, disableButton, selectedGender]);


  const showToast = (title: string, message: string) => {

    Toast.show({
      type: 'error',
      position: 'top',
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      display: 'spinner',
      maximumDate: new Date(),
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onAppleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      const newFullName = fullName; // Replace this with the new full name
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(newFullName) || newFullName.length < 2) {
        openModal("Oops!","Please enter a valid name ", "Try Again", "error");

        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      childRef.current?.handleNextPress();
    } else if (currentStep === 3) {
      if (getAge(date) < 18) {
        openModal("Age Requirement", "You must be 18 years or older to use the app", "Try Again", "date");

        return;
      }

      setBirthday(date.toISOString().split('T')[0]);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }else if(currentStep===5){
            // dispatch(updatePhone(phone));
            if (code === "") {
              showToast("Error", "Please select a country code");
              return;
            }
      
            if (phone === "") {
              // showToast("Error", "Please enter your phone number");
              openModal("Oops!","Please enter your phone number", "Try Again", "error");
              return;
            }
      
            if (phone.length < 7 || phone.length > 11) {
              openModal("Oops!","Unable to process your request. Please try again later or contact support if the issue persists." , "Try Again", "error");
      
              return;
            }
      
            handleResendCode();
      
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await generalInfoApi(
          fullName,
          birthday,
          selectedGender,
          code,
          phone,
          reduxState.auth.token
      );

      if(res.success){
        props.navigation.navigate("CompleteProfile");
      }
    } catch (error) {
      console.error("Error occurred during login: ", error);
    }
  };


  return (
    <ScrollView bounces={false} contentContainerStyle={{flexGrow:1}} scrollEnabled={true}>
      <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
        {/* header */}
        <View style={styles.headerContainer}>
          {
              currentStep > 1 && (
                  <Ionicons
                      name="chevron-back"
                      size={24}
                      color={AppColors.blackColor}
                      onPress={stepHandler}
                  />
              )
          }
          <Text
              style={{
                fontSize: scaleFontSize(14),
                marginHorizontal: 10,
                fontFamily: "Poppins_600SemiBold"
              }}
          >
            Tell us a bit about yourself
          </Text>
        </View>
        <StepProgress currentStep={currentStep} />
        {/* full name */}
        {currentStep === 1 && (
            <View style={styles.contentWrapper}>
              <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    color: AppColors.blackColor,
                  }}
              >
                What Is Your Name?
              </Text>
              <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: AppColors.secondaryText,
                    marginVertical: 10,
                  }}
              >
                Please enter your full name as it appears on your national ID
              </Text>
              <InputField
                  placeholder="Write here"
                  text={fullName}
                  onChangeText={setFullName}
              />
            </View>
        )}
        {currentStep===2 && (
          <AddPhotos ref={childRef} setCurrentStep={setCurrentStep}></AddPhotos>
        )}
        {/* birthday */}
        {currentStep === 3 && (
            <View style={styles.contentWrapper}>
              <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: scaleFontSize(24),
                    color: AppColors.blackColor,
                  }}
              >
                When is Your Birthday
              </Text>
              <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: AppColors.secondaryText,
                    marginVertical: 10,
                  }}
              >
                Please note that the minimum age to use Spoused is 18
              </Text>
              <View style={{ flexDirection: "row" }}></View>
              <View style={{alignSelf: "center" }}>

                {Platform.OS === "ios" ? (
                        <RNDateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={onAppleChange}
                            maximumDate={new Date()}
                        />
                    ) :
                    <DateButton
                        title={"Select Date"}
                        pressHandler={showDatepicker}
                    />
                }
                <Text
                    style={{
                      marginTop: 40,
                      fontWeight: "bold",
                      alignSelf: "center",
                      fontSize: 13,
                      color: "lightgrey",
                    }}
                >
                  You're
                </Text>
                <Text
                    style={{ marginTop: 10, alignSelf: "center" }}
                >
                  {getAge(date)}{" "}
                  Years old
                </Text>
              </View>
            </View>
        )}

        {/* gender */}
        {currentStep === 4 && (
            <View style={styles.contentWrapper}>
              <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    color: AppColors.blackColor,
                  }}
              >
                What Is Your Gender?
              </Text>
              <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: AppColors.secondaryText,
                    marginVertical: 10,
                  }}
              >
                Please Select Your Gender
              </Text>
              <OptionSelect
                  selected={selectedGender}
                  filteredOptions={["Male", "Female", "Non-Binary"]}
                  setSelected={setSelectedGender}
              />
            </View>
        )}

        {/* phone number */}
        {currentStep === 5 && (
            <ScrollView style={styles.contentWrapper}>
              <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    color: AppColors.blackColor,
                  }}
              >
                What Is Your Phone Number?
              </Text>
              <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: AppColors.secondaryText,
                    marginVertical: 10,
                  }}
              >
                Please Enter Your Phone Number
              </Text>
              <PhoneNumberInput onChangeText={setPhone} text={phone} code={code} setCode={setCode} />
            </ScrollView>
        )}

        <View style={styles.buttonContainer}>
          <CommonButton
              title={"Next"}
              pressHandler={handleNextStep}
              disable={disableButton}
          />
        </View>
      </SafeAreaView>
      </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
    paddingTop: 15,
    // justifyContent:'space-between'
  },
  headerContainer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  contentWrapper: {
    padding: 15,
    marginTop: 30,
  },
  buttonContainer: {
    width: "100%",
    padding: 15,
    flex:1,
    justifyContent:'flex-end'
  },
  blurPhotoContainer: {
    width: "100%",
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});

export default Registration;
