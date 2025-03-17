import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import HomeHeader from "./components/HomeHeader";
import Swiper from "react-native-deck-swiper";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { setUserMatches } from "../../../redux/authSlice";
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
import { FULL_HEIGHT, FULL_WIDTH } from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import { getUserMatchesApi } from "../../../api/UserMatches/GetApis/getUserMatchesApi";
import { useSelector, useDispatch } from "react-redux";
import { saveSwipesApi } from "../../../api/UserMatches/PostApis/saveSwipesApi";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import CountryFlag from "react-native-country-flag";
import { BlurView } from "expo-blur";
import { AppImages } from "../../utility/AppImages";
import CommonButton from "../../components/common/CommonButton";
import { rewindApi } from "../../../api/UserMatches/PostApis/rewindApi";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import { updatemyprofile } from "../../../redux/authSlice";
import Toast from "react-native-toast-message";
import { instantChatApi } from "../../../api/UserMatches/PostApis/instantChatApi";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
} from "react-native-purchases";
import { verticalScale } from "@/styles/scaling";
import { useInfoModal } from "@/context/ModalContext";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

countries.registerLocale(en);

// useroute interface with default value swiped as false
interface RouteParams {
  swiped: string;
}

const Home = (props) => {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mycoordiantes, setMyCoordinates] = useState([0, 0]);
  const [openModal, setOpenModal] = useState(false);
  const swiperRef = React.createRef();
  const [chatPressed, setChatPressed] = useState(false);
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const [currentOffering, setCurrentOffering] =
    React.useState<PurchasesOffering | null>(null);
  const [swiped, setSwiped] = useState(false);
  // const { openModal } = useInfoModal();
  const { openModal: triggerInfoModal } = useInfoModal();
  const handleTouchStart = (e) => {
    setTouchStart(e.nativeEvent.pageY);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.nativeEvent.pageY);
    if (Math.abs(touchStart - e.nativeEvent.pageY) < 10) {
      props.navigation.navigate("UserDetail", {
        user_id: users[currentIndex]?._id,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.swiped === "right") {
        swiperRef.current?.swipeRight();
        return;
      }

      if (route.params?.swiped === "left") {
        swiperRef.current?.swipeLeft();
        return;
      }

      if (route.params?.swiped === "refresh") {
        fetchData();
        return;
      }
    }, [route.params?.swiped])
  );

  const APIKeys = {
    apple: process.env.EXPO_PUBLIC_APPLE_PURCHASES_KEY,
  };

  // ! SEPERATE
  const setup = async () => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (Platform.OS == "ios") {
      console.log("here");

      await Purchases.configure({ apiKey: APIKeys.apple });
    }
    // else {
    //   console.log("here");

    //   await Purchases.configure({ apiKey: APIKeys.apple });
    // }

    const offerings = await Purchases.getOfferings();
    console.log(offerings.all.boosts);

    // setCurrentOffering(offerings.current);
  };
  // ! SEPERATE

  useEffect(() => {
    setup().catch(console.log);
  }, []);
  // ! SEPERATE

  const getCountryName = (country) => {
    return countries.getAlpha2Code(country, "en");
  };
  // ! SEPERATE

  const toRadians = (degrees) => degrees * (Math.PI / 180);
  // ! SEPERATE
  const Caldistance = (lat1, lon1) => {
    const lat2 = mycoordiantes[0];
    const lon2 = mycoordiantes[1];
    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKm = R * c;
    const distanceInMiles = distanceInKm * 0.621371; // Convert km to miles
    //round to 3 decimal places
    const roundedDistance = Math.round(distanceInMiles * 1000) / 1000;

    if (roundedDistance < 1) {
      return "Less than a mile away";
    } else {
      return `${roundedDistance} miles away`;
    }
  };
  // TODO SEPERATE
  const fetchData = async () => {
    try {
      const response = await getUserMatchesApi(reduxState.auth.token);
      // let response;
      if (reduxState.auth.userMatches.length == !0) {
        // console.log("this is the data for the first time");
        // console.log(reduxState.auth.userMatches);
        // console.log(reduxState.auth.userMatches.length);
        // console.log("------------------------------------");
        response = await reduxState.auth.userMatches;
        dispatch(setUserMatches([]));
      } else {
        // console.log("this is after the first time after the filtering");
        // response = await getUserMatchesApi(reduxState.auth.token);
        // console.log('Test',response);
        // console.log('Test',reduxState.auth.userMatches.length);
        // console.log("-------------------------------------------------");
      }
      // response = await reduxState.auth.userMatches;
      //   console.log("this is the data");
      //   console.log('Test',response);

      //   console.log("this is the data");
      setMyCoordinates(
        reduxState?.auth?.user?.myprofile?.locationCoordinates?.coordinates
      );
      setUsers(response);
    } catch (error) {
      console.error("Error fetching user matches:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const handlAllSwiped = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await getUserMatchesApi(reduxState.auth.token);
      setUsers(response);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching user matches:", error);
    }
  };
  const backAction = () => {
    Alert.alert("Exit App?", "Are you sure you want to exit?", [
      {
        text: "NO",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };
  
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
  return () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
  }   
  }, []);
  const handleSwipeRight = async (id) => {
    if (reduxState?.auth?.user?.myprofile?.likes === 0) {
      swiperRef.current?.swipeBack();
      props.navigation.navigate("PremiumPlan", { back: 16 });
      // setOpenModal(true);
      return;
    }

    try {
      const res = await saveSwipesApi(id, "like", reduxState.auth.token);

      setSwiped(true);
      dispatch(updatemyprofile(res.user));
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.log("ok is it in the catch line 191");

      console.error("Error saving right swipe:", error);
    }
  };

  const handleSwipeLeft = async (id) => {
    if (reduxState?.auth?.user?.myprofile?.likes === 0) {
      swiperRef.current?.swipeBack();
      props.navigation.navigate("PremiumPlan", { back: 16 });
      // setOpenModal(true);
      return;
    }

    try {
      const res = await saveSwipesApi(id, "dislike", reduxState.auth.token);

      setSwiped(true);
      dispatch(updatemyprofile(res.user));
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.log("error in the catch line211");

      console.error("Error saving left swipe:", error);
    }
  };

  if (!fontsLoaded) {
    return <View />; // Render nothing until fonts are loaded
  }

  const handleRewind = async () => {
    if (!swiped) {
      // showToast("No swipes to rewind", "You have not swiped anyone yet");

      triggerInfoModal(
        "No swipes to rewind",
        "You have not swiped anyone yet",
        "OK",
        "error"
      );

      return;
    }

    try {
      const res = await rewindApi(reduxState.auth.token);

      if (res.message == "No swipes to rewind") {
        // openModal("No swipes to rewind", "You have not swiped anyone yet", "Try again", "error");
        // showToast("No swipes to rewind", "You have not swiped anyone yet");
        triggerInfoModal(
          "No swipes to rewind",
          "You have not swiped anyone yet",
          "OK",
          "error"
        );
        return;
      }
      if (res.user) {
        const updatedUsers = [res.user, ...users];
        setUsers(updatedUsers);
        swiperRef.current?.swipeBack();
      } else {
        console.log("passing the 16");
        props.navigation.navigate("PremiumPlan", { back: 16 });
        // setOpenModal(true);
      }
    } catch (error) {
      console.error("Error rewinding:", error);
    }
  };
  // TODO REUSABLE
  const showToast = (title: string, message: string) => {
    Toast.show({
      type: "error",
      position: "bottom",
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  const handleInstantChat = async () => {
    try {
      const res = await instantChatApi(
        users[currentIndex]?._id,
        reduxState.auth.token
      );
      console.log(res);
      // if (res.success) {
        dispatch(updatemyprofile(res?.user));
        props.navigation.navigate("ChatScreen", {
          user: res?.swipedUser,
          conversation: res?.chat?._id,
        });
      // } else {
      //   props.navigation.navigate("PremiumPlan");
      // }
    } catch (error) {
      console.error("Error instant chat:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HomeHeader
          navigation={props.navigation}
          handleRewind={handleRewind}
          showNotification={false}
          backButtonDisabled={true}
          notificationHandler={() => props.navigation.navigate("Notifications")}
          filterHandler={() => props.navigation.navigate("Filters")}
        />
        <View  onTouchStart={(e) => {
          handleTouchStart(e);
        }}
        onTouchEnd={(e) => {
          handleTouchEnd(e);
        }}>
          {users?.length > 0 ? (
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                padding: verticalScale(270),
                backgroundColor: "transparent",
              }}
            >
              <Swiper
                ref={swiperRef}
                cards={users}
                backgroundColor="transparent"
                renderCard={(user, index) =>
                  user && (
                    // TODO REUSABLE
                    <ImageBackground
                      imageStyle={{ borderRadius: 20, overflow: "hidden" }}
                      source={{ uri: user.photos && user.photos[0] }} // Check if photos exist
                      key={index}
                      style={styles.card}
                      resizeMode="cover"
                    >
                      {user?.photoPrivacy ? (
                        <BlurView
                          experimentalBlurMethod="dimezisBlurView"
                          intensity={50} // Adjust the intensity to your liking
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 20,
                            overflow: "hidden",
                          }}
                        >
                          <View style={styles.contentContainer}>
                            <View>
                              <Text
                                style={{
                                  fontFamily: "Poppins_500Medium",
                                  color: AppColors.whiteColor,
                                  fontSize: 23,
                                }}
                              >
                                {user.fullName}, {user.Age}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Poppins_500Medium",
                                  color: AppColors.whiteColor,
                                  fontSize: 14,
                                }}
                              >
                                {user.profession} | {user.location}
                              </Text>
                              <View style={styles.rowContainer}>
                                <View
                                  style={{
                                    height: 25,
                                    width: 25,
                                    borderRadius: 500,
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <CountryFlag
                                    isoCode={
                                      getCountryName(user?.location) ||
                                      getCountryName("Afghanistan")
                                    }
                                    size={25}
                                  />
                                </View>
                                <Text
                                  style={{
                                    fontFamily: "Poppins_500Medium",
                                    color: AppColors.whiteColor,
                                    fontSize: 14,
                                    marginHorizontal: 10,
                                  }}
                                >
                                  {user &&
                                    Caldistance(
                                      user?.locationCoordinates?.coordinates[0],
                                      user?.locationCoordinates?.coordinates[1]
                                    )}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </BlurView>
                      ) : (
                        <View style={styles.contentContainer}>
                          <View>
                            <Text
                              style={{
                                fontFamily: "Poppins_500Medium",
                                color: AppColors.whiteColor,
                                fontSize: 23,
                              }}
                            >
                              {user.fullName}, {user.Age}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Poppins_500Medium",
                                color: AppColors.whiteColor,
                                fontSize: 14,
                              }}
                            >
                              {user.profession} | {user.location}
                            </Text>
                            <View style={styles.rowContainer}>
                              <View
                                style={{
                                  height: 25,
                                  width: 25,
                                  borderRadius: 500,
                                  overflow: "hidden",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CountryFlag
                                  isoCode={
                                    getCountryName(user?.location) ||
                                    getCountryName("Afghanistan")
                                  }
                                  size={25}
                                />
                              </View>
                              <Text
                                style={{
                                  fontFamily: "Poppins_500Medium",
                                  color: AppColors.whiteColor,
                                  fontSize: 14,
                                  marginHorizontal: 10,
                                }}
                              >
                                {user &&
                                  Caldistance(
                                    user?.locationCoordinates?.coordinates[0],
                                    user?.locationCoordinates?.coordinates[1]
                                  )}

                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </ImageBackground>
                  )
                }
                onSwipedLeft={() => handleSwipeLeft(users[currentIndex]._id)}
                onSwipedRight={() => handleSwipeRight(users[currentIndex]._id)}
                onSwipedAll={handlAllSwiped}
                cardIndex={0}
                stackSize={3}
                stackSeparation={15}
                showSecondCard={true}
                verticalSwipe={false}
                animateCardOpacity={true}
                animateOverlayLabelsOpacity
                overlayLabels={{
                  left: {
                    element: (
                      <View style={styles.swipeIconContainer}>
                        <Entypo
                          name="cross"
                          size={105}
                          color={AppColors.appThemeColor}
                        />
                      </View>
                    ),
                    style: {
                      wrapper: {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        marginTop: -60,
                        marginLeft: -30,
                      },
                    },
                  },
                  right: {
                    element: (
                      <View style={styles.swipeIconContainer}>
                        <Entypo
                          name="heart"
                          size={105}
                          color={AppColors.appThemeColor}
                        />
                      </View>
                    ),
                    style: {
                      wrapper: {
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        marginTop: -60,
                        marginLeft: 30,
                      },
                    },
                  },
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                marginTop: FULL_HEIGHT * 0.04,
              }}
            >
              <View
                style={{
                  width: FULL_WIDTH * 0.94,
                  height: FULL_HEIGHT * 0.7,
                  backgroundColor: AppColors.appThemeColor,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  paddingHorizontal: FULL_WIDTH * 0.09,
                }}
              >
                <View
                  style={[
                    {
                      borderRadius: 100,
                      height: 50,
                      width: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: AppColors.blackColor,
                    },
                  ]}
                >
                  <Image
                    style={{ width: 17, height: 14 }}
                    source={AppImages.FILTER_YELLOW}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    marginVertical: FULL_HEIGHT * 0.015,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  You’re fully caught up
                </Text>
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  You have seen all people nearby. Change your filters or check
                  back later
                </Text>

                <CommonButton
                  title="Change Filters"
                  pressHandler={() => props.navigation.navigate("Filters")}
                  style={{ marginTop: FULL_HEIGHT * 0.05 }}
                  buttonStyle={{ backgroundColor: AppColors.whiteColor }}
                />
              </View>
            </View>
          )}
        </View>
        {users?.length>0?<TouchableOpacity
          style={styles.iconContainer}
          onPress={(event) => {

            handleInstantChat(); // Handle message click
          }}
        >
          <MaterialCommunityIcons
            name="message-text"
            size={24}
            color={AppColors.whiteColor}
          />
        </TouchableOpacity>:<></>}
      </ScrollView>

      <SubscriptionModal openModal={openModal} setOpenModal={setOpenModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  card: {
    borderRadius: 10,
    height: FULL_HEIGHT * 0.7,
    backgroundColor: "transparent",
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: "white",
  },
  iconContainer: {
    borderRadius: 100,
    backgroundColor: "rgba(62, 127, 255, 1)",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex:1,
    bottom:150,
    right:60,
  },
  contentContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    justifyContent: "space-between",
    alignSelf: "flex-end",
    zIndex: 1000,
    height: "78%",
    paddingBottom: 30,
    marginTop: 100,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  swipeIconContainer: {
    backgroundColor: AppColors.blackColor,
    padding: 10,
    borderRadius: 300,
  },
});

export default Home;
