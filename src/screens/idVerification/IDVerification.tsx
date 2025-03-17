import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import { AppImages } from "../../utility/AppImages";
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
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import { RouteProp, useRoute } from "@react-navigation/native";
interface RouteParams {
    currentFlow: number;
}
const IDVerification = (props: any) => {
    useFonts({
        Poppins_100Thin,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
    });
    const [boostEnd, setBoostEnd] = useState({
        hours: "23",
        minutes: "45",
        seconds: "01",
    });
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const { currentFlow } = route.params;
    return (
        <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
            <ScrollView style={{ padding: 15 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: currentFlow == 1 ? "flex-end" : "space-between",
                        alignItems: "center",
                    }}
                >
                    {
                        currentFlow !== 1 && (
                            <MaterialIcons
                                onPress={() => props.navigation.navigate("Profile")}
                                name="cancel"
                                size={34}
                                color="white"
                                style={{ margin: 5 }}
                            />
                        )}
                    {/*{currentFlow === 1 && (*/}
                    {/*    <TouchableOpacity*/}
                    {/*        onPress={() => props.navigation.navigate("AddPhotos")}*/}
                    {/*        style={{*/}
                    {/*            backgroundColor: AppColors.whiteColor,*/}
                    {/*            paddingHorizontal: 20,*/}
                    {/*            paddingVertical: 8,*/}
                    {/*            alignItems: "center",*/}
                    {/*            justifyContent: "center",*/}
                    {/*            borderRadius: 200,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Text*/}
                    {/*            style={{*/}
                    {/*                fontFamily: "Poppins_600SemiBold",*/}
                    {/*                color: AppColors.blackColor,*/}
                    {/*                fontSize: 14,*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            Skip*/}
                    {/*        </Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*)}*/}
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 50,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Poppins_700Bold",
                            fontSize: 24,
                            color: AppColors.blackColor,
                        }}
                    >
                        Verify your Profile!
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Poppins_500Medium",
                            fontSize: 14,
                            color: AppColors.secondaryText,
                            marginVertical: 20,
                        }}
                    >
                        Scan your ID and take a selfie to prove your identity
                    </Text>
                    <Image
                        source={AppImages.VERIFY_PROFILE}
                        style={{ marginTop: 20, height: 261, width: 261, marginBottom: 30 }}
                        resizeMode="cover"
                    />

                    {/* benefits */}
                    <View style={styles.contentContainer}>
                        <Text
                            style={{
                                fontFamily: "Poppins_500Medium",
                                fontSize: 14,
                                color: AppColors.blackColor,
                            }}
                        >
                            Verification blue badge on your profile
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text
                            style={{
                                fontFamily: "Poppins_500Medium",
                                fontSize: 14,
                                color: AppColors.blackColor,
                            }}
                        >
                            Get 47% more matches
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text
                            style={{
                                fontFamily: "Poppins_500Medium",
                                fontSize: 14,
                                color: AppColors.blackColor,
                            }}
                        >
                            Be seen and liked by more members
                        </Text>
                    </View>
                    <Text
                        style={[{ fontFamily: "Poppins_400Regular" }, styles.lightText]}
                    >
                        your ID and selfie is only for verification. we do not take copies
                        of it.
                    </Text>

                    {/* get more boosts */}
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("ConfirmIdentity" , {currentFlow: currentFlow})}
                        style={{
                            backgroundColor: AppColors.blackColor,
                            padding: 15,
                            borderRadius: 220,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 20,
                            marginTop: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Poppins_700Bold",
                                fontSize: 16,
                                color: AppColors.whiteColor,
                            }}
                        >
                            Get ID Verified
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appThemeColor,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        justifyContent: "space-between",
        paddingBottom: 15,
    },
    lightText: {
        color: AppColors.secondaryText,
        textAlign: "center",
        marginVertical: 10,
    },
    contentContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: 12,
        paddingHorizontal: 25,
        borderRadius: 100,
        marginVertical: 5,
    },
});

export default IDVerification;
