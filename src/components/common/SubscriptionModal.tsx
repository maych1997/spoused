import React from 'react'
import { Modal, Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { AppColors } from '../../utility/AppColors';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from "@expo/vector-icons";
import CommonButton from './CommonButton';
import { AppImages } from '../../utility/AppImages';


const SubscriptionModal = ({ openModal, setOpenModal }) => {

    const [select, setSelect] = React.useState(0);

    const handleTerms = async () => {
        const result = await WebBrowser.openBrowserAsync('https://www.getspoused.com/terms');

    }

    const handlePolicy = async () => {
        const result = await WebBrowser.openBrowserAsync('https://www.getspoused.com/privacy');

    }

    const handleSubscription = () => {
        setOpenModal(false);
    }

    const premiumFeatures = [
        "Unlimited Swipes",
        "Travel Mode",
        "Filter By Preferences",
        "Rematch",
        "Rewind",
        "2 Boost",
        "Message Before Matching",
    ];

    return (
        <Modal visible={openModal} transparent={true} animationType="slide">
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
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 }, // Shadow at the top
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    // Elevation for Android
                    elevation: 5,
                }}
            >
                {/* <Ionicons
                    name="close" size={24} color={AppColors.blackColor} style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setOpenModal(false)} /> */}
                <View style={{ paddingHorizontal: 25, marginBottom: 12 }}>
                    <Text
                        style={{
                            fontFamily: "Poppins_700Bold",
                            fontSize: 24,
                            color: AppColors.blackColor,
                            marginTop: 20,
                            textAlign: "center",
                        }}
                    >
                        Find your Spouse faster with Gold
                    </Text>
                    <Ionicons
                    name="close" size={24} color={AppColors.blackColor} style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setOpenModal(false)} />
                    {premiumFeatures.map((item, index) => (
                        <View style={styles.rowContainer} key={index}>
                            <Image source={AppImages.CHECK} style={{ width: 26, height: 23 }} />
                            <Text
                                style={{
                                    fontFamily: "Poppins_500Medium",
                                    fontSize: 14,
                                    color: AppColors.blackColor,
                                    marginLeft: 10,
                                }}
                            >
                                {item}{" "}
                            </Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        {
                            backgroundColor: "#FAFAFA",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 12,
                            padding: 10,
                            paddingHorizontal: 24,
                            marginBottom: 12,
                            marginRight: 12,
                            borderRadius: 22,
                            borderWidth: 1,
                            borderColor: "rgba(0, 0, 0, 0.05)",
                        },
                        select === 0 && {
                            borderColor: AppColors.appThemeColor,
                        },
                    ]}
                    onPress={() => setSelect(0)}
                >
                    <Text style={{ fontSize: 32, fontFamily: "Poppins_600SemiBold" }}>
                        3
                    </Text>

                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium" }}>Months</Text>
                        <Text>$ 44.99</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        {
                            backgroundColor: "#FAFAFA",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 12,
                            padding: 10,
                            paddingHorizontal: 24,
                            marginBottom: 12,
                            marginRight: 12,
                            borderRadius: 22,
                            borderWidth: 1,
                            borderColor: "rgba(0, 0, 0, 0.05)",
                        },
                        select === 1 && {
                            borderColor: AppColors.appThemeColor,
                        },
                    ]}
                    onPress={() => { setSelect(1) }}
                >
                    <Text style={{ fontSize: 32, fontFamily: "Poppins_600SemiBold" }}>
                        1
                    </Text>

                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium" }}>Month</Text>
                        <Text>$ 19.99</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        {
                            backgroundColor: "#FAFAFA",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 12,
                            padding: 10,
                            paddingHorizontal: 24,
                            marginBottom: 12,
                            marginRight: 12,
                            borderRadius: 22,
                            borderWidth: 1,
                            borderColor: "rgba(0, 0, 0, 0.05)",
                        },
                        select === 2 && {
                            borderColor: AppColors.appThemeColor,
                        },
                    ]}
                    onPress={() => setSelect(2)}
                >
                    <Text style={{ fontSize: 32, fontFamily: "Poppins_600SemiBold" }}>
                        1
                    </Text>

                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium" }}>Week</Text>
                        <Text>$ 12.99</Text>
                    </View>
                </TouchableOpacity>
                <CommonButton
                    title={"Subscribe"}
                    pressHandler={handleSubscription}
                />

                <Text style={{ fontSize: 10, color: AppColors.secondaryText, alignSelf: "center" }}>
                    By subscribing you agree to our{' '}
                    <Text
                        style={{ fontWeight: 'bold' }}
                        onPress={handleTerms}>
                        terms and conditions
                    </Text>
                    , and{' '}
                    <Text
                        style={{ fontWeight: 'bold' }}
                        onPress={handlePolicy}>
                        privacy policy
                    </Text>
                    .
                </Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.whiteColor,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default SubscriptionModal
