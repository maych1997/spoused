import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home/Home";
import Notifications from "../screens/notifications/Notifications";
import Filters from "../screens/notifications/Filters";
import UserDetail from "../screens/home/UserDetail";
import Profile from "../screens/profile/Profile";
const Stack = createStackNavigator();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
