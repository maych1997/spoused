import "./global.css";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
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
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { persistor, store } from "./redux/store";
import Toast from "react-native-toast-message";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import "expo-dev-client";
import NetInfo from "@react-native-community/netinfo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider } from "./src/context/ModalContext";
import { RevenueCatProvider } from "@/Providers/RevenueCatProvider";
import usePushNotifications from './src/Providers/usePushNotifications';

LogBox.ignoreAllLogs(true);

LogBox.ignoreLogs(["Warning: ...", "VirtualizedLists should never be nested"]);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // usePushNotifications();
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const requestUserPermissionMessaging = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    requestUserPermissionMessaging();
    const requestUserPermission = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission not granted');
        } else {
          console.log('Notification permission granted');
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    };
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
      };

      // Schedule the notification with a null trigger to show immediately
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    });

    const handlePushNotification = async (remoteMessage) => {
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
      };
      console.log('This is a remote message ::::::::::::::::::::::::::',remoteMessage);
      // Schedule the notification with a null trigger to show immediately
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    };

    requestUserPermission();


    // Listen for push notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(handlePushNotification);

    // Clean up the event listeners
    return () => {
      unsubscribe();
      // notificationClickSubscription.remove();
    };
  }, []);

  return (
    <RevenueCatProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <BottomSheetModalProvider>
                <ModalProvider>
                  <RootNavigator />
                  {/* <TestPage /> */}
                  <Toast />
                </ModalProvider>
              </BottomSheetModalProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </RevenueCatProvider>
  );
}
