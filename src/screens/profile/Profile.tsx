import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
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
import ProfileHeader from "./components/ProfileHeader";
import PremiumOverview from "./components/PremiumOverview";
import PlanOverview from "./components/PlanOverview";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import CommonButton from "../../components/common/CommonButton";
import { FULL_HEIGHT } from "../../utility/Constant";
import { AppImages } from "../../utility/AppImages";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { updatemyprofile } from "../../../redux/authSlice";

const Profile = (props: any) => {
  const [profileData, setProfileData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setProfileData(reduxState?.auth?.user?.myprofile);
  }, [reduxState?.auth?.user?.myprofile]);

  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const handleVerification = () => {
    if (profileData?.profileVerification?.verified) {
      setOpenModal(true);
    } else {
      props.navigation.navigate("Verification")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          filterHandler={() => props.navigation.navigate("Filters")}
          viewProfileHandler={() => props.navigation.navigate("ViewProfile")}
          boostingHandler={() => props.navigation.navigate("Boosting",{back: 11})}
          fullName={
            profileData && (profileData as { fullName: string }).fullName
              ? (profileData as { fullName: string }).fullName
              : ""
          }
          imgPath={
            (profileData as { photos: string[] })?.photos
              ? (profileData as { photos: string[] }).photos[0]
              : null
          }
          isVerified={
            profileData && (profileData as { isVerified: boolean }).isVerified
              ? (profileData as { isVerified: boolean }).isVerified
              : false
          }
        />
        <PremiumOverview
          manageSubscription={() => props.navigation.navigate("PremiumPlan",{back:15})}
        />

        <PlanOverview navigation={props.navigation} user={profileData}/>

        {/* settings */}
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => props.navigation.navigate("Settings")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="settings" size={24} color="black" />
          </View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: AppColors.blackColor,
              fontSize: 14,
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            Settings
          </Text>
          <Ionicons name="caret-forward" size={24} color="black" />
        </TouchableOpacity>
        {/* ID Verification */}
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={handleVerification}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="verified" size={24} color="black" />
          </View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: AppColors.blackColor,
              fontSize: 14,
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            ID Verifcation
          </Text>
          <Ionicons name="caret-forward" size={24} color="black" />
        </TouchableOpacity>
        {/* Contact Us */}
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => props.navigation.navigate("Contact")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="quick-contacts-mail" size={24} color="black" />
          </View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: AppColors.blackColor,
              fontSize: 14,
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            Contact Us
          </Text>
          <Ionicons name="caret-forward" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={openModal} transparent={true}>
        <View style={styles.overlay}>
          <View
            style={{
              backgroundColor: AppColors.whiteColor,
              borderRadius: 20,
              width: "90%",
              paddingVertical: 20,
            }}
          >
            <View style={{ width: '100%', alignItems: "center" }}>
              <Image
                source={AppImages.VERIFIED_ICON}
                resizeMode="contain"
                style={{ width: 100, height: 100 }}
              />
            </View>
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 24,
                color: AppColors.blackColor,
                marginTop: 20,
                textAlign: "center",
              }}
            >
              You are Verified!
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: AppColors.secondaryText,
                marginVertical: 10,
                lineHeight: 25,
                paddingHorizontal: 20,
                textAlign: "center",
              }}
            >
              No need to verify again. Your profile is already verified.
            </Text>
            <View style={{ marginHorizontal: 20 }}>

              <CommonButton
                title={"Got it"}
                pressHandler={() => setOpenModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    marginVertical: 5,
    padding: 15,
    justifyContent: "space-between",
  },
  iconContainer: {
    backgroundColor: AppColors.appThemeColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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

export default Profile;
