import React, {useEffect, useState} from "react";
import {View, StyleSheet, TouchableOpacity, Text, Image} from "react-native";
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
import {useSelector, useDispatch} from "react-redux";
import {AppColors} from "../../../utility/AppColors";
import {getLastChatApi} from "../../../../api/ProfileCompletion/GetApis/getLastChatApi";
import {addChatMessage, addImageUser, setChatData} from "../../../../redux/authSlice";
import {BlurView} from "expo-blur";

const ChatOverview = (props: any) => {
    const dispatch = useDispatch();

    const [content, setContent] = useState("");
    const chatData = useSelector((state) => state.auth.chatData);
    const imageUser = useSelector((state) => state.auth.imageUser);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [unseen, setUnseen] = useState<string>("");
    const [timeMessage, setTimeMessage] = useState<string>("");
    const token = props.token;
    const chatUniqId = props.conversation;
    const [chatId, setChatId] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [blur, setBlur] = useState(false);
    useFonts({
        Poppins_100Thin,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
    });


    useEffect(() => {
        // const response = getLastChatApi(props.user.users._id, token)
        getLastChatApi(props.user.users._id, token)
            .then(fetchData => {
                // console.log("this iaås the fetch data")
                // console.log(fetchData)
                // console.log('this is the fetch data')
                let checkData = fetchData;
                checkData.lastMessage.content = checkData?.lastMessage?.type === "audio"
                    ? "Voice Message"
                    : checkData?.lastMessage?.type === "image"
                        ? "Sent Image"
                        : checkData?.lastMessage?.type === "link"
                            ? "Voice Message"
                            : checkData?.lastMessage?.content,
                    console.log("-----------------------------")
                // console.log("this is the check data", checkData)
                dispatch(addChatMessage(checkData))
            })
            .catch(error => {
                console.error("Error fetching chat data:", error);
            });
    }, []);

    async  function fetchImageAsBase64(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onerror = () => {
                    reader.abort();
                    reject(new Error("Problem reading the image blob."));
                };

                reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]); // Get base64 part after comma
                };

                reader.readAsDataURL(blob); // Convert blob to base64
            });
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    }



    useEffect(() => {
        const imageHelper = imageUser?.find(item => item.id === props.user.users._id);
        setBlur(props?.user?.users?.photoPrivacy);
        if (imageHelper) {

            setImage(imageHelper.base64);
            // setImage(props.user.users.photos[0]);
        }else {
            setImage(props.user.users.photos[0]);
        }

        if (chatData.length > 0) {
            // Assuming the last chat item represents the most recent message
            // const latestChat = chatData[chatData.length - 1];
            const latestChat = chatData.find(item => item.lastMessage.chat === chatUniqId);
            // console.log("this is chat DAta")
            // console.log(chatData)
            // console.log("this is chat Data")
            setLastMessage(latestChat?.lastMessage?.content);
            setUnseen(latestChat?.numberOfUnseen + "");
            const time = new Date(latestChat?.lastMessage?.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            setTimeMessage(time);
        }
        fetchImageAsBase64(props.user.users.photos[0])
            .then(base64String => {
                // Use the base64String here
                const objectPhoto = {
                    id: props.user.users._id,
                    base64: `data:image/png;base64,${base64String}`
                }
                dispatch(addImageUser(objectPhoto))
                setImage(`data:image/png;base64,${base64String}`);
            })
            .catch(error => {
                console.error("Error fetching image:", error);
            });
    }, [chatData]); // Re-run when chatData changes

    return (
        <TouchableOpacity
            style={styles.container}
            key={props.index}
            onPress={props.pressHandler}
        >



            <View style={{ position: "relative" }}>
                {/* Image to be blurred */}
                <Image style={styles.profilePicture} source={{ uri: image }} />

                {/* Conditionally render BlurView */}
                {blur && (
                    <BlurView
                        intensity={7} // Adjust the blur intensity
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: styles.profilePicture.borderRadius, // Match the Image borderRadius
                            overflow: "hidden",
                        }}
                    />
                )}
            </View>




            <View style={{flex: 1, marginHorizontal: 10}}>
                <Text
                    style={{
                        fontFamily: "Poppins_600SemiBold",
                        color: AppColors.blackColor,
                        fontSize: 14,

                    }}
                >
                    {props?.user?.users?.fullName}
                </Text>
                {/* <Text
          style={{
            fontFamily: "Poppins_500Medium",
            color: props.user.lastMessage.isOpened
              ? AppColors.blackColor
              : AppColors.secondaryText,
            fontSize: 12,
          }}
        >
          {props.user.lastMessage.content}
        </Text> */}

                <Text
                    style={{
                        fontFamily: "Poppins_500Medium",
                        color: Number(unseen) > 0
                            ? AppColors.blackColor
                            : AppColors.secondaryText,
                        fontSize: 12,
                    }}
                >
                    {lastMessage}

                </Text>
            </View>
            <View style={{justifyContent: "center", alignItems: "center"}}>
                {Number(unseen) > 0 && (
                    <View
                        style={{
                            backgroundColor: AppColors.appThemeColor,
                            width: 20,
                            height: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 200,
                            marginVertical: 5,
                        }}
                    >
                        <Text>{unseen}</Text>
                    </View>
                )}
                <Text
                    style={{
                        fontFamily: "Poppins_500Medium",
                        color: props?.user?.lastMessage?.isOpened
                            ? AppColors.blackColor
                            : AppColors.secondaryText,
                        fontSize: 12,
                    }}
                >
                    {timeMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        marginVertical: 15,
    },
    profilePicture: {
        height: 52,
        width: 52,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: AppColors.appThemeColor,
    },

    iconContainer: {
        backgroundColor: AppColors.appThemeColor,
        width: 45,
        height: 45,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        position: "absolute",
        left: 0,
    },
    likeCountContainer: {
        backgroundColor: AppColors.appThemeColor,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 100,
        marginHorizontal: 5,
    },
});

export default ChatOverview;
