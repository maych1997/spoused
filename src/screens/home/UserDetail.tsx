import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  AppState,
  FlatList,
  ScrollView
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
import { AppColors } from "../../utility/AppColors";
import HomeHeader from "./components/HomeHeader";
import { AppImages } from "../../utility/AppImages";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import UserAction from "./components/UserAction";
import { FontAwesome } from "@expo/vector-icons";
import { FULL_WIDTH } from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import { getSingleProfileApi } from "../../../api/ProfileCompletion/GetApis/getSingleProfileApi";
import { useSelector, useDispatch } from "react-redux";
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import CountryFlag from "react-native-country-flag";
import { BlurView } from "expo-blur";
import { useRoute } from "@react-navigation/native";
import { instantChatApi } from "../../../api/UserMatches/PostApis/instantChatApi";
import { updatemyprofile } from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import { saveSwipesApi } from "../../../api/UserMatches/PostApis/saveSwipesApi";
import { blockUserApi } from "../../../api/ProfileCompletion/PostApis/blockUserApi";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

const UserDetail = (props: any) => {
  const route = useRoute();
  const user_id = route?.params?.user_id;
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const [profileData, setProfileData] = useState({});
  const [mycoordiantes, setMyCoordinates] = useState([0, 0]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [status, setStatus] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const videoRef = useRef(null);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({});

  const getCountryName = (country) => {
    return countries.getAlpha2Code(country, 'en');
  };


  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const Caldistance = (lat1, lon1) => {
    const lat2 = mycoordiantes[0];
    const lon2 = mycoordiantes[1];
    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKm = R * c;
    const distanceInMiles = distanceInKm * 0.621371; // Convert km to miles
    //round to 3 decimal places
    const roundedDistance = Math.round(distanceInMiles * 1000) / 1000;

    if (roundedDistance < 1) {
      return "Less than a mile away";
    }
    else {
      return `${roundedDistance} miles away`;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSingleProfileApi(user_id, reduxState.auth.token);

        // setMyCoordinates(reduxState?.auth?.user?.myprofile?.locationCoordinates?.coordinates)
        setMyCoordinates([51.5074, 0.1278])
        const profileData = response.data;
        setProfileData(profileData);
        setFilteredPhotos(profileData?.photos.filter(photo => photo !== null));
        setVideoUri(profileData?.video);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const interests = profileData
    ? [
      ...(profileData.interests?.sports ? profileData.interests.sports : []),
      ...(profileData.interests?.foodanddrinks ? profileData.interests.foodanddrinks : []),
      ...(profileData.interests?.community ? profileData.interests.community : []),
      ...(profileData.interests?.artsandculture ? profileData.interests.artsandculture : []),
      ...(profileData.interests?.outdoors ? profileData.interests.outdoors : []),
      ...(profileData.interests?.technology ? profileData.interests.technology : []),
    ]
    : [];

  const renderAboutMe = ({ item }: any) => {
    let content;
    switch (item) {
      case "height":
        content = `  ${profileData?.height?.cm + " cm (" + profileData?.height?.ft + ')' || " "
          }`;
        break;
      case "maritalStatus":
        content = ` ${profileData?.maritalStatus || "N/A"}`;
        break;
      case "children":
        if (profileData?.children === "No") {
          content = `No Children`;
        }
        if (profileData?.children === "Yes") {
          content = `want Children`;
        }
        if (profileData?.children === "Maybe") {
          content = `Maybe Children`;
        }
        break;
      case "starSign":
        content = `${profileData?.starSign || "N/A"}`;
        break;
      default:
        content = "";
        break;
    }

    const interests = profileData
      ? [
        ...(profileData.interests?.sports ? profileData.interests.sports : []),
        ...(profileData.interests?.foodanddrinks
          ? profileData.interests.foodanddrinks
          : []),
        ...(profileData.interests?.community
          ? profileData.interests.community
          : []),
        ...(profileData.interests?.artsandculture
          ? profileData.interests.artsandculture
          : []),
        ...(profileData.interests?.outdoors
          ? profileData.interests.outdoors
          : []),
        ...(profileData.interests?.technology
          ? profileData.interests.technology
          : []),
      ]
      : [];

    return (
      <View style={styles.roundContainer}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            color: AppColors.blackColor,
            fontSize: 12,
          }}
        >
          {content}
        </Text>
      </View>
    );
  };

  const religiosityData = [
    { key: "Religion", value: profileData?.religion },
    {
      key: "Smoking",
      value: profileData?.smoking === "No" ? "Non-smoker" : "Smoker",
    },
    {
      key: "Drink",
      value: profileData?.drink === "No" ? "Non-drinker" : "Drinker",
    },
  ];
  const renderReligiosity = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            padding: 15,
            backgroundColor: AppColors.greyFill,
            borderRadius: 20,
            margin: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              color: AppColors.blackColor,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {`${item.value}`}
          </Text>
        </View>
      </View>
    );
  };

  const backHandler = () => {
    props.navigation.navigate("Home");
  };

  const handleInstantChat = async () => {
    if(!reduxState?.auth?.user?.myprofile?.proAccount) {
      console.log('its not a premium');

      props.navigation.navigate("PremiumPlan");
      return
    }
    try {
      const res = await instantChatApi(user_id, reduxState.auth.token);
      
      if (res.success) {
        dispatch(updatemyprofile(res.user));
        props.navigation.navigate("ChatScreen", { user: res?.swipedUser, conversation: res?.chat?._id })
      }
      else {
        setOpenModal(true);
      }

    }
    catch (error) {
      console.error("Error instant chat:", error);
    }
  }

  const handleSwipeRight = async () => {
    props.navigation.navigate("Home", { swiped: "right" });
  };

  const handleSwipeLeft = async () => {
    props.navigation.navigate("Home", { swiped: "left" });
  };

  const Block = async () => {
    try {
      const res = await blockUserApi(user_id, reduxState.auth.token);

      if (res.success) {
        props.navigation.navigate("Home", { swiped: "refresh" });
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  }

  const playVideo = async () => {
    if (videoUri && videoRef.current) {
      try {
        await videoRef.current.playAsync();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

  // Debounced onPlaybackStatusUpdate handler
  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.didJustFinish) {
      setStatus((prevStatus) => {
        // Update only if there is a significant change
        if (prevStatus.didJustFinish !== status.didJustFinish) {
          return status;
        }
        return prevStatus;
      });
    }
  };

  useEffect(() => {
    if (videoUri) {
      playVideo();
    }
  }, [videoUri]);




  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  console.log(profileData?.video);


  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: profileData?.intro },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      setPlaybackStatus(status);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  }

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView>
        <HomeHeader activeFilter={true} backHandler={backHandler} />
        <ImageBackground
          src={profileData?.photos ? profileData.photos[0] : null}
          resizeMode="cover"
          style={{
            width: FULL_WIDTH,
            marginTop: 20,
            height: 530,
          }}
        >
          {profileData?.photoPrivacy ?
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={70} // Adjust the intensity to your liking
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }}>
              <View style={styles.contentContainer}>
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: AppColors.whiteColor,
                      fontSize: 23,
                    }}
                  >
                    {profileData && (profileData as { fullName: string }).fullName
                      ? (profileData as { fullName: string }).fullName
                      : ""}
                    ,{" "}
                    {profileData && (profileData as { Age: string })?.Age
                      ? (profileData as { Age: string })?.Age
                      : ""}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: AppColors.whiteColor,
                      fontSize: 14,
                      marginVertical: 10,
                    }}
                  >
                    {profileData &&
                      (profileData as { profession: string })?.profession
                      ? (profileData as { profession: string })?.profession
                      : ""}
                    | {(profileData as { location: string })?.location}
                  </Text>
                  <View style={styles.rowContainer}>
                    {profileData && profileData?.location && (
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
                          isoCode={getCountryName(profileData?.location)  || getCountryName('Afghanistan')}
                          size={25}
                        />
                      </View>
                    )}
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: AppColors.whiteColor,
                        fontSize: 14,
                        marginHorizontal: 10,
                      }}
                    >
                      {profileData &&
                        profileData?.location &&
                        Caldistance(
                          profileData?.locationCoordinates?.coordinates[0],
                          profileData?.locationCoordinates?.coordinates[1]
                        )}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleInstantChat}
                >
                  <MaterialCommunityIcons
                    name="message-text"
                    size={24}
                    color={AppColors.whiteColor}
                  />
                </TouchableOpacity>
              </View>
            </BlurView> :
            <View style={styles.contentContainer}>
              <View>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: AppColors.whiteColor,
                    fontSize: 23,
                  }}
                >
                  {profileData && (profileData as { fullName: string }).fullName
                    ? (profileData as { fullName: string }).fullName
                    : ""}
                  ,{" "}
                  {profileData && (profileData as { Age: string })?.Age
                    ? (profileData as { Age: string })?.Age
                    : ""}{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: AppColors.whiteColor,
                    fontSize: 14,
                    marginVertical: 10,
                  }}
                >
                  {profileData &&
                    (profileData as { profession: string })?.profession
                    ? (profileData as { profession: string })?.profession
                    : ""}
                  | {(profileData as { location: string })?.location}
                </Text>
                <View style={styles.rowContainer}>
                  {profileData && profileData?.location && (
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
                        isoCode={getCountryName(profileData?.location) || getCountryName("Afghanistan")  }
                        size={25}
                      />
                    </View>
                  )}
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: AppColors.whiteColor,
                      fontSize: 14,
                      marginHorizontal: 10,
                    }}
                  >
                    {profileData &&
                      profileData?.location &&
                      Caldistance(
                        profileData?.locationCoordinates?.coordinates[0],
                        profileData?.locationCoordinates?.coordinates[1]
                      )}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={handleInstantChat}
              >
                <MaterialCommunityIcons
                  name="message-text"
                  size={24}
                  color={AppColors.whiteColor}
                />
              </TouchableOpacity>
            </View>
          }
        </ImageBackground>

        {profileData && profileData?.video && (
          <View>
            <Video
              ref={videoRef}
              style={{
                height: 600,
                width: "100%",
                marginTop: 8,
                borderRadius: 0,
                alignSelf: "center",
              }}
              source={{ uri: videoUri }}
              resizeMode="cover"
              shouldPlay
              isLooping
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
          </View>
        )}

        <View style={{ padding: 15 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: AppColors.blackColor,
              fontSize: 20,
            }}
          >


            About me
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {["height", "maritalStatus", "starSign", "children"].map((item) => {
              return renderAboutMe({ item });
            })}

            {
              reduxState?.auth?.user?.myprofile?.proAccount &&
              <View style={styles.roundContainer}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: AppColors.blackColor,
                    fontSize: 12,
                  }}
                >
                  {profileData?.phoneCode && profileData?.phoneNumber ? profileData.phoneCode + profileData.phoneNumber : null}
                </Text>
              </View>
            }
          </View>

          {profileData?.intro && <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: AppColors.blackColor,
              fontSize: 20,
            }}
          >
            Intro
          </Text>}
          {profileData?.intro && <Slider
            style={{ width: "100%", height: 40, marginTop: 10 }}
            minimumValue={0}
            disabled
            maximumValue={playbackStatus?.durationMillis || 0}
            value={playbackStatus?.positionMillis || 0}
            onSlidingComplete={async (value) => {
              if (sound) {
                await sound.setPositionAsync(value);
              }
            }}
          />}

          {profileData?.intro && <View style={{ flexDirection: "row", justifyContent: "center", columnGap: 18 }}>

            <TouchableOpacity
              onPress={isPlaying ? pauseSound : playSound}
              style={{ height: 50, width: 50, backgroundColor: AppColors.gray_E8E8E8, borderRadius: 1000, justifyContent: "center", alignItems: "center" }}>
              {isPlaying ? <FontAwesome name={"pause"} size={18} color="black" /> :
                <FontAwesome name={"play"} size={18} color="black" />
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={stopSound}
              style={{ height: 50, width: 50, backgroundColor: AppColors.red_FF0000, borderRadius: 1000, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name={"stop"} size={18} color="white" />
            </TouchableOpacity>
          </View>}

          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: AppColors.blackColor,
              fontSize: 20,
              marginTop: 20,
            }}
          >
            Biography
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              color: AppColors.secondaryText,
              fontSize: 12,
              marginVertical: 15,
            }}
          >
            {profileData && (profileData as { biography: string }).biography
              ? (profileData as { biography: string }).biography
              : ""}
          </Text>

          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: AppColors.blackColor,
              fontSize: 20,
            }}
          >
            Interests
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
            {interests.map((item, index) => (
              <View
                key={index}
                style={{
                  padding: 10,
                  margin: 5,
                  borderRadius: 20,
                  backgroundColor: AppColors.appThemeColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: AppColors.blackColor,
                    fontSize: 12,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <FlatList
            data={filteredPhotos}
            renderItem={({ item, index }: any) => (
              profileData?.photoPrivacy ? <View style={styles.userImageContainer}>
                <Image
                  style={[styles.userImage, { position: 'absolute' }]}
                  source={{ uri: item }} // Assuming `item` is the URI of the image
                  key={index}
                  resizeMode="cover"
                />
                <BlurView
                  experimentalBlurMethod="dimezisBlurView"
                  intensity={50} // Adjust the intensity to your liking
                  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }}
                />
              </View> :
                <View style={styles.userImageContainer}>
                  <Image
                    style={[styles.userImage, { position: 'absolute' }]}
                    source={{ uri: item }} // Assuming `item` is the URI of the image
                    key={index}
                    resizeMode="cover"
                  />
                </View>
            )}
            horizontal
          />

            {/* Location */}
            <Text
                style={{
                    fontFamily: "Poppins_700Bold",
                    color: AppColors.blackColor,
                    fontSize: 20,
                    marginTop: 20,
                }}
            >
                Location
            </Text>
            <View
                style={[
                    styles.rowContainer,
                    { justifyContent: "flex-start", marginVertical: 10 },
                ]}
            >
                <View style={styles.roundContainer}>
                    <Text
                        style={{
                            fontFamily: "Poppins_400Regular",
                            color: AppColors.blackColor,
                            fontSize: 14,
                        }}
                    >
                        {profileData?.location}
                    </Text>
                </View>

            </View>

            {/* profession and education */}
            <Text
                style={{
                    fontFamily: "Poppins_700Bold",
                    color: AppColors.blackColor,
                    fontSize: 20,
                    marginTop: 20,
                }}
            >
                Height & Age
            </Text>
            <View
                style={[
                    styles.rowContainer,
                    { justifyContent: "flex-start", marginVertical: 10 },
                ]}
            >
                <View style={styles.roundContainer}>
                    <Text
                        style={{
                            fontFamily: "Poppins_400Regular",
                            color: AppColors.blackColor,
                            fontSize: 14,
                        }}
                    >
                        {profileData?.height?.cm + " cm (" + profileData?.height?.ft + ')' || " "
                        }
                    </Text>
                </View>
                <View style={styles.roundContainer}>
                    <Text
                        style={{
                            fontFamily: "Poppins_400Regular",
                            color: AppColors.blackColor,
                            fontSize: 14,
                        }}
                    >
                        {(profileData as { Age: string })?.Age} years old
                    </Text>
                </View>
            </View>






          {/* profession and education */}
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              color: AppColors.blackColor,
              fontSize: 20,
              marginTop: 20,
            }}
          >
            Profession & Education
          </Text>
          <View
            style={[
              styles.rowContainer,
              { justifyContent: "flex-start", marginVertical: 10 },
            ]}
          >
            <View style={styles.roundContainer}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  color: AppColors.blackColor,
                  fontSize: 14,
                }}
              >
                {(profileData as { profession: string })?.profession}
              </Text>
            </View>
            <View style={styles.roundContainer}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  color: AppColors.blackColor,
                  fontSize: 14,
                }}
              >
                {(profileData as { education: string }).education}
              </Text>
            </View>
          </View>



          {/* action */}
          <UserAction handleSwipeLeft={handleSwipeLeft} handleSwipeRight={handleSwipeRight} handleInstantChat={handleInstantChat} />
          <View
            style={[styles.rowContainer, { width: "100%", alignSelf: "center", justifyContent: "center" }]}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                color: AppColors.blackColor,
                fontSize: 16,
                marginHorizontal: 10,
              }}
            >
              Recommend
            </Text>
            <FontAwesome name="circle" size={10} color="black" />
            <TouchableOpacity onPress={Block}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: AppColors.blackColor,
                  fontSize: 16,
                  marginHorizontal: 10,
                }}
              >
                Block
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap:'wrap',
  },
  iconContainer: {
    borderRadius: 1000,
    backgroundColor: "rgba(62, 127, 255, 1)",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
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
  contentContainer: {
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    justifyContent: "space-between",
    alignSelf: "flex-end",
    zIndex: 1000,
    height: "95%",
  },
  roundContainer: {
    borderRadius: 120,
    padding: 15,
    paddingHorizontal: 25,
    backgroundColor: AppColors.greyFill,
    marginRight: 8,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    borderRadius: 20,
    width: 300,
    height: 400,
  },

  userImageContainer: {
    borderRadius: 20,
    width: 300,
    height: 400,
    margin: 10,
    overflow: "hidden",
  },
});

export default UserDetail;
