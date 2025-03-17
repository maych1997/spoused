import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
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
import { ScrollView } from "react-native-virtualized-view";
import Question from "../onBoarding/components/Question";
import { ethnicOrigin } from "../../data/ProfileQuestions";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import globalStyles from "../../styles/globalStyles";
import MapView from 'react-native-maps';
import { FULL_HEIGHT } from "../../utility/Constant";
import * as Location from 'expo-location';
import { Marker } from "react-native-svg";
import { s } from "react-native-size-matters";
import { Feather } from "@expo/vector-icons";
import CommonButton from "../../components/common/CommonButton";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SwitchSetting from "../profile/components/SwitchSetting";
import { travelModeApi } from "../../../api/ProfileCompletion/PutApis/travelModeApi";
import { useDispatch, useSelector } from "react-redux";
import { updatemyprofile } from "../../../redux/authSlice";
import { useInfoModal } from "@/context/ModalContext";

interface RouteParams {
  back: number;
}
const CurrentLocation = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [travel, setTravel] = useState(false);
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { back } = route.params;
  const { openModal } = useInfoModal();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.whiteColor,
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    input: {
      paddingHorizontal: s(5),
      width: "80%",
      color: AppColors.primaryText,
      borderColor: AppColors.greyFill,
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 10,
      height: 55,
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
    },
    inputContainer: {
      width: "95%",
    },
    map: {
      width: '100%',
      height: FULL_HEIGHT - 250,
    },
  });

  useEffect(() => {
    setTravel(reduxState?.auth?.user?.myprofile.travelMode.toggle);
    setSelectedPlace({
      name: reduxState?.auth?.user?.myprofile.travelMode.city,
      latitude: reduxState?.auth?.user?.myprofile.locationCoordinates.coordinates[0],
      longitude: reduxState?.auth?.user?.myprofile.locationCoordinates.coordinates[1]
    });

  }, [reduxState?.auth?.user?.myprofile]);


  const backHandler = () => {
    props.navigation.navigate("ViewProfile");
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

  const handleSubmit = async () => {
    try {
      if (!travel) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [location.coords.latitude, location.coords.longitude];

        const res = await travelModeApi(reduxState.auth.token, travel, "", coordinates);

        if (!res.success) {
          openModal("Oops!", res.message, "Try again", "error");
          // Alert.alert("Travel Mode Error", res.message);
          return
        }
        if (res.success) {
          dispatch(updatemyprofile(res.user));
          props.navigation.navigate("ViewProfile");
          return
        }
      }

      if (travel && !selectedPlace) {
        Alert.alert("Please select a location", "To enable travel mode, you need to select a location");
        return;
      }

      if (travel && selectedPlace) {
        const locationCoordinates = {
          coordinates: [selectedPlace.latitude, selectedPlace.longitude],
        }
        const res = await travelModeApi(reduxState.auth.token, travel, selectedPlace.name, locationCoordinates);
        if (!res.success) {
          openModal("Oops!", res.message, "Try again", "error");
          // Alert.alert("Travel Mode Error", res.message);
          return
        }
        if (res.success) {
          dispatch(updatemyprofile(res.user));
          props.navigation.navigate("ViewProfile");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View style={{ flexDirection: "row", height: 80, alignItems: "center", justifyContent: "center", width: "100%" }}>
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={backHandler}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />

        <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", }}>Travel Mode</Text>

      </View>

      <SwitchSetting
        toggle={travel}
        setToggle={setTravel}
        title="Travel Mode"
        content="Enable travel mode to search for cities"
      />
      {travel && <GooglePlacesAutocomplete
        placeholder="Search for a city..."
        onPress={(data, details = null) => {
          handleSelectPlace({
            name: data.description,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API,
          language: 'en',
          types: '(cities)',
        }}
        styles={{
          container: { width: '100%', alignItems: "center" },
          textInputContainer: styles.inputContainer,
          textInput: styles.input,
          description: {
            fontWeight: 'bold',
          },
        }}
        fetchDetails
        enablePoweredByContainer={false}
      />}

      {selectedPlace && <View style={{ backgroundColor: AppColors.greyFill, width: "100%", height: 50, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
        <Text style={{ fontSize: 16, fontFamily: "Poppins_400Regular", }}>Selected Location: </Text>
        <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium", }}>{selectedPlace.name}</Text>
      </View>}
      <CommonButton
        title="Set Location"
        pressHandler={handleSubmit}
      />
    </SafeAreaView>
  );
};



export default CurrentLocation;
