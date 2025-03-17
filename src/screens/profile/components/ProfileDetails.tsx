import React, {useState, useEffect, useRef} from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    FlatList,
    SafeAreaView,
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
import {MaterialIcons} from "@expo/vector-icons";
import {FontAwesome} from "@expo/vector-icons";
import {AppColors} from "../../../utility/AppColors";
import {useSelector} from "react-redux";
import Slider from "@react-native-community/slider";
import {Video} from "expo-av";
import {Audio} from "expo-av";
import {useNavigation} from "@react-navigation/native";
import {getDistance} from 'geolib';
import * as Location from 'expo-location';



const ProfileDetails = (props: any) => {
    const [profileData, setProfileData] = useState({});
    const reduxState = useSelector((state) => state);
    const [videoUri, setVideoUri] = useState(null);
    const [status, setStatus] = useState({});
    const videoRef = useRef(null);
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackStatus, setPlaybackStatus] = useState({});
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const navigation = useNavigation();
    const [location,setLocation]=useState({});

    useEffect(() => {
        setProfileData(reduxState?.auth?.user?.myprofile);
        setFilteredPhotos(reduxState?.auth?.user?.myprofile?.photos.filter(photo => photo !== null));
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


    const renderAboutMe = ({item}: any) => {
        let content;
        switch (item) {
            case "height":
                // ${profileData?.height?.cm + " cm  &" || "N/A"}
                content = `  ${profileData?.height?.cm + " cm (" + profileData?.height?.ft + ')' || " "
                }`;
                break;
            case "maritalStatus":
                content = ` ${profileData?.maritalStatus || "N/A"}`;
                break;
            case "children":
                if (profileData?.children == "No") {
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

    const religiosityData = [
        {key: "Religion", value: profileData?.religion},
        {
            key: "Smoking",
            value: profileData?.smoking === "No" ? "Non-smoker" : "Smoker",
        },
        {
            key: "Drink",
            value: profileData?.drink === "No" ? "Non-drinker" : "Drinker",
        },
    ];
    const renderReligiosity = ({item}) => {
        return (
            <View style={{flexDirection: "row"}}>
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
                            textAlign: "center"
                        }}
                    >
                        {`${item.value}`}
                    </Text>
                </View>
            </View>
        );
    };

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

    const playSound = async () => {
        const {sound} = await Audio.Sound.createAsync(
            {uri: profileData?.intro},
            {shouldPlay: true}
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
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let location = await Location.getCurrentPositionAsync({});
        
        if (status !== 'granted') setErrorMsg('...');
        
        const { coords } = location;
        
        if (coords) {
            setLocation(coords);
        }
    };
    getLocation();

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const distance = getDistance(
          { latitude: lat1, longitude: lon1 },
          { latitude: lat2, longitude: lon2 }
        );
      
        // Convert meters to kilometers
        return (distance / 1000).toFixed(2);
      };

      // Example usage:
      const userLocation = { latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }; // Example: Lahore, Pakistan
      const destination = { latitude: parseFloat(profileData?.locationCoordinates?.coordinates[0]), longitude: parseFloat(profileData?.locationCoordinates?.coordinates[1])}; // Some nearby location
    return (
        <SafeAreaView>
            <ImageBackground
                src={
                    (profileData as { photos: string[] })?.photos
                        ? (profileData as { photos: string[] }).photos[0]
                        : null
                }
                resizeMode="cover"
                style={{height: 594, marginTop: 20}}
            >
                <View
                    style={{
                        backgroundColor: AppColors.transparentBlack,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <View style={styles.contentContainer}>
                        <View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text
                                    style={{
                                        fontFamily: "Poppins_500Medium",
                                        color: AppColors.whiteColor,
                                        fontSize: 23,
                                        marginRight: 10,
                                    }}
                                >
                                    {profileData && (profileData as { fullName: string }).fullName
                                        ? (profileData as { fullName: string }).fullName
                                        : ""}
                                    ,{" "}
                                    {profileData && (profileData as { Age: string })?.Age
                                        ? (profileData as { Age: string })?.Age
                                        : ""}
                                </Text>
                                {
                                    profileData && (profileData as { isVerified: boolean }).isVerified &&
                                    <MaterialIcons name="verified" size={24} color="#45A6FF"/>
                                }
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", columnGap: 8}}>
                                {profileData?.proAccount &&
                                    <View style={{
                                        backgroundColor: "#9A8026",
                                        paddingHorizontal: 16,
                                        paddingVertical: 4,
                                        borderRadius: 1000
                                    }}>
                                        <Text
                                            style={{
                                                fontFamily: "Poppins_500Medium",
                                                color: AppColors.whiteColor,
                                                fontSize: 14,
                                            }}>Premium</Text>
                                    </View>}
                                <Text
                                    style={{
                                        fontFamily: "Poppins_500Medium",
                                        color: AppColors.whiteColor,
                                        fontSize: 14,
                                        marginVertical: 10,
                                    }}
                                >
                                    {profileData &&
                                    (profileData as { profession: string }).profession
                                        ? (profileData as { profession: string }).profession
                                        : ""} {", "}
                                    {profileData && (profileData as { location: string }).location
                                        ? (profileData as { location: string }).location
                                        : ""}

                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            {profileData?.video && (
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
                        source={{uri: profileData?.video}}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    />
                </View>
            )}
            <View style={{padding: 15}}>
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        color: AppColors.blackColor,
                        fontSize: 20,
                    }}
                >
                    About me
                </Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {["height", "maritalStatus", "starSign", "children"].map((item) => {
                        return renderAboutMe({item});
                    })}
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
                    style={{width: "100%", height: 40, marginTop: 10}}
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
                {profileData?.intro && <View style={{flexDirection: "row", justifyContent: "center", columnGap: 18}}>
                    
                    <TouchableOpacity
                        onPress={isPlaying ? pauseSound : playSound}
                        style={{
                            height: 50,
                            width: 50,
                            backgroundColor: AppColors.gray_E8E8E8,
                            borderRadius: 1000,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        {isPlaying ? <FontAwesome name={"pause"} size={18} color="black"/> :
                            <FontAwesome name={"play"} size={18} color="black"/>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={stopSound}
                        style={{
                            height: 50,
                            width: 50,
                            backgroundColor: AppColors.red_FF0000,
                            borderRadius: 1000,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <FontAwesome name={"stop"} size={18} color="white"/>
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

                {/* Interests */}
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        color: AppColors.blackColor,
                        fontSize: 20,
                    }}
                >
                    Interests
                </Text>


                <FlatList
                    data={filteredPhotos}
                    renderItem={({item, index}: any) => (
                        <Image
                            style={styles.userImage}
                            src={item}
                            key={index}
                            resizeMode="cover"
                        />
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
                        {justifyContent: "flex-start", marginVertical: 10},
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
                            {calculateDistance(userLocation.latitude, userLocation.longitude, destination.latitude, destination.longitude)+" "}
                            Km away
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
                            
                            {profileData.location}
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
                        {justifyContent: "flex-start", marginVertical: 10},
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
                        {justifyContent: "flex-start", marginVertical: 10},
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
                            {(profileData as { profession: string }).profession}
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


                {/* religiosity */}
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        color: AppColors.blackColor,
                        fontSize: 20,
                        marginTop: 20,
                    }}
                >
                    Religiosity
                </Text>
                <View style={{flex: 1, padding: 10}}>
                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                        {religiosityData.map((item) => renderReligiosity({item}))}
                    </View>
                </View>


                {/* Language & Ethnicity */}
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        color: AppColors.blackColor,
                        fontSize: 20,
                        marginTop: 20,

                    }}
                >
                    Language & Ethnicity
                </Text>
                <View
                    style={[
                        styles.rowContainer,
                        {justifyContent: "flex-start", marginVertical: 10},
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
                            {profileData.location}
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
                            {profileData.ethnicGroup}
                        </Text>
                    </View>
                </View>

                {/* Personality Traits */}
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        color: AppColors.blackColor,
                        fontSize: 20,
                        marginTop: 20,
                    }}
                >
                    Personality Traits
                </Text>
                <View style={{flexDirection: "row", flexWrap: "wrap", padding: 10}}>
                    {profileData?.personalityTraits?.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                padding: 10,
                                paddingHorizontal: 20,
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

                {/* action */}
                <View style={[styles.rowContainer, {alignSelf: "center", flex: 1}]}>
                    <TouchableOpacity style={[styles.buttonContainer, props.buttonStyle]}
                                      onPress={() => navigation.navigate("Boosting",{back:12})}
                    >
                        <Text
                            style={{
                                color: props.disable
                                    ? AppColors.whiteColor
                                    : AppColors.blackColor,
                                fontSize: 16,
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            Boost Profile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonContainer, props.buttonStyle]}>
                        <Text
                            style={{
                                color: props.disable
                                    ? AppColors.whiteColor
                                    : AppColors.blackColor,
                                fontSize: 16,
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            Share Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.whiteColor,
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 15,
        paddingHorizontal: 25,
        borderRadius: 220,
        backgroundColor: AppColors.appThemeColor,
        marginVertical: 20,
        margin: 10,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        width:'auto'
    },
    userImage: {
        borderRadius: 20,
        width: 300,
        height: 400,
        margin: 10,
    },
});

export default ProfileDetails;
