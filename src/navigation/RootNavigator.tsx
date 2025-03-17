import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "../screens/Splash";
import GetStarted from "../screens/GetStarted";
import SignUp from "../screens/onBoarding/SignUp";
import SignIn from "../screens/onBoarding/SignIn";
import VerificationCode from "../screens/onBoarding/VerificationCode";
import OnboardingNavigator from "./OnboardingNavigator";
import TabNavigator from "./TabNavigator";
import Match from "../screens/home/Match";
import ChatScreen from "../screens/chat/ChatScreen";
import ManageSubscription from "../screens/profile/ManageSubscription";
import Boosting from "../screens/profile/Boosting";
import PremiumPlan from "../screens/profile/PremiumPlan";
import ViewProfile from "../screens/profile/ViewProfile";
import Settings from "../screens/profile/Settings";
import Contact from "../screens/profile/Contact";
import Break from "../screens/profile/Break";
import VerificationNavigator from "./VerificationNavigator";
import EthnicGroup from "../screens/details/EthnicGroup";
import StarSign from "../screens/details/StarSign";
import TravelMode from "../screens/details/TravelMode";
import Smoke from "../screens/details/Smoke";
import Religion from "../screens/details/Religion";
import PhoneNumber from "../screens/details/PhoneNumber";
import Profession from "../screens/details/Profession";
import PersonalityTraits from "../screens/details/PersonalityTraits";
import Name from "../screens/details/Name";
import MaritalStatus from "../screens/details/MaritalStatus";
import Language from "../screens/details/Language";
import JobTitle from "../screens/details/JobTitle";
import Height from "../screens/details/Height";
import Gender from "../screens/details/Gender";
import Ethnicity from "../screens/details/Ethnicity";
import Employer from "../screens/details/Employer";
import Email from "../screens/details/Email";
import Education from "../screens/details/Education";
import Drink from "../screens/details/Drink";
import DateOfBirth from "../screens/details/DateOfBirth";
import CurrentLocation from "../screens/details/CurrentLocation";
import Children from "../screens/details/Children";
import Bio from "../screens/details/Bio";
import AgePreference from "../screens/details/AgePreference";
import Interest from "../screens/details/Interests";
import DatingPreference from "../screens/details/DatingPreference";
import CompleteProfile from "../screens/onBoarding/CompleteProfile";
import ForgotPassword from "../screens/onBoarding/ForgotPassword";
import ForgotVerification from "../screens/onBoarding/ForgotVerification";
import NewPassword from "../screens/onBoarding/NewPassword";
import { navigationRef } from "@/core/navigation";
import ProfileDetails from "@/screens/profile/components/ProfileDetails";

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotVerification" component={ForgotVerification} options={{ headerShown: false }} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ headerShown: false }} />

        <Stack.Screen
          name="OnboardingNavigator"
          component={OnboardingNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Match" component={Match} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ManageSubscription" component={ManageSubscription} options={{ headerShown: false }} />
        <Stack.Screen name="Boosting" component={Boosting} options={{ headerShown: false }} />
        <Stack.Screen name="PremiumPlan" component={PremiumPlan} options={{ headerShown: false }} />
        <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Contact" component={Contact} options={{ headerShown: false }} />

        <Stack.Screen name="Break" component={Break} options={{ headerShown: false }} />

        <Stack.Screen name="Verification" component={VerificationNavigator} options={{ headerShown: false }} initialParams={{ currentFlow: 0 }} />
        <Stack.Screen name="EthnicGroup" component={EthnicGroup} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="AgePreference" component={AgePreference} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Bio" component={Bio} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Children" component={Children} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="CurrentLocation" component={CurrentLocation} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="DateOfBirth" component={DateOfBirth} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Drink" component={Drink} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Education" component={Education} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Email" component={Email} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Employer" component={Employer} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Ethnicity" component={Ethnicity} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Gender" component={Gender} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Height" component={Height} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Interests" component={Interest} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="JobTitle" component={JobTitle} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Language" component={Language} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="MaritalStatus" component={MaritalStatus} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="Name" component={Name} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="PersonalityTraits" component={PersonalityTraits} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Profession" component={Profession} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Religion" component={Religion} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="Smoke" component={Smoke} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="StarSign" component={StarSign} options={{ headerShown: false }} initialParams={{ back: 0 }} />

        <Stack.Screen name="TravelMode" component={TravelMode} options={{ headerShown: false }} initialParams={{ back: 0 }} />
        <Stack.Screen name="DatingPreference" component={DatingPreference} options={{ headerShown: false }} initialParams={{ back: 0 }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
