import { Notifications } from 'expo-notifications'; // Assuming you're using Expo for notifications
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

const usePushNotifications = () => {

    useEffect(() => {
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
        console.log('::::::::::::::::::::::::::',remoteMessage);
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
};

export default usePushNotifications;
