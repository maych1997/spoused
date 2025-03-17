import React, {useState} from "react";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
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
import {AppColors} from "../../../utility/AppColors";
import {horizontalScale, scaleFontSize, verticalScale} from "@/styles/scaling";
import {red} from "colorette";
import {blue} from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const PlanOverview = (props) => {
    useFonts({
        Poppins_100Thin,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
    });

    const handleUpgradePress = () => {
        props.navigation.navigate("PremiumPlan");
    };

    const renderItem = (title, description, buttonLabel, value) => (
        <View style={styles.contentContainer}>
                <Text style={styles.titleText}>
                    {props.user?.proAccount ? "Unlimited" : String(value).padStart(2, '0')}
                </Text>
            <Text style={styles.subtitleText}>{title}</Text>
            <View style={{width: horizontalScale(120), height: verticalScale(50), justifyContent: "center"}}>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
            <View style={styles.buttonPro}>
                <TouchableOpacity style={styles.button} onPress={handleUpgradePress}>
                    <Text style={styles.buttonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>

        </View>
    );

    return (
        <View style={styles.container}>
            {renderItem(
                "Likes Remaining",
                "Get unlimited likes with Premium",
                "Upgrade",
                props.user?.likes
            )}
            {renderItem(
                "Instant Chats",
                "Get unlimited instant Chats with Premium",
                "Upgrade",
                props.user?.instantChats
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        margin: 15,
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
    },
    contentContainer: {
        backgroundColor: AppColors.greyFill,
        flex: 1,
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius: 10,
        justifyContent: "center",
    },
    buttonPro: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        fontFamily: "Poppins_700Bold",
        color: AppColors.blackColor,
        fontSize: 24,
    },
    subtitleText: {
        fontFamily: "Poppins_500Medium",
        color: AppColors.blackColor,
        fontSize: scaleFontSize(14),
    },
    descriptionText: {
        fontFamily: "Poppins_500Medium",
        color: AppColors.secondaryText,
        fontSize: scaleFontSize(13),
        textAlign: "left"
    },
    button: {
        backgroundColor: "#A17900",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        padding: 10,
        width:'100%'
    },
    buttonText: {
        fontFamily: "Poppins_600SemiBold",
        color: AppColors.whiteColor,
        fontSize: 14,
        
    },
});

export default PlanOverview;
