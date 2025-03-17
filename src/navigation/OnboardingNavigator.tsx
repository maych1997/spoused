import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Registration from "../screens/onBoarding/Registration";
import PhoneVerification from "../screens/onBoarding/PhoneVerification";
import ProfileCreationSuccess from "../screens/onBoarding/ProfileCreationSuccess";
import CompleteProfile from "../screens/onBoarding/CompleteProfile";
import AddPhotos from "../screens/onBoarding/AddPhotos";
const Stack = createStackNavigator();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Registration">
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfile}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerification}
        options={{ headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="AddPhotos"
        component={AddPhotos}
        options={{ headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="ProfileCreationSuccess"
        component={ProfileCreationSuccess}
        options={{ headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
