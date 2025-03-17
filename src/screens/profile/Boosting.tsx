import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { AppImages } from "../../utility/AppImages";
import { Feather } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import boostStyles from "@/styles/boostStyles";
import { verticalScale } from "react-native-size-matters";
import { scaleFontSize } from "@/styles/scaling";
import { useRevenueCat } from "@/Providers/RevenueCatProvider";
import BoostPlan from "./components/BoostPlan";
import { useSelector, useDispatch } from "react-redux";
import { useInfoModal } from "@/context/ModalContext";
import {boostProfileApi} from "../../../api/ProfileCompletion/PutApis/boostProfileApi";
import {boostNumberApi} from "../../../api/ProfileCompletion/PutApis/boostNumber";
import {useRoute} from "@react-navigation/native";
import ViewProfile from "@/screens/profile/ViewProfile";

const Boosting = (props: any) => {
  const [boostEnd, setBoostEnd] = useState({
    hours: "23",
    minutes: "45",
    seconds: "01",
  });
    const reduxState = useSelector((state) => state);
  const token = useSelector((state:any) => state.auth.token);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false); // Spinner loading state
  const rotateValue = useRef(new Animated.Value(0)).current;

  const { boostPack, purchasePackage } = useRevenueCat();
  const dispatch = useDispatch();
  const { openModal } = useInfoModal();
  const route = useRoute();

  const backHandler = () => {
    if (route.params?.back === 10) {
      props.navigation.navigate("Home");
    } else if (route.params?.back === 11) {
      props.navigation.navigate("Profile");
    } else if (route.params?.back === 12) {
      props.navigation.navigate("ViewProfile");
    } else if(route.params?.back === 13){
      props.navigation.navigate("like");
    }
  };

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

  useEffect(() => {
    console.log("Boosting Screen", route.params?.back);
    if (loading) {
      startRotation();
    } else {
      rotateValue.setValue(0); // Reset rotation when not loading
    }
  }, [loading]);
  const extractNumber = (sentence) => {
    const match = sentence.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const handlePurchase = async (packId: string) => {
    setLoading(true); // Start the spinner
    const selectedPackage = boostPack.find((pkg) => pkg.identifier === packId);
    if (selectedPackage) {
      await purchasePackage(selectedPackage, token)
        .then((a: { state: number; message?: string }) => {
          openModal(
            a.state === 1 ? "Woohoo! " : "Purchase failed!",
            a.message ? a.message : "Your purchase has been processed.",
            "OK",
            a.state === 1 ? "success" : "error"
          );
          if (a.state === 1) {
            // boostProfileApi(reduxState.auth.token); // Call the function only on successful purchase
            boostNumberApi(reduxState.auth.token, extractNumber(selectedPackage.product.title)); // Call the function only on successful purchase
          }
        })
        .catch((e) => {
          openModal(
            "Purchase failed!",
            e.message ? e.message : "Your purchase has failed!",
            "OK",
            "error"
          );
        })
        .finally(() => {
          setLoading(false); // Stop the spinner
        });
    } else {
      setLoading(false); // Stop the spinner if package not found
      Alert.alert("Package not found!");
    }
  };

  // Interpolating rotation value to degrees
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          onPress={backHandler}
          style={styles.closeButton}
        >
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>

        <View style={boostStyles.viewLogo}>
          <Image source={AppImages.LOGO_BLACK_MI} style={boostStyles.logo} />
        </View>

        <View style={styles.centeredContent}>
          <Text style={styles.titleText}>
            Boost Your Profile{"\n"}For More Views
          </Text>
          <Text style={styles.subtitleText}>
            You Deserve Special Attention. Get Seen Before{"\n"}Others For 30 Mins With Spotlight.
          </Text>
        </View>

        {/* Boost Plan Selection */}
        <BoostPlan options={boostPack} setSelected={setSelectedPlan} />
        </ScrollView>

        <TouchableOpacity
          onPress={() => handlePurchase(selectedPlan.identifier)}
          style={[
            styles.purchaseButton,
            (selectedPlan === "") && styles.disabledButton,
          ]}
          disabled={loading || selectedPlan === ""} // Disable button when loading or no plan selected
        >
          {loading ? (
            <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
              <Animated.View
                style={[styles.spinner, { transform: [{ rotate: spin }] }]}
              />
              <Text style={styles.purchaseButtonText}>Purchasing ...</Text>
            </View>
          ) : (
            <Text style={[styles.purchaseButtonText,(selectedPlan==="")&&styles.disText]}>
              {selectedPlan
                ? capitalizeFirstLetterOfEachWord(
                    selectedPlan.product.description.replace("for your profile", "") +
                      " For " + selectedPlan.product.priceString
                  )
                : "Select Your Boosts Count"}
            </Text>
          )}
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  scrollView: {
    padding: 15,
  },
  closeButton: {
    backgroundColor: AppColors.whiteColor,
    height: 30,
    width: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",

  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  titleText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: AppColors.blackColor,
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: "Poppins_500Medium",
    fontSize: scaleFontSize(14),
    color: AppColors.secondaryText,
    textAlign: "center",
    lineHeight: verticalScale(15),
  },
  purchaseButton: {
    backgroundColor: AppColors.appThemeColor,
    padding: 15,
    borderRadius: 220,
    justifyContent: "center",
    alignItems: "center",
    margin:15
  },
  disabledButton: {
    backgroundColor: AppColors.gray_8A8A8A,
  },
  purchaseButtonText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: AppColors.blackColor,
  },
  spinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: AppColors.blackColor,
    borderTopColor: "transparent",
    borderRadius: 12,
  },
  disText: {
    color: AppColors.whiteColor,
  },
});

export default Boosting;

function capitalizeFirstLetterOfEachWord(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)?.toLowerCase())
    .join(" ");
}
