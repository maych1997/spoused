import { useEffect, useState } from "react";
import { Linking, Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import HeightInput from "../onBoarding/components/HeightInput";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { updateHeightApi } from "../../../api/ProfileCompletion/PutApis/updateProfileApi";
import { updatemyprofile } from "../../../redux/authSlice";
import RangeSlider from "react-native-range-slider-expo/src/RangeSlider";
import { FULL_HEIGHT } from "../../utility/Constant";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import {useInfoModal} from "@/context/ModalContext";
interface RouteParams {
  back: number;
}
const Height = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back, setHeightFilter, heightFilter } = route.params;
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  // const [hheight, setHHeight] = useState(heightFilter);
  const [hheight, setHHeight] = useState(heightFilter || { cm: 0, ft: 0 });
  const [minCmHeight, setMinCmHeight] = useState(heightFilter?.fromCm);
  const [maxCmHeight, setMaxCmHeight] = useState(heightFilter?.toCm);
  const [minFtHeight, setMinFtHeight] = useState(heightFilter?.fromFt);
  const [maxFtHeight, setMaxFtHeight] = useState(heightFilter?.toFt);
  const [openModal, setOpenModal] = useState(false);
  const { openModal: triggerInfoModal } = useInfoModal();

  useEffect(() => {
    if (back == 0 && reduxState?.auth?.user?.myprofile?.height) {
      setHHeight(reduxState?.auth?.user?.myprofile?.height);
    }
  }, []);

  const updateDetails = async () => {
    try {
      // convert hheight.cm to number
      // const hheightCm = parseFloat(hheight.cm);
      const hheightCm = parseFloat(hheight?.cm || 0);  // Default to 0 if hheight or hheight.cm is undefined
      const response = await updateHeightApi(
        { cm: hheightCm, ft: hheight.ft },
        reduxState.auth.token // token from redux state
      );

      if (!response.success) {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
        return
      }

      if (response.success) {
        dispatch(updatemyprofile(response.user))
      }
    } catch (error) {
      console.error("Error fetching user matches:", error);
    }
  };

  const backHandler = () => {
    if (back === 0) {
      props.navigation.navigate("ViewProfile");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      props.navigation.navigate("Tab", { screen: "Filters" });
    }
  };

  const handleDone = () => {
    if (back === 0) {
      console.log("this is the one");
      updateDetails();
      props.navigation.navigate("ViewProfile");
      triggerInfoModal("Changes Saved!", "Settings saved successfully", "Okay", "success");
    } else if (back === 1) {
      props.navigation.navigate("Settings");
    } else if (back === 2) {
      if (reduxState?.auth?.user?.myprofile?.proAccount) {
        setHeightFilter({
          fromCm: minCmHeight,
          toCm: maxCmHeight,
          fromFt: minFtHeight,
          toFt: maxFtHeight,
        });
        props.navigation.navigate("Tab", { screen: "Filters" });
        triggerInfoModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
      } else {
        props.navigation.navigate("PremiumPlan");
        // setOpenModal(true);
      }
    }
  }

  const handleMinVal = (value) => {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    setMinCmHeight(value);
    setMinFtHeight(`${feet}'${inches}"`);
    // setHeightFilter({ cm: value, ft: `${feet}'${inches}"` });
  }

  const handleMaxVal = (value) => {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    setMaxCmHeight(value);
    setMaxFtHeight(`${feet}'${inches}"`);
    // setHeightFilter({ cm: value, ft: `${feet}'${inches}"` });
  }



  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ padding: 15 }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
        <View style={styles.contentWrapper}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              color: AppColors.blackColor,
            }}
          >
            Height
          </Text>
        </View>

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
        }}>
          <Text
            style={[
              styles.standardText,
              { fontFamily: "Poppins_400Regular" },
            ]}
          >
            {
              back == 2 ?
                minCmHeight === 122 && maxCmHeight === 213 ?
                  "No Preference"
                  :
                  minCmHeight + "cm (" + minFtHeight + ") - " + maxCmHeight + "cm (" + maxFtHeight + ")"
                :
                ""
            }
          </Text>
        </View>


        {
          back == 2 ?
            <RangeSlider
              toKnobColor={AppColors.appThemeColor}
              fromKnobColor={AppColors.appThemeColor}
              min={122}
              max={213}
              fromValueOnChange={(value) => handleMinVal(value)}
              toValueOnChange={(value) => handleMaxVal(value)}
              initialFromValue={heightFilter?.fromCm}
              initialToValue={heightFilter?.toCm}
              barHeight={4}
              showValueLabels={true}
              showRangeLabels={false}
            />

            :
            <HeightInput setHeightFilter={setHHeight} heightFilter={hheight || { cm: 0, ft: 0 }} />
        }
      </View>
      <View style={{ padding: 15 }}>
        <CommonButton title={"Done"} pressHandler={handleDone} />
      </View>

      <SubscriptionModal openModal={openModal} setOpenModal={setOpenModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    marginTop: 60,
  },
  standardText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  overlay: {
    margin: 0,
    backgroundColor: AppColors.transparentBlack,
    width: "100%",
    height: FULL_HEIGHT,
  },
});

export default Height;
