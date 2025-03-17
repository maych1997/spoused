import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home/Home";
import Notifications from "../screens/notifications/Notifications";
import Filters from "../screens/notifications/Filters";
import UserDetail from "../screens/home/UserDetail";
import Profile from "../screens/profile/Profile";
import ConfirmID from "../screens/idVerification/ConfirmID";
import ConfirmIdentity from "../screens/idVerification/ConfirmIdentity";
import FrameFace from "../screens/idVerification/FrameFace";
import IDVerification from "../screens/idVerification/IDVerification";
import UnderReview from "../screens/idVerification/UnderReview";
import UploadID from "../screens/idVerification/UploadID";
import ScanID from "../screens/idVerification/ScanID";
// import { CurrentStageProvider } from "../context/currentStage";
import { RouteProp, useRoute } from "@react-navigation/native";
const Stack = createStackNavigator();
interface RouteParams {
  currentFlow: number;
}
const VerificationNavigator: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { currentFlow } = route.params;
  return (
    // <CurrentStageProvider value={currentFlow}>
    <Stack.Navigator initialRouteName="IDVerification">
      <Stack.Screen
        name="IDVerification"
        component={IDVerification}
        options={{ headerShown: false }}
        initialParams={{ currentFlow: currentFlow }}
      />
      <Stack.Screen
        name="ConfirmID"
        component={ConfirmID}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmIdentity"
        component={ConfirmIdentity}
        options={{ headerShown: false }}
        initialParams={{ stepCompleted: 0 }}
      />
      <Stack.Screen
        name="FrameFace"
        component={FrameFace}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnderReview"
        component={UnderReview}
        options={{ headerShown: false }}
        initialParams={{ currentFlow: currentFlow }}
      />
      <Stack.Screen
        name="UploadID"
        component={UploadID}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanID"
        component={ScanID}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    // </CurrentStageProvider>
  );
};

export default VerificationNavigator;
