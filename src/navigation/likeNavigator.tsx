import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Likes from "../screens/likes/Likes";
import UserDetail from "../screens/likes/UserDetail";

const Stack = createStackNavigator();

const LikeNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="like">
            <Stack.Screen
                name="like"
                component={Likes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserDetail"
                component={UserDetail}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default LikeNavigator;
