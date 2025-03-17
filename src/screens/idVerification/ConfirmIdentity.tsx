import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Text, Modal, Pressable } from "react-native";
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
import { AppColors } from "../../utility/AppColors";
import CommonButton from "../../components/common/CommonButton";
import VerificationSteps from "./components/VerificationSteps";
import { RouteProp, useRoute } from "@react-navigation/native";
import CrossButton from "../../components/common/CrossButton";
import globalStyles from "../../styles/globalStyles";
import { verifyUserApi } from "../../../api/UserMatches/PostApis/verifyUserApi";
// import { useCurrentStage } from "../../../context/currentStage";
import { useSelector, useDispatch } from "react-redux";
import { FULL_HEIGHT } from "../../utility/Constant";
import { updatemyprofile } from "../../../redux/authSlice";

interface RouteParams {
  stepCompleted: number;
  s: number;
}
const ConfirmIdentity = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { stepCompleted, s, currentFlow } = route.params;
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const currentFlow = useCurrentStage();

  const handlePress = async () => {
    if (stepCompleted === 0) {
      props.navigation.navigate("UploadID");
    } else if (stepCompleted === 1) {
      props.navigation.navigate("ConfirmID");
    } else if (stepCompleted === 2) {
      try {
        setLoading(true);
        const data = await verifyUserApi(
          reduxState.auth.user.image1redux,
          reduxState.auth.user.image2redux,
          reduxState.auth.token
        );
        setLoading(false);
        if (data.verified) {
          dispatch(updatemyprofile(data.user));
          props.navigation.navigate("UnderReview");
        }
        else {
          setOpenModal(true);
        }
      } catch (error) {
        console.error(error);
      }

    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ padding: 15, flex: 1 }}>
        {/* header */}
        <CrossButton
          buttonHandler={() => currentFlow == 1 ? props.navigation.navigate("IDVerification", { currentFlow: 1 }) : props.navigation.navigate("Profile")}
        />
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Confirm your Identity
        </Text>
        <Text
          style={[
            {
              fontFamily: "Poppins_500Medium",
            },
            styles.lightText,
          ]}
        >
          Please follow steps to get verified
        </Text>
        <VerificationSteps step={stepCompleted} />
      </View>
      {/* steps */}
      <View style={{ padding: 15 }}>
        <CommonButton
          disable={loading}
          title={
            stepCompleted === 0
              ? "Upload ID"
              : stepCompleted === 1
                ? "Scan your Face"
                : "Got it"
          }
          pressHandler={handlePress}
        />
      </View>

      <Modal visible={openModal} transparent={true}>
        <View style={styles.overlay}>
          <View
            style={{
              backgroundColor: AppColors.whiteColor,
              borderRadius: 20,
              width: "90%",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 24,
                color: AppColors.blackColor,
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Verification Failed
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: AppColors.secondaryText,
                marginVertical: 10,
                lineHeight: 25,
                textAlign: "center",
              }}
            >
              Your ID and selfie do not match. Please try again
            </Text>
            <View style={{ marginHorizontal: 20 }}>

              <CommonButton
                title={"Try Again"}
                pressHandler={() => {
                  currentFlow == 1 ? props.navigation.navigate("IDVerification", { currentFlow: 1 }) : props.navigation.navigate("Profile");
                  setOpenModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },

  heading: {
    fontSize: 24,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 30,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  overlay: {
    margin: 0,
    backgroundColor: AppColors.transparentBlack,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: FULL_HEIGHT,
  },
});
export default ConfirmIdentity;
