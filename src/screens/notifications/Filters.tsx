import React, {useState, useEffect} from "react";
import {
    SafeAreaView,
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
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
import {AppColors} from "../../utility/AppColors";
import {Entypo} from "@expo/vector-icons";
import RangeSlider, {Slider} from "react-native-range-slider-expo";
import Filter from "./components/Filter";
import {FULL_HEIGHT} from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import {useRoute} from "@react-navigation/native";
import {useSelector, useDispatch} from "react-redux";
import {addFilterApi} from "../../../api/ProfileCompletion/PostApis/addFilterApi";
import {getFilterApi} from "../../../api/ProfileCompletion/PutApis/getFilterApi";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";

const Filters = (props: any) => {
    const [prefData, setPrefData] = useState("");
    const [ethnicFilter, setEthnicFilter] = useState("");
    const [api, setApi] = useState([{}]); // [{}
    const [genderFilter, setGenderFilter] = useState([]);
    const [heightFilter, setHeightFilter] = useState({});
    const [maritalFilter, setMaritalFilter] = useState("");
    const [childFilter, setChildFilter] = useState("");
    const [educationFilter, setEducationFilter] = useState("");
    const [professionFilter, setProfessionFilter] = useState("");
    const [religionFilter, setReligionFilter] = useState("");
    const [smokeFilter, setSmokeFilter] = useState("");
    const [drinkFilter, setDrinkFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");
    const [traitsFilter, setTraitsFilter] = useState([]);
    const [interestsFilter, setInterestsFilter] = useState({
        sports: [],
        foodanddrinks: [],
        artsandculture: [],
        community: [],
        outdoors: [],
        technology: []
    });
    const [openLimitLocation, setOpenLimitLocation] = useState(false);
    const [ageFilter, setAgeFilter] = useState(18);
    const [ageFilterMax, setAgeFilterMax] = useState(85);
    const [resetAge, setResetAge] = useState(false);
    const [locationOptions, setLocationOptions] = useState(0);
    const {openModal} = useInfoModal();
    const [load,setLoad]=useState(false);
    const reduxState = useSelector((state) => state);

    const showToast = (title: string, message: string) => {
        Toast.show({
            type: 'error',
            position: 'bottom',
            text1: title,
            text2: message,
            visibilityTime: 3500,
            autoHide: true,
            bottomOffset: 40,
        });
    }


    useEffect(() => {
        setLoad(true);
        const fetchPreferences = async () => {
            try {
                const response = await getFilterApi(reduxState.auth.token);
                setApi(response.data);
                const Prefdata = response.data;
                setPrefData(Prefdata);
                setLocationOptions(Prefdata?.partnerPreferences?.limitlocation);
                setEthnicFilter(Prefdata?.partnerPreferences?.ethnicity);
                setGenderFilter(Prefdata?.partnerPreferences?.gender)
                setHeightFilter(Prefdata?.partnerPreferences?.basicInformation?.height);
                setMaritalFilter(Prefdata?.partnerPreferences?.basicInformation?.maritalStatus);
                setChildFilter(Prefdata?.partnerPreferences?.basicInformation?.children);
                setEducationFilter(Prefdata?.partnerPreferences?.educationAndCareer?.education);
                setProfessionFilter(Prefdata?.partnerPreferences?.educationAndCareer?.profession);
                setReligionFilter(Prefdata?.partnerPreferences?.religiosity?.religion);
                setSmokeFilter(Prefdata?.partnerPreferences?.religiosity?.smoke);
                setDrinkFilter(Prefdata?.partnerPreferences?.religiosity?.drink);
                setStarFilter(Prefdata?.partnerPreferences?.religiosity?.starSign);
                setInterestsFilter(Prefdata?.partnerPreferences?.interestsAndPersonality?.interests);
                setTraitsFilter(Prefdata?.partnerPreferences?.interestsAndPersonality?.personalityTraits);
                
                setLoad(false);
                // You can use the profile data in your component logic here...
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchPreferences(); // Call the fetchData function when the component mounts
    }, []);

    useFonts({
        Poppins_100Thin,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
    });

    const handleSearch = async () => {
        try {

            const response = await addFilterApi(
                {
                    // interestedIn: genderFilter,
                    partnerPreferences: {
                        limitlocation: locationOptions,
                        gender: genderFilter,
                        ageRange: {
                            min: ageFilter,
                            max: ageFilterMax,
                        },
                        ethnicity: ethnicFilter,
                        basicInformation: {
                            height: {
                                fromCm: heightFilter.fromCm,
                                toCm: heightFilter.toCm,
                                fromFt: heightFilter.fromFt,
                                toFt: heightFilter.toFt,
                            },
                            maritalStatus: maritalFilter,
                            children: childFilter,
                        },
                        educationAndCareer: {
                            education: educationFilter,
                            profession: professionFilter,
                        },
                        religiosity: {
                            religion: religionFilter,
                            smoke: smokeFilter,
                            drink: drinkFilter,
                            starSign: starFilter,
                        },
                        interestsAndPersonality: {
                            interests: interestsFilter,
                            personalityTraits: traitsFilter,
                        },
                    },
                },
                reduxState.auth.user.id,
                reduxState.auth.token
            );

            if (response.success) {
                props.navigation.navigate("Home");
            } else {
                console.error("Error: ", response.message);
            }
        } catch (error) {
            console.error("Error occurred during filter addition: ", error);
        }
    };

    const handleClearAll = () => {
        // set the values coming from api to the default values
        setPrefData(api);
        setLocationOptions(api?.partnerPreferences?.limitlocation);
        setEthnicFilter(api?.partnerPreferences?.ethnicity);
        setGenderFilter(api?.partnerPreferences?.gender)
        setHeightFilter(api?.partnerPreferences?.basicInformation?.height);
        setMaritalFilter(api?.partnerPreferences?.basicInformation?.maritalStatus);
        setChildFilter(api?.partnerPreferences?.basicInformation?.children);
        setEducationFilter(api?.partnerPreferences?.educationAndCareer?.education);
        setProfessionFilter(api?.partnerPreferences?.educationAndCareer?.profession);
        setReligionFilter(api?.partnerPreferences?.religiosity?.religion);
        setSmokeFilter(api?.partnerPreferences?.religiosity?.smoke);
        setDrinkFilter(api?.partnerPreferences?.religiosity?.drink);
        setStarFilter(api?.partnerPreferences?.religiosity?.starSign);
        setInterestsFilter(api?.partnerPreferences?.interestsAndPersonality?.interests);
        setTraitsFilter(api?.partnerPreferences?.interestsAndPersonality?.personalityTraits);
        setAgeFilter(api?.partnerPreferences?.ageRange?.min);
        setAgeFilterMax(api?.partnerPreferences?.ageRange?.max);
    }

    return (
        <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
            {load?<></>:<><ScrollView>
                <View style={[styles.rowContainer, {padding: 15}]}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Home")}
                        style={styles.iconContainer}
                    >
                        <Entypo name="cross" size={24} color="black"/>
                    </TouchableOpacity>
                    <Text style={[styles.titleText, {fontFamily: "Poppins_700Bold"}]}>
                        Filters
                    </Text>
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={[styles.lightText, {fontFamily: "Poppins_500Medium"}]}>
                            Clear all
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* age */}
                <View style={{padding: 15}}>
                    <View style={[styles.rowContainer, {marginTop: 35}]}>
                        <Text
                            style={[styles.standardText, {fontFamily: "Poppins_700Bold"}]}
                        >
                            Age
                        </Text>
                        <Text
                            style={[
                                styles.standardText,
                                {fontFamily: "Poppins_400Regular"},
                            ]}
                        >
                            {ageFilter === 18 && ageFilterMax === 85 ?
                                "Any Age" :
                                ageFilter + " - " + ageFilterMax + " years"
                            }
                        </Text>
                    </View>
                    <RangeSlider
                        toKnobColor={AppColors.appThemeColor}
                        fromKnobColor={AppColors.appThemeColor}
                        min={ageFilter}
                        max={ageFilterMax}
                        fromValueOnChange={(value) => setAgeFilter(value)}
                        toValueOnChange={(value) => setAgeFilterMax(value)}
                        initialFromValue={prefData?.partnerPreferences?.ageRange?.min}
                        initialToValue={prefData?.partnerPreferences?.ageRange?.max}
                        barHeight={4}
                        showValueLabels={true}
                        showRangeLabels={false}
                    />
                    {/* filters */}
                    <Filter
                        title={"Limit Location by"}
                        content={locationOptions + " Miles"}
                        pressHandler={() => {
                            setOpenLimitLocation(true)
                        }}
                    />
                    <Filter
                        title={"Ethnicity"}
                        content={ethnicFilter}
                        pressHandler={() => {
                            props.navigation.navigate("Ethnicity", {back: 2, setEthnicFilter, ethnicFilter})
                        }
                        }
                    />
                    <Filter
                        title={"Select Gender"}
                        content={genderFilter.join(", ")}
                        pressHandler={() =>
                            props.navigation.navigate("DatingPreference", {back: 2, setGenderFilter, genderFilter})
                        }
                    />
                </View>

                {/* advanced filters */}
                <View style={styles.advancedFilters}>
                    <Text
                        style={{
                            fontFamily: "Poppins_700Bold",
                            color: AppColors.blackColor,
                            fontSize: 18,
                            marginBottom: 43,
                            marginTop: 20,
                        }}
                    >
                        Advance Filters
                    </Text>
                    <Text
                        style={[
                            styles.advanceFilterTitle,
                            {
                                fontFamily: "Poppins_700Bold",
                            },
                        ]}
                    >
                        Basic Information
                    </Text>
                    <Filter
                        title={"Height"}
                        content={heightFilter?.fromCm + " cm" + " (" + heightFilter?.fromFt + ")" + " - " + heightFilter?.toCm + " cm" + " (" + heightFilter?.toFt + ")"}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Height", {back: 2, setHeightFilter, heightFilter})
                        }
                    />
                    <Filter
                        title={"Marital Status"}
                        content={maritalFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("MaritalStatus", {back: 2, setMaritalFilter, maritalFilter})
                        }
                    />
                    <Filter
                        title={"Children"}
                        content={childFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Children", {back: 2, setChildFilter, childFilter})
                        }
                    />

                    <Text
                        style={[
                            styles.advanceFilterTitle,
                            {
                                fontFamily: "Poppins_700Bold",
                            },
                        ]}
                    >
                        Education & Career
                    </Text>
                    <Filter
                        title={"Education"}
                        content={educationFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Education", {back: 2, setEducationFilter, educationFilter})
                        }
                    />
                    <Filter
                        title={"Profession"}
                        content={
                            professionFilter
                        }
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Profession", {back: 2, setProfessionFilter, professionFilter})
                        }
                    />

                    <Text
                        style={[
                            styles.advanceFilterTitle,
                            {
                                fontFamily: "Poppins_700Bold",
                            },
                        ]}
                    >
                        Religiosity
                    </Text>
                    <Filter
                        title={"Religion"}
                        content={religionFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Religion", {back: 2, setReligionFilter, religionFilter})
                        }
                    />
                    <Filter
                        title={"Smoke?"}
                        content={smokeFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Smoke", {back: 2, setSmokeFilter, smokeFilter})
                        }
                    />
                    <Filter
                        title={"Drink?"}
                        content={drinkFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Drink", {back: 2, setDrinkFilter, drinkFilter})
                        }
                    />
                    <Filter
                        title={"Star Sign"}
                        content={starFilter}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("StarSign", {back: 2, setStarFilter, starFilter})
                        }
                    />

                    <Text
                        style={[
                            styles.advanceFilterTitle,
                            {
                                fontFamily: "Poppins_700Bold",
                            },
                        ]}
                    >
                        Interests & Personality
                    </Text>
                    <Filter
                        title={"Interests"}
                        content={
                            Object.values(interestsFilter).flat().length === 0
                                ? "No Preference"
                                : (() => {
                                    const allInterests = Object.values(interestsFilter).flat();
                                    return allInterests.length > 3
                                        ? `${allInterests.slice(0, 3).join(', ')} and ${allInterests.length - 3} more`
                                        : allInterests.join(', ');
                                })()
                        }
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("Interests", {back: 2, setInterestsFilter, interestsFilter})
                        }
                    />
                    <Filter
                        title={"Personality Traits"}
                        content={(() => {
                            if (traitsFilter.length === 0) {
                                return "No Preference";
                            } else if (traitsFilter.length > 4) {
                                return traitsFilter.slice(0, 4).join(", ") + ", ...";
                            } else {
                                return traitsFilter.join(", ");
                            }
                        })()}
                        isWhite={true}
                        pressHandler={() =>
                            props.navigation.navigate("PersonalityTraits", {back: 2, setTraitsFilter, traitsFilter})
                        }
                    />
                </View>
            </ScrollView>
            <Modal visible={openLimitLocation} transparent={true}>

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
                    <View style={[styles.rowContainer, {
                        marginTop: 20,
                        marginBottom: 10,
                    }]}>
                        <Text
                            style={{
                                fontFamily: "Poppins_700Bold",
                                fontSize: 24,
                                color: AppColors.blackColor,
                            }}
                        >
                            Limit Location By
                        </Text>
                    </View>
                    <Slider min={40} max={800} step={1}
                            valueOnChange={value => setLocationOptions(value)}
                            initialValue={prefData?.partnerPreferences?.limitlocation}
                            knobColor={AppColors.appThemeColor}
                            valueLabelsBackgroundColor='black'
                    />


                    <Text
                        onPress={() => {
                            setOpenLimitLocation(false)
                            openModal("Filters Saved!", "Filters changed successfully", "Okey", "success");
                        }}
                        style={{
                            fontFamily: "Poppins_700Bold",
                            textAlign: "center",
                            fontSize: 16,
                            color: AppColors.blackColor,
                            marginVertical: 20,
                        }}
                    >
                        Close
                    </Text>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={handleSearch}
                style={{
                    backgroundColor: AppColors.appThemeColor,
                    height: 60,
                    width: "80%",
                    alignSelf: "center",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginVertical: 20,
                }}
            >
                <Text
                    style={{
                        textAlign: "center",
                        color: "black",
                        marginTop: 20,
                        fontWeight: "bold",
                        fontSize: 16,
                    }}
                >
                    Search
                </Text>
            </TouchableOpacity></>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.whiteColor,
    },
    overlay: {
        margin: 0,
        backgroundColor: AppColors.transparentBlack,
        width: "100%",
        height: FULL_HEIGHT,
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
    menuOptionContainer: {
        backgroundColor: AppColors.greyFill,
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 7,
    },
});

export default Filters;
