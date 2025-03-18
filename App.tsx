import "./global.css";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";
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
import usePushNotifications from "./src/Providers/usePushNotifications";
import eventEmitter from "./src/Events/EventEmitter";
import { rem } from "nativewind";
import useAgoraAudio from "@/screens/chat/components/AudioCallUiKit/hook";

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
  const [remoteMessage,setRemoteMessage]=useState();
  
  // const {joinChannel}=useAgoraAudio(JSON.stringify(remoteMessage?.notification?.body)?.appId,JSON.stringify(remoteMessage?.notification.body)?.channelId,JSON.stringify(remoteMessage?.notification.body)?.token);


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
    const getToken=async ()=> {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    }
    getToken();
        requestUserPermissionMessaging();
    const requestUserPermission = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Notification permission not granted");
        } else {
          console.log("Notification permission granted");
        }
      } catch (error) {
        console.error("Permission request error:", error);
      }
    };
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage.notification.title != "Call") {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }else{
          console.log('I am remote Message;:::::::::::::::::::',remoteMessage);
          CallNotify(remoteMessage);
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage.notification.title != "Call") {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage.notification
        );
      }else{
        CallNotify(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage.notification.title != "Call") {
        const notification = {
          title: remoteMessage.notification.title,
          body: JSON.parse(remoteMessage.notification.body).text,
          data: remoteMessage.data, // optional data payload
        };

        // Schedule the notification with a null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      }else{
        console.log('I am remote Message;:::::::::::::::::::',remoteMessage);

        CallNotify(remoteMessage);
      }
    });

    const handlePushNotification = async (remoteMessage) => {
      if (remoteMessage.notification.title != "Call") {
        const notification = {
          title: remoteMessage.notification.title,
          ody: JSON.parse(remoteMessage.notification.body).text,
          data: remoteMessage.data, // optional data payload
        };
        console.log(
          "This is a remote message ::::::::::::::::::::::::::",
          remoteMessage
        );
        // Schedule the notification with a null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      }else{
        console.log('I am remote Message;:::::::::::::::::::',remoteMessage);

        CallNotify(remoteMessage);
      }
    };

    // const handleAnswer = async () => {
    //   await joinChannel();
    // };


    // // Listen for call answer event
    // RNNotificationCall.addEventListener("answer", handleAnswer);

    requestUserPermission();
    const unsubscribe = messaging().onMessage(handlePushNotification);
    // Add event listener

    // Clean up the event listeners
    return () => {
      unsubscribe();
      // notificationClickSubscription.remove();
    };
  }, []);

  const CallNotify=(remoteMessage)=>{
    setRemoteMessage(remoteMessage);
    RNNotificationCall.displayNotification(
      '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
      null,
      30000,
      {
        channelId: JSON.parse(remoteMessage.notification.body).channelName,
        channelName: JSON.parse(remoteMessage.notification.body).channelName.includes('voice')?'Incoming Audio Call':'Incoming Video Call',
        notificationIcon: 'ic_launcher', // mipmap
        notificationTitle: 'Linh Vo',
        notificationBody: 'Incoming Audio call',
        answerText: 'Answer',
        declineText: 'Decline',
        notificationColor: 'colorAccent',
        isVideo: JSON.parse(remoteMessage.notification.body).channelName.includes('voice')?false:true,
        notificationSound: null, // raw
        // mainComponent: 'MyReactNativeApp', // AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
        // payload: { name: 'Test', body: 'test' }
      }
    );
  }

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
