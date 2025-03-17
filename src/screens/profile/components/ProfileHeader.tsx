import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import React from "react";
import { AppColors } from "../../../utility/AppColors";
import { AppImages } from "../../../utility/AppImages";
import { MaterialIcons } from "@expo/vector-icons";
const ProfileHeader = (props: any) => {

  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              backgroundColor: props.activeFilter
                ? AppColors.appThemeColor
                : AppColors.greyFill,
            },
          ]}
          onPress={props.filterHandler}
        >
          <Image
            style={{ width: 17, height: 14 }}
            source={AppImages.FILTER_ICON}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.boost} onPress={props.boostingHandler}>
          <MaterialCommunityIcons
            name="lightning-bolt-circle"
            size={24}
            color="black"
          />
          <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 5 }}
          >
            Boost
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginBottom: -200,
        }}
      >
        <Image src={props.imgPath} style={styles.image} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              textAlign: "center",
            }}
          >{props.fullName}</Text>
          {
            props.verified &&
            <MaterialIcons name="verified" size={24} color="#45A6FF" />
          }
        </View>
        <Text
          onPress={props.viewProfileHandler}
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          View Profile
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.appThemeColor,
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 80,
    paddingBottom: 67,
  },
  iconContainer: {
    backgroundColor: AppColors.whiteColor,
    width: 45,
    height: 45,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  boost: {
    backgroundColor: AppColors.whiteColor,
    borderRadius: 300,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 320,
    borderWidth: 3,
    borderColor: AppColors.whiteColor,
  },
});

export default ProfileHeader;
