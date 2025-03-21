import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
} from "react-native";
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
import { ScrollView } from "react-native-virtualized-view";
import { AppColors } from "../../utility/AppColors";
import { Ionicons } from "@expo/vector-icons";
import Filter from "../notifications/components/Filter";
import SwitchSetting from "./components/SwitchSetting";
import CommonButton from "../../components/common/CommonButton";
import { FULL_HEIGHT } from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { logout, updatemyprofile } from "../../../redux/authSlice";
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { updateNotificationApi } from "../../../api/ProfileCompletion/PostApis/updateNotificationApi";
import { updateProfileSharingApi } from "../../../api/ProfileCompletion/PostApis/updateProfileSharingApi";
import { updateBlurPhotoApi } from "../../../api/ProfileCompletion/PostApis/updateBlurPhotosApi";
import { updateHideProfileApi } from "../../../api/ProfileCompletion/PostApis/updateHideProfileApi";
import { removeFcmApi } from "../../../api/Auth/PostApis/removeFcmApi";
import { useInfoModal } from "@/context/ModalContext";

const Settings = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const reduxState = useSelector((state) => state);

  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [toggleProfileSharing, setToggleProfileSharing] = useState(false);
  const [toggleBlurPhotos, setToggleBlurPhotos] = useState(false);
  const [toggleHideProfile, setToggleHideProfile] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const [fcm, setFcm] = useState<string | null>(null);
  const { openModal } = useInfoModal();
  useEffect(() => {
    setProfileData(reduxState?.auth?.user?.myprofile);
    setToggleNotifications(reduxState?.auth?.user?.myprofile?.notifications);
    setToggleProfileSharing(reduxState?.auth?.user?.myprofile?.profilesharing);
    setToggleBlurPhotos(reduxState?.auth?.user?.myprofile?.photoPrivacy);
    setToggleHideProfile(
      reduxState?.auth?.user?.myprofile?.hideprofile?.sharing
    );
  }, [reduxState?.auth?.user?.myprofile]);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => setFcm(token));
    } else {
      return;
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await removeFcmApi(reduxState.auth.token);

      if (res.success) {
        dispatch(logout());
        setIsLogout(false); // Close the modal after dispatching logout action
        props.navigation.navigate("GetStarted");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNotification = async () => {
    try {
      setToggleNotifications(!toggleNotifications);
      const res = await updateNotificationApi(
        reduxState.auth.token,
        !toggleNotifications,
        fcm
      );

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  };

  const handleProfileSharing = async () => {
    try {
      setToggleProfileSharing(!toggleProfileSharing);
      const res = await updateProfileSharingApi(
        reduxState.auth.token,
        !toggleProfileSharing
      );

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  };

  const handleBlurPhotos = async () => {
    try {
      setToggleBlurPhotos(!toggleBlurPhotos);
      const res = await updateBlurPhotoApi(
        reduxState.auth.token,
        !toggleBlurPhotos
      );

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  };

  const handleHideProfile = async () => {
    try {
      setToggleHideProfile(!toggleHideProfile);
      const res = await updateHideProfileApi(
        reduxState.auth.token,
        !toggleHideProfile
      );

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        {/* header */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={34}
            onPress={() => props.navigation.navigate("Profile")}
            color="black"
            style={{ position: "absolute", left: 0 }}
          />
          <Text
            style={[{ fontFamily: "Poppins_600SemiBold" }, styles.titleText]}
          >
            Settings
          </Text>
        </View>

        {/* Personal Information */}
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Personal Information
        </Text>
        <Filter
          title={"Full Name"}
          content={profileData?.fullName}
          pressHandler={() => props.navigation.navigate("Name", { back: 1 })}
        />
        <Filter
          title={"Date of Birth"}
          content={profileData?.birthday?.split("T")[0]}
          pressHandler={() =>
            props.navigation.navigate("DateOfBirth", { back: 1 })
          }
        />
        <Filter
          title={"Gender"}
          content={profileData?.gender}
          pressHandler={() => props.navigation.navigate("Gender", { back: 1 })}
        />
        <Filter
          title={"Email"}
          content={profileData?.email}
          pressHandler={() => props.navigation.navigate("Email", { back: 1 })}
        />
        <Filter
          title={"Phone Number"}
          content={profileData?.phoneCode + profileData?.phoneNumber}
          pressHandler={() =>
            props.navigation.navigate("PhoneNumber", { back: 1 })
          }
        />

        {/* notifications */}
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Notification
        </Text>
        <SwitchSetting
          toggle={toggleNotifications}
          setToggle={handleNotification}
          title="Notification"
          content="Enable notification to stay up-to-date"
        />

        {/* account */}
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Account
        </Text>
        {/* <Filter
          title={"Language"}
          content={
            profileData?.languages ? profileData?.languages.join(", ") : ""
          }
          pressHandler={() =>
            props.navigation.navigate("Language", { back: 1 })
          }
        /> */}
        <Filter
          title={"Restore Purchases"}
          content={"Restore your subscription"}
          pressHandler={() => {if(reduxState?.auth?.user?.myprofile.proAccount==false){
            openModal("Unable to Restore", "Your Account is Not Pro. You haven't subscribed", "OK", "error");
          }}}
        />

        {/* privacy */}
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Privacy
        </Text>
        <SwitchSetting
          toggle={toggleProfileSharing}
          setToggle={handleProfileSharing}
          title="Profile Sharing"
          content="Allow your profile to be shared"
        />
        <SwitchSetting
          toggle={toggleBlurPhotos}
          setToggle={handleBlurPhotos}
          title="Blur Photo"
          content="You can blur your photos"
        />

        {/* break */}
        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Take a Break
        </Text>
        <SwitchSetting
          toggle={toggleHideProfile}
          setToggle={handleHideProfile}
          title="Hide my profile"
          content="hiding your profile means we won’t show it to new people. you can still chat with your current matches"
        />
        <Filter
          pressHandler={() => setIsLogout(true)}
          title={"Logout"}
          content={"Logging out doesn’t hide your profile"}
        />
        <Filter
          title={"Delete Account"}
          content={"This will delete your account completely"}
          pressHandler={() => props.navigation.navigate("Break")}
        />
        {/* unmatch menu */}
        <Modal visible={isLogout} transparent={true}>
          <Pressable style={styles.overlay} onPress={() => setIsLogout(false)}>
            <View
              style={{
                backgroundColor: AppColors.whiteColor,
                padding: 15,
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 30,
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
                Log Out
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
                Are You Sure You Want To Log Out?
              </Text>
              <CommonButton title={"Log Out"} pressHandler={handleLogout} />

              <Text
                onPress={() => setIsLogout(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                  fontSize: 16,
                  color: AppColors.blackColor,
                  marginBottom: 30,
                }}
              >
                Cancel
              </Text>
            </View>
          </Pressable>
        </Modal>
        <View style={{ marginBottom: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  heading: {
    fontSize: 20,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 40,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    color: AppColors.blackColor,
    fontSize: 16,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  standardText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  description: {
    color: AppColors.secondaryText,
    fontSize: 12,
  },
  title: {
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

export default Settings;
