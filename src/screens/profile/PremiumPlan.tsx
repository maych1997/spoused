import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { AppImages } from "../../utility/AppImages";
import { Ionicons } from "@expo/vector-icons";
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
import PlanSelect from "./components/PlanSelect";
import globalStyles from "../../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { useRevenueCat } from "@/Providers/RevenueCatProvider";
import { useInfoModal } from "@/context/ModalContext";
import { useRoute } from "@react-navigation/native";
import Purchases from "react-native-purchases";

const PremiumPlan = (props: any) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const [loading, setLoading] = useState(false); // Spinner loading state
  const rotateValue = useRef(new Animated.Value(0)).current;

  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const premiumFeatures = [
    { text: "Unlimited Swipes", image: AppImages.VECTOR },
    { text: "Travel Mode", image: AppImages.PERSON_LOUGAGE },
    { text: "Filter By Preferences", image: AppImages.THREE_LINE_THREE_DOTS },
    { text: "Rematch", image: AppImages.HEART_PARTNER_HANDSHAKE },
    { text: "Rewind", image: AppImages.ANGLE_DOUBLE_SMALL_RIGHT },
    { text: "2 Boosts", image: AppImages.ROCKET_LAUNCHE },
    { text: "Message Before Matching", image: AppImages.CHAT_WITH_THREE_LINE },
    { text: "Video Call", image: AppImages.videCall3 },
    { text: "Audio Call", image: AppImages.AudioCall },
  ];
  const route = useRoute();

  const [selectedPlan, setSelectedPlan] = useState("");

  const { packages, purchasePackage } = useRevenueCat();
  const { openModal } = useInfoModal();

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
    console.log("Premium Plan Screen");
    console.log(route.params?.back);
    if (loading) {
      startRotation();
    } else {
      rotateValue.setValue(0); // Reset rotation when not loading
    }
  }, [loading]);

  const handlePurchase = async (packId: string) => {
    setLoading(true); // Start the spinner
    const selectedPackage = packages.find((pkg) => pkg.identifier === packId);
    if (selectedPackage) {
      await purchasePackage(selectedPackage, token)
        .then((a: { state: number; message?: string }) => {
          openModal(
            a.state === 1 ? "Purchase successful!" : "Purchase failed!",
            a.message ? a.message : "Your purchase has been processed.",
            "OK",
            a.state === 1 ? "success" : "error"
          );
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
      alert("Package not found!");
    }
  };

  // Interpolating rotation value to degrees
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const backHandler = () => {
    // if (route.params?.back === 15) {
    //   props.navigation.navigate("Profile");
    // } else if (route.params?.back === 16) {
    //   props.navigation.navigate("Home");
    // }
    props.navigation.goBack();
  };
  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ marginHorizontal: 10, flexGrow: 1 }}>
        <View style={{padding:15}}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Ionicons
              name="chevron-back"
              size={24}
              color="{AppColors.blackColor}"
              onPress={backHandler}
            />
            <Text style={styles.headerText}>Premium Plan</Text>
          </View>
          {/*<MaterialCommunityIcons name="help-circle" size={24} color="black" />*/}
        </View>

        <Text style={styles.premiumFeaturesTitle}>
          Our Premium Features Include:
        </Text>

        {premiumFeatures.map((item, index) => (
          <View style={styles.rowContainer} key={index}>
            <Image source={item.image} />
            <Text style={styles.premiumFeatureText}>
              {item.text}
              {item.text === "Travel Mode" && (
                <Text style={styles.passportText}> (Passport Location)</Text>
              )}
            </Text>
          </View>
        ))}

          <PlanSelect options={packages} setSelected={setSelectedPlan} />
          <TouchableOpacity
            onPress={() => handlePurchase(selectedPlan)}
            style={[
              styles.subscribeButton,
              selectedPlan === "" && styles.disabledButton,
            ]}
            disabled={loading || selectedPlan === ""} // Disable button when loading
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
                <Text style={styles.subscribeText}>Purchasing ...</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.subscribeText,
                  selectedPlan === "" && styles.disText,
                ]}
              >
                {selectedPlan === "" ? "First select a plan" : "Subscribe"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    marginHorizontal: 10,
    color: AppColors.blackColor,
  },
  premiumFeaturesTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: AppColors.blackColor,
    marginVertical: 20,
  },
  premiumFeatureText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: AppColors.blackColor,
    marginLeft: 10,
  },
  passportText: {
    color: AppColors.appThemeColor,
    fontFamily: "Poppins_400Regular",
  },
  subscribeButton: {
    backgroundColor: AppColors.appThemeColor,
    borderRadius: 220,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical:15
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

export default PremiumPlan;
