import React, {useState, useEffect} from "react";
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    FlatList,
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
import {AppColors} from "../../utility/AppColors";
import {AppImages} from "../../utility/AppImages";
import LikesHeader from "./components/LikesHeader";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ScrollView} from "react-native-virtualized-view";
import {FontAwesome5} from "@expo/vector-icons";
import UserAction from "./components/UserAction";
import {FontAwesome} from "@expo/vector-icons";
import {FULL_WIDTH} from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import {getSingleProfileApi} from "../../../api/ProfileCompletion/GetApis/getSingleProfileApi";
import {useSelector, useDispatch} from "react-redux";
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import CountryFlag from "react-native-country-flag";
import {useRoute} from "@react-navigation/native";
import {saveSwipesApi} from "../../../api/UserMatches/PostApis/saveSwipesApi";
import {instantChatApi} from "../../../api/UserMatches/PostApis/instantChatApi";
import {updatemyprofile} from "../../../redux/authSlice";
import SubscriptionModal from "../../components/common/SubscriptionModal";
import {blockUserApi} from "../../../api/ProfileCompletion/PostApis/blockUserApi";
import {Video} from "expo-av";
import Slider from "@react-native-community/slider";
import {Audio} from "expo-av";

const UserDetail = (props) => {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const {user_id, likes} = route.params;
    const dispatch = useDispatch();
    const reduxState = useSelector((state) => state);
    const [openModal, setOpenModal] = useState(false);

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
        return roundedDistance;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSingleProfileApi(user_id, reduxState.auth.token);
                setMyCoordinates(reduxState?.auth?.user?.myprofile?.locationCoordinates?.coordinates)
                const profileData = response.data;
                setProfileData(profileData);
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

    const renderAboutMe = ({item}: any) => {
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
        {key: "Religion", value: profileData.religion},
        {
            key: "Smoking",
            value: profileData.smoking === "No" ? "Non-smoker" : "Smoker",
        },
        {
            key: "Drink",
            value: profileData.drink === "No" ? "Non-drinker" : "Drinker",
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
                            textAlign: "center",
                        }}
                    >
                        {`${item.value}`}
                    </Text>
                </View>
            </View>
        );
    };

    const dislikeHandler = async () => {
        try {
            const res = await saveSwipesApi(
                profileData._id,
                "dislike",
                reduxState.auth.token
            );
            if (res.success) {
                props.navigation.navigate("like")
            }
        } catch (error) {
            console.log('error in the save swipe userdetails line 214');

            console.error("Error saving swipe:", error);
        }
    }

    const matchHandler = async () => {
        try {
            const res = await saveSwipesApi(
                profileData._id,
                "like",
                reduxState.auth.token
            );
            if (res.success) {
                props.navigation.navigate("Match")
            }
        } catch (error) {
            console.log('error in the save swipe userdetails line 231');
            console.error("Error saving swipe:", error);
        }


    }

    const messageHandler = async () => {
        try {
            const res = await instantChatApi(profileData?._id, reduxState.auth.token);

            if (res.success) {
                dispatch(updatemyprofile(res.user));
                props.navigation.navigate("ChatScreen", {user: res?.swipedUser, conversation: res?.chat?._id})
            } else {
                setOpenModal(true);
            }

        } catch (error) {
            console.error("Error instant chat:", error);
        }
    }

    const Block = async () => {
        try {
            const res = await blockUserApi(profileData?._id, reduxState.auth.token);

            if (res.success) {
                props.navigation.navigate("like")
            }
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    }
    const backHandler = () => {
        props.navigation.navigate("Home");
    };

    return (
        <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
            <ScrollView>
                <LikesHeader likeCount={likes} screenName="userDetail"
                             filterHandler={() => props.navigation.navigate("Filters")}
                             backhandler={() =>  props.navigation.navigate("like")} position="right"/>
                <ImageBackground
                    src={profileData?.photos ? profileData.photos[0] : null}
                    resizeMode="cover"
                    style={{
                        width: FULL_WIDTH,
                        marginTop: 20,
                        height: 530,
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
                                (profileData as { profession: string }).profession
                                    ? (profileData as { profession: string }).profession
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
                                            isoCode={getCountryName(profileData?.location) || getCountryName('Afghanistan')}
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
                                        )}{" "}
                                    miles away
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => props.navigation.navigate("ChatScreen")}
                        >
                            <MaterialCommunityIcons
                                name="message-text"
                                size={24}
                                color={AppColors.whiteColor}
                            />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
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
                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                        {["height", "maritalStatus", "starSign", "children"].map((item) => {
                            return renderAboutMe({item});
                        })}
                    </View>

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
                    <View style={{flexDirection: "row", flexWrap: "wrap", padding: 10}}>
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
                        data={(profileData as { photos: string[] }).photos}
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
                    <View style={{flex: 1, padding: 5}}>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {religiosityData.map((item) => renderReligiosity({item}))}
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
                                {(profileData as { education: string })?.education}
                            </Text>
                        </View>
                    </View>

                    {/* Country & Ethnicity */}
                    <Text
                        style={{
                            fontFamily: "Poppins_700Bold",
                            color: AppColors.blackColor,
                            fontSize: 20,
                            marginTop: 20,
                        }}
                    >
                        Country & Ethnicity
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

                    {/* action */}
                    <UserAction matchHandler={matchHandler} dislikeHandler={dislikeHandler}
                                messageHandler={messageHandler}/>
                    <View
                        style={[styles.rowContainer, {width: "100%", alignSelf: "center", justifyContent: "center"}]}
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
                        <FontAwesome name="circle" size={10} color="black"/>
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
            <SubscriptionModal openModal={openModal} setOpenModal={setOpenModal}/>

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
        flexWrap:'wrap'
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
        margin: 10,
    },
});

export default UserDetail;
