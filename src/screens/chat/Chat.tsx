import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, ScrollView } from "react-native";
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
import { SearchBar } from "../../components/common/SearchBar";
import { AppImages } from "../../utility/AppImages";
import ChatOverview from "./components/ChatOverview";
import globalStyles from "../../styles/globalStyles";
import { getAllChatsApi } from "../../../api/ProfileCompletion/GetApis/getAllChatsApi";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const Likes = (props: any) => {

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
  const [chats, setChats] = useState([]);
  const [searchedChats, setSearchedChats] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getAllChats();
    }, [])
  );

  const getAllChats = async () => {
    try {
      const response = await getAllChatsApi(
        reduxState.auth.token,
      );

      setChats(response);
      setSearchedChats(response);

    }
    catch (e) {
      console.log("Error in getting all chats", e)
    }
  }

  const handleSearch = (text: string) => {
    if (text.length === 0) {
      setSearchedChats(chats);
      return;
    }
    const filteredChats = chats.filter((chat) => {
      return chat.users.fullName?.toLowerCase().includes(text?.toLowerCase());
    });

    setSearchedChats(filteredChats);
  }


  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            color: AppColors.blackColor,
            fontSize: 24,
          }}
        >
          Your Chat Messages
        </Text>
        <SearchBar placeholder="Search Messages..." onChangeText={handleSearch} />
        {
          searchedChats?.length === 0 ? (
            <Text style={{ color: AppColors.secondaryText, fontSize: 16, textAlign: "center", marginTop: 20 }}>
              No chats found
            </Text>
          ) :
            searchedChats?.map((item, index) => (
              <ChatOverview
                user={item}
                conversation={item?._id}
                key={index}
                pressHandler={() => props.navigation.navigate("ChatScreen", { user: item?.users, conversation: item?._id , isUnmatched : item?.unmatch })}
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  iconContainer: {
    backgroundColor: AppColors.appThemeColor,
    width: 45,
    height: 45,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  titleText: {
    color: AppColors.blackColor,
    fontSize: 16,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  standardText: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  advancedFilters: {
    backgroundColor: "rgba(161, 121, 0, 0.1)",
    padding: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  advanceFilterTitle: {
    color: "rgba(161, 121, 0, 1)",
    marginVertical: 10,
    fontSize: 14,
  },
});

export default Likes;
