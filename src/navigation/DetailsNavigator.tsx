import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EthnicGroup from "../screens/details/EthnicGroup";
import AgePreference from "../screens/details/AgePreference";
import Bio from "../screens/details/Bio";
import Children from "../screens/details/Children";
import CurrentLocation from "../screens/details/CurrentLocation";
import DateOfBirth from "../screens/details/DateOfBirth";
import Drink from "../screens/details/Drink";
import Education from "../screens/details/Education";
import Email from "../screens/details/Email";
import Employer from "../screens/details/Employer";
import Ethnicity from "../screens/details/Ethnicity";
import Gender from "../screens/details/Gender";
import Height from "../screens/details/Height";
import Interests from "../screens/details/Interests";
import JobTitle from "../screens/details/JobTitle";
import Language from "../screens/details/Language";
import MaritalStatus from "../screens/details/MaritalStatus";
import Name from "../screens/details/Name";
import PersonalityTraits from "../screens/details/PersonalityTraits";
import PhoneNumber from "../screens/details/PhoneNumber";
import Profession from "../screens/details/Profession";
import Religion from "../screens/details/Religion";
import Smoke from "../screens/details/Smoke";
import StarSign from "../screens/details/StarSign";
import TravelMode from "../screens/details/TravelMode";
const Stack = createStackNavigator();

const DetailsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EthnicGroup"
        component={EthnicGroup}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="AgePreference"
        component={AgePreference}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Bio"
        component={Bio}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Children"
        component={Children}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="CurrentLocation"
        component={CurrentLocation}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="DateOfBirth"
        component={DateOfBirth}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Drink"
        component={Drink}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Education"
        component={Education}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Email"
        component={Email}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Employer"
        component={Employer}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Ethnicity"
        component={Ethnicity}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Gender"
        component={Gender}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Height"
        component={Height}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Interests"
        component={Interests}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="JobTitle"
        component={JobTitle}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="MaritalStatus"
        component={MaritalStatus}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
      <Stack.Screen
        name="Name"
        component={Name}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="PersonalityTraits"
        component={PersonalityTraits}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Profession"
        component={Profession}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="PhoneNumber"
        component={PhoneNumber}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Religion"
        component={Religion}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="Smoke"
        component={Smoke}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="StarSign"
        component={StarSign}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />

      <Stack.Screen
        name="TravelMode"
        component={TravelMode}
        options={{ headerShown: false }}
        initialParams={{ back: 0 }}
      />
    </Stack.Navigator>
  );
};

export default DetailsNavigator;
