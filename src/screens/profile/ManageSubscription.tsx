import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
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
import Header from "../../components/common/Header";
import globalStyles from "../../styles/globalStyles";

const ManageSubscription = (props: any) => {
  useFonts({ 
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [invoice, setInvoice] = useState([
    { date: "Feb 18, 2024", amount: 9, type: "Monthly", status: "paid" },
    { date: "Feb 18, 2024", amount: 9, type: "Monthly", status: "paid" },
    { date: "Feb 18, 2024", amount: 9, type: "Monthly", status: "paid" },
    { date: "Feb 18, 2024", amount: 9, type: "Monthly", status: "paid" },
  ]);
  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView>
        <Header
          title={"Manage Subscription"}
          backHandler={() => props.navigation.navigate("Settings")}
        />
        <View style={{ padding: 15 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              color: AppColors.blackColor,
              marginVertical: 20,
            }}
          >
            Next Due Date
          </Text>
          <View style={styles.rowContainer}>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: AppColors.blackColor,
              }}
            >
              Feb 18, 2024
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: AppColors.blackColor,
                textDecorationLine: "underline",
              }}
            >
              Cancel Subscription
            </Text>
          </View>

          {/* payment method */}
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              color: AppColors.blackColor,
              marginTop: 50,
              marginVertical: 20,
            }}
          >
            Payment Method
          </Text>
          <View style={[styles.rowContainer, { justifyContent: "flex-start" }]}>
            <Image
              source={AppImages.MASTER_CARD}
              style={{ width: "10%", marginRight: 20 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: AppColors.blackColor,
              }}
            >
              **** ***** **** 42602
            </Text>
          </View>

          {/* billing information */}
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              color: AppColors.blackColor,
              marginVertical: 20,
              marginTop: 50,
            }}
          >
            Billing Information
          </Text>
          <View style={styles.rowContainer}>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: AppColors.blackColor,
              }}
            >
              Email
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: AppColors.blackColor,
              }}
            >
              iamzaibi905@gmail.com
            </Text>
          </View>

          {/* invoice history */}
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              color: AppColors.blackColor,
              marginVertical: 20,
              marginTop: 50,
            }}
          >
            Invoice History
          </Text>
          {invoice.map((item, index) => (
            <View key={index} style={styles.rowContainer}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: AppColors.blackColor,
                }}
              >
                {item.date}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 14,
                  color: AppColors.blackColor,
                }}
              >
                $ {item.amount}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: AppColors.blackColor,
                }}
              >
                {item.type}
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(80, 205, 137, 0.2)",
                  borderRadius: 100,
                  padding: 10,
                  paddingHorizontal: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: "#50CD89",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
          {/* next due date */}
        </View>
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
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
    borderBottomWidth: 0.7,
    borderBottomColor: AppColors.secondaryText,
    paddingBottom: 15,
  },
});

export default ManageSubscription;
