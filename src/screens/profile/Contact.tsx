import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  ScrollView,
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
import { AppColors } from "../../utility/AppColors";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../../components/common/InputField";
import CommonButton from "../../components/common/CommonButton";
import globalStyles from "../../styles/globalStyles";
import { contactUsApi } from "../../../api/Auth/PostApis/contactUsApi";
import { useSelector } from "react-redux";
import { Button } from "@/ui";
import { useInfoModal } from "@/context/ModalContext";

const Contact = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { openModal } = useInfoModal(); 
  const reduxState = useSelector((state) => state);

  const handleSubmit = async () => {
    try {
      const res = await contactUsApi(subject, message, reduxState.auth.token)
      console.log("////////////////////////////")
      console.log(res);
      console.log("//////////////////////////////")
      
      if (res.success) {
        openModal("Email Sent!", res?.message, "OK", "success");
        props.navigation.navigate("Profile");
      }
    } catch (error) {
      console.log("Error in contact us", error);
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.whiteColor,
    },
    input: {
      color: AppColors.primaryText,
      borderColor: isFocused ? AppColors.appThemeColor : AppColors.greyOutline,
      borderWidth: 1,
      borderRadius: 10,
      height: 300,
      width: "100%",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: AppColors.greyFill,
      padding: 15,
    },
    heading: {
      fontSize: 24,
      color: AppColors.blackColor,
      marginVertical: 10,
      marginTop: 60,
    },
    lightText: {
      color: AppColors.secondaryText,
      fontSize: 14,
    },
  });
  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <ScrollView style={{ padding: 15 }}>
        {/* header */}
        <Ionicons
          name="chevron-back"
          size={34}
          onPress={() => props.navigation.navigate("Profile")}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />

        <Text
          style={[
            {
              fontFamily: "Poppins_700Bold",
            },
            styles.heading,
          ]}
        >
          Contact Us
        </Text>
        <Text
          style={[
            {
              fontFamily: "Poppins_500Medium",
            },
            styles.lightText,
          ]}
        >
          contact@spousedapp.com
        </Text>
        <InputField
          text={subject}
          onChangeText={setSubject}
          label="Subject"
          placeholder="Enter subject"
        />
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            color: AppColors.blackColor,
          }}
        >
          Message
        </Text>
        <TextInput
          style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
          placeholder={"Enter your message"}
          placeholderTextColor={AppColors.greyOutline}
          defaultValue={message}
          onChangeText={setMessage}
          onFocus={() => setIsFocused(true)}
          multiline
        />
        <Button
          title={(!subject && !message)?"Please Enter Subject and Message!":!subject?"Please Enter Subject!":!message?"Please Enter Message!":"Submit"}
          onPress={handleSubmit}
          disText={(!subject && !message)?"Please Enter Subject and Message!":!subject?"Please Enter Subject!":!message?"Please Enter Message!":"Submit"}
          disabled={!subject|| !message}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
