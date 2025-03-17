import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, Text, SectionList } from "react-native";
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
import Header from "../../components/common/Header";
import Notification from "./components/notification";
import globalStyles from "../../styles/globalStyles";
import { useSelector } from "react-redux";
import { GetNotificationsApi } from "../../../api/Auth/PostApis/GetNotificationsApi";
import moment from 'moment';

const Notifications = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [notifications, setNotifications] = useState([]);
  const reduxState = useSelector((state: any) => state);

  const getNotifications = async () => {
    try {
      const res = await GetNotificationsApi(reduxState.auth.token)

      console.log(res);
      
      if (res.success) {
        setNotifications(res.notifications)
      }
    } catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const groupNotificationsByDay = (notifications) => {
    return notifications.reduce((groups, notification) => {
        const date = moment(notification.createdAt).format('YYYY-MM-DD') // Format the date
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(notification)
        return groups
    }, {})
}

  const groupedNotifications = groupNotificationsByDay(notifications)
  const sections = Object.keys(groupedNotifications).map((date) => ({
        title: date === moment().format('YYYY-MM-DD') ? 'Today' : moment(date).format('DD MMM'),
        data: groupedNotifications[date],
    }))
  

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView>
        <Header
          title={"Notifications"}
          backHandler={() => props.navigation.navigate("Home")}
        />
        <View style={{ padding: 15 }}>
          {
            notifications.length === 0 ? <Text>No notifications</Text> :
          // notifications.map((item, index) => (
          //   <Notification index={index} notification={item} />
          // ))
          <SectionList
          sections={sections}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item, index }) => (
            <Notification index={index} notification={item} />
          )}
          renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 10 }}>
                  {title}
              </Text>
          )}
      />
          }
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
  titleText: {
    color: AppColors.blackColor,
    fontSize: 14,
    marginTop: 40,
  },
});

export default Notifications;
