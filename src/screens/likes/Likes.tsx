import React, {useState, useEffect, useCallback} from "react";
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
    ImageBackground,
    Image,
    Alert,
    RefreshControl,
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
import LikesHeader from "./components/LikesHeader";
import {AppImages} from "../../utility/AppImages";
import {ScrollView} from "react-native-virtualized-view";
import {FULL_HEIGHT, FULL_WIDTH} from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import {getLikedMatchesApi} from "../../../api/UserMatches/GetApis/getLikedMatchesApi";
import {useSelector, useDispatch} from "react-redux";
import {getSingleProfileApi} from "../../../api/ProfileCompletion/GetApis/getSingleProfileApi";
import CountryFlag from "react-native-country-flag";
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import {TouchableOpacity} from "react-native-gesture-handler";
import {useFocusEffect} from "@react-navigation/native";
import CommonButton from "../../components/common/CommonButton";
import {addImageUser} from "../../../redux/authSlice";

countries.registerLocale(en);

const Likes = (props) => {
    useFonts({
        Poppins_100Thin,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
    });


    const getCountryName = (country) => {
        return countries.getAlpha2Code(country, 'en');
    };

    const dispatch = useDispatch();
    const reduxState = useSelector((state) => state);

    const [profileData, setProfileData] = useState([]); // Initial state of profileData is an empty array
    const [refreshing, setRefreshing] = useState(false);
    const [imageProfile, setImageProfile] = useState([]);
    const [count, setCount] = useState(0);
    const fetchData = React.useCallback(async () => {
        console.log("Fetching data...");
        try {
            const response = await getLikedMatchesApi(reduxState.auth.token);
            if (response.users) {
                setProfileData(response.users);
                setCount(response.count);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setRefreshing(false);
        }
    }, [reduxState.auth.token]); // Dependency array ensures it only changes when the token changes
    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]); // Ensures `onRefresh` remains stable
    
    // Call fetchData only once when the component mounts
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    async function fetchImageAsBase64(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onerror = () => {
                    reader.abort();
                    reject(new Error("Problem reading the image blob."));
                };

                reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]); // Get base64 part after comma
                };

                reader.readAsDataURL(blob); // Convert blob to base64
            });
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    }


    useFocusEffect(
        useCallback(() => {
            fetchData(); // Call the fetchData function when the screen is focused
            for (let i = 0; i < profileData.length; i++) {
                fetchImageAsBase64(profileData[i]?.photo)
                    .then(base64String => {
                        updateProfileData(i, `data:image/png;base64,${base64String}`)
                    })
                    .catch(error => {
                        console.error("Error fetching image:", error);
                    });
            }
        }, [reduxState.auth.token])
    );

    const updateProfileData = (index, photo) => {
        let updateItem = [...profileData];
        updateItem[Number(index)].photo = photo;
        setImageProfile(updateItem);

    }
    const renderLikedUser = ({item}) => {
        for(let i = 0; i < imageProfile.length; i++){
            if(item._id === imageProfile[i]._id){
                if (item.photo != imageProfile[i].photo){
                    item.photo = imageProfile[i].photo;
                }
            }

        }

        return (
            <TouchableOpacity style={{borderRadius: 10,}} activeOpacity={0.9} onPress={() => {
                props.navigation.navigate("UserDetail", {
                    user_id: item._id,
                    likes: count,
                })
            }}>
                <ImageBackground
                    resizeMode="cover"
                    imageStyle={{
                        borderRadius: 10,
                    }}
                    source={{uri: item.photo}}
                    style={{
                        width: (FULL_WIDTH - 80) / 2,
                        height: (FULL_HEIGHT - 350) / 2,
                        margin: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            height: "100%",
                            width: "100%",
                            borderRadius: 10,
                        }}
                    >
                        <View
                            style={[
                                styles.rowContainer,
                                {margin: 12, marginVertical: 10},
                            ]}
                        >
                            {item.justJoined && (
                                <View
                                    style={{
                                        backgroundColor: AppColors.appThemeColor,
                                        padding: 7,
                                        paddingHorizontal: 10,
                                        borderRadius: 100,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Poppins_500Medium",
                                            fontSize: 10,
                                            color: AppColors.blackColor,
                                        }}
                                    >
                                        Just Joined
                                    </Text>
                                </View>
                            )}
                            <View style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                height: 25,
                                width: 25,
                                borderRadius: 500,
                                overflow: "hidden",
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <CountryFlag isoCode={getCountryName(item?.location) || getCountryName('Afghanistan')}
                                             size={25}/>
                            </View>
                        </View>
                        <View style={{position: "absolute", bottom: 10, left: 10}}>
                            <Text
                                style={{
                                    fontFamily: "Poppins_700Bold",
                                    fontSize: 16,
                                    color: AppColors.whiteColor,
                                }}
                            >
                                {item.fullName}, {item.age}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Poppins_400Regular",
                                    fontSize: 12,
                                    color: AppColors.whiteColor,
                                    marginVertical: 5,
                                }}
                            >
                                {item.profession}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Poppins_500Medium",
                                    fontSize: 10,
                                    color: AppColors.whiteColor,
                                }}
                            >
                                {item.location}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Poppins_500Medium",
                                    fontSize: 10,
                                    color: "rgba(255, 255, 255, 0.5)",
                                }}
                            >
                                {item.timeOfLike}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
            <ScrollView style={{padding: 15}} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }>
                <LikesHeader
                    likeCount={count}
                    filterHandler={() => props.navigation.navigate("Filters")}
                    position="default"
                />
                {count === 0 ?
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: FULL_HEIGHT - 200,
                            paddingHorizontal: 30,
                        }}
                    >
                        <Image
                            style={{width: 64, height: 64}}
                            source={AppImages.YELLOW_HEART}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontFamily: "Poppins_600SemiBold",
                                fontSize: 16,
                                color: AppColors.blackColor,
                                marginVertical: 10,
                            }}
                        >
                            Liked You
                        </Text>
                        <Text
                            style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: 14,
                                color: AppColors.secondaryText,
                                marginVertical: 10,
                                textAlign: "center",
                            }}
                        >
                            People who liked you will appear here.
                        </Text>

                        <CommonButton title={"Try boosting your profile"}
                                      pressHandler={() => props.navigation.navigate("Boosting",{back:13})}/>

                    </View>
                    :

                    <>
                        <Text
                            style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: 14,
                                color: AppColors.secondaryText,
                                marginVertical: 30,
                            }}
                        >
                            These people are willing to chat with you. Like them to start a
                            conversation.
                        </Text>
                        <FlatList
                            data={profileData}
                            renderItem={renderLikedUser}
                            numColumns={2}
                            keyExtractor={(item) => item._id}
                        />
                    </>
                }
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
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconContainer: {
        backgroundColor: AppColors.appThemeColor,
        width: 45,
        height: 45,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
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
    advancedFilters: {
        backgroundColor: "rgba(161, 121, 0, 0.1)",
        padding: 15,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    advanceFilterTitle: {
        color: "rgba(161, 121, 0, 1)",
        marginVertical: 10,
        fontSize: 14,
    },
});

export default Likes;
