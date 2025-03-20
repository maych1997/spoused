import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { AppColors } from "../../utility/AppColors";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
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
import ChatStarter from "./components/ChatStarter";
import ChatSender from "./components/ChatSender";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FULL_HEIGHT } from "../../utility/Constant";
import CommonButton from "../../components/common/CommonButton";
import OptionSelect from "../../components/common/OptionSelect";
import globalStyles from "../../styles/globalStyles";
import { addMessagesApi } from "../../../api/ProfileCompletion/PostApis/addMessagesApi";
import { videoAuthApi } from "../../../api/ProfileCompletion/PostApis/videoAuthApi";
import { useDispatch, useSelector } from "react-redux";
import { getChatApi } from "../../../api/ProfileCompletion/GetApis/getChatApi";
import { useRoute } from "@react-navigation/native";
import io from "socket.io-client";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import { sendCallApi } from "../../../api/UserMatches/PostApis/sendCallApi";
import * as Linking from "expo-linking";
import { blockUserApi } from "../../../api/ProfileCompletion/PostApis/blockUserApi";
import { unmatchUserApi } from "../../../api/ProfileCompletion/PostApis/unmatchUserApi";
import { rematchUserApi } from "../../../api/ProfileCompletion/PostApis/rematchUserApi";
import { singleChatApi } from "../../../api/ProfileCompletion/PostApis/singleChatApi";
import AgoraUIKit from "agora-rn-uikit";
import AudioCallUiKit from "./components/AudioCallUiKit/AudioCallUiKit";
import { MarkReadChats } from "../../../api/ProfileCompletion/GetApis/markReadChats";
import {
  addChatMessage,
  updatedMessages,
  addUpdatedMessages,
} from "../../../redux/authSlice";
import { horizontalScale } from "@/styles/scaling";
import { getLastMessageSeen } from "../../../api/ProfileCompletion/GetApis/getLastMessageSeen";
import { useInfoModal } from "@/context/ModalContext";
import { endCallApi } from "api/UserMatches/PostApis/endCallApi";

interface RouteParams {
  back: number;
  user: any;
}
const ChatScreen = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const imageUser = useSelector((state) => state.auth.imageUser);

  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const [openMenu, setOpenMenu] = useState(false);
  const [openBlockMenu, setOpenBlockMenu] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openUnmatch, setOpenUnmatch] = useState(false);
  const [inputText, setInputText] = useState("");
  const unmatchOption = [
    "They Were Unresponsive",
    "They Were Not Serious",
    "They Were Not Polite",
    "We Met In Person",
  ];
  const reduxState = useSelector((state) => state);
  const [isUnmatched, setIsUnmatched] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(route?.params?.conversation);
  const [audioChanged, setAudioChanged] = useState(false);
  const [recording, setRecording] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [sound, setSound] = useState();
  const [sound2, setSound2] = useState();
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [playbackStatus2, setPlaybackStatus2] = useState({});
  const [audioBase64, setAudioBase64] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [idMessageSeen, setIdMessageSeen] = useState("");
  const socket = useRef<any>();
  const listViewRef = useRef();
  const intervalRef = useRef(null);
  const [videoCall, setVideoCall] = useState(false);
  const [voiceCall, setVoiceCall] = useState(false);
  const [helper, setHelper] = useState(false);
  const { openModal } = useInfoModal();
  const dispatch = useDispatch();
  const updatedMessages = useSelector((state) => state.auth.updatedMessages);
  const [image, setImage] = useState<string>("");
  const channelName = Math.random().toString(36).substring(7);
  const [channelData,setChannelData]=useState(null);
  const chatdata = async () => {
    try {
      const res = await singleChatApi(
        route?.params?.conversation,
        reduxState.auth.token
      );

      // console.log("chat data", res);
      const chatSeener = await MarkReadChats(
        route?.params?.conversation,
        reduxState.auth.token
      );
      // console.log("mark read", chatSeener);
      if (res.success) {
        setIsUnmatched(res.chat.unmatch);
      }
    } catch (error) {
      console.error("Error in getting chat data", error);
    }
  };
  useEffect(() => {
    chatdata();
    console.log("current user", route.params.user);
    const imageHelper = imageUser.find(
      (item) => item.id === route.params.user._id
    );
    // console.log(imageHelper)
    setImage(imageHelper?.base64);
  }, [route?.params?.conversation]);

  useEffect(() => {
    // Set up the interval to run every 10 seconds
    const interval = setInterval(() => {
      getLastMessageSeen(currentChat, reduxState.auth.token)
        .then((chatSeener) => {
          setIdMessageSeen(chatSeener.message);
        })
        .catch((error) => {
          console.error("Error fetching last message seen:", error);
        });

      // getMessages();
    }, 2000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.current = io(process.env.EXPO_PUBLIC_BASE_URL, {
      path: "/socket",
      auth: {
        token: reduxState?.auth?.token,
      },
    });

    socket.current.on("getMessage", (data) => {
      const isBase64 = data.data.startsWith("https");

      setArrivalMessage({
        sender: data.senderId,
        content: data.data,
        type: data.type,
        typebase: isBase64 ? "uri" : "base64",
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    return sound2
      ? () => {
          sound2.unloadAsync();
          clearInterval(intervalRef.current);
        }
      : undefined;
  }, [sound2]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    // console.log("arrival message", arrivalMessage);
    // console.log("current chat", currentChat);
    if (arrivalMessage) {
      // console.log("we have one")
      const data = new Date(arrivalMessage.createdAt);
      const object = {
        lastMessage: {
          __v: 0,
          _id: "671cf00635356fdc22b2c1fc",
          chat: currentChat,
          // content:arrivalMessage.content,
          content:
            arrivalMessage.type === "audio"
              ? "Voice Message"
              : arrivalMessage.type === "image"
              ? "Sent Image"
              : arrivalMessage.content,
          createdAt: data.toISOString(),
          sender: arrivalMessage.sender,
          type: arrivalMessage.type,
          updatedAt: data.toISOString(),
        },
        numberOfUnseen: 0,
      };
      // console.log("object", object);
      dispatch(addChatMessage(object));
      MarkReadChats(route?.params?.conversation, reduxState.auth.token);

      const object2 = {
        lastMessage: {
          __v: 0,
          _id: "671cf00635356fdc22b2c1fc",
          chat: currentChat,
          content: "message",
          createdAt: new Date().toISOString(),
          sender: reduxState?.auth?.user?.id,
          type: "text",
          updatedAt: new Date().toISOString(),
        },
        numberOfUnseen: 0,
        chat: currentChat,
        messages: [...messages, arrivalMessage],
      };
      // console.log("messagesASL", messages);
      dispatch(addUpdatedMessages(object2));
    } else {
      // console.log("we dont have one")
    }
  }, [arrivalMessage, currentChat]);

  const getMessages = async () => {
    const foundChat = updatedMessages?.find(
      (chat) => chat.chat === currentChat
    );
    if (foundChat) {
      console.log("+++++++++++++++++++++++++++++++++++++++");
      console.log(foundChat.messages[foundChat.messages.length - 1]);
      console.log("+++++++++++++++++++++++++++++++++++++++");
      setMessages(foundChat?.messages || []);
    }
    try {
      const res = await getChatApi(
        route?.params?.conversation,
        reduxState.auth.token
      );
      // console.log("Messages:", res.data);

      const updatedMessages2 = res.data.map((msg) => ({
        ...msg,
        typebase: msg.content.startsWith("data:image") ? "base64" : "uri",
        // status: msg._id === "672274a29fd0f833a039a2a8" ? "Seen" : undefined
      }));
      // const foundChat = updatedMessages?.find(chat => chat.chat === currentChat);
      if (foundChat) {
        if (foundChat.messages.length <= updatedMessages2.length) {
          setMessages(updatedMessages2);
        }
      } else {
        setMessages(updatedMessages2);
      }
      // console.log("Messages:", updatedMessages);
      // console.log("MessagesNew:", messages);
      const object = {
        lastMessage: {
          __v: 0,
          _id: "671cf00635356fdc22b2c1fc",
          chat: currentChat,
          content:
            (await updatedMessages2[updatedMessages2.length - 1]?.content) ||
            "message",
          createdAt: new Date().toISOString(),
          sender:
            (await updatedMessages2[updatedMessages2.length - 1]?.sender) ||
            reduxState?.auth?.user?.id,
          type: "text",
          updatedAt: new Date().toISOString(),
        },
        numberOfUnseen: 0,
        chat: currentChat,
        messages: await updatedMessages2,
      };
      // console.log("messagesASL", messages);
      dispatch(addUpdatedMessages(object));

      getLastMessageSeen(currentChat, reduxState.auth.token)
        .then((chatSeener) => {
          setIdMessageSeen(chatSeener.message);
        })
        .catch((error) => {
          console.error("Error fetching last message seen:", error);
        });
    } catch (e) {
      console.error("Error in getting messages", e);
    }
  };

  useEffect(() => {
    getMessages();
    // console.log("messages323:", messages);
  }, [route?.params?.conversation]);

  const phoneRegex =
    /(\b\d{10,}\b)|(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  const sendMessage = async () => {
    // console.log("messages323:", messages);
    if (inputText.trim() === "") return;

    const containsPhoneNumber = inputText.match(phoneRegex);
    const containsEmail = inputText.match(emailRegex);
    if (containsPhoneNumber || containsEmail) {
      // Display a pop-up warning
      openModal(
        "It is forbidden to send phone numbers including email addresses",
        "In case you are trying, it’s likely you’ll be banned",
        "OK",
        "error"
      );

      return; // Prevent sending the message
    }
    const message = {
      conversationId: route?.params?.conversation,
      text: inputText.trim(),
      sender: reduxState?.auth?.user?.id,
    };

    const type = "text";
    const tempId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const tempMessage = {
      _id: tempId, // Temporary unique ID
      chat: message.conversationId,
      content: message.text,
      createdAt: new Date().toISOString(),
      sender: reduxState?.auth?.user?.id, // Placeholder for sender ID
      type: "text",
      status: "sending", // Temporary status
    };

    socket.current.emit("sendMessage", {
      senderId: reduxState?.auth?.user?.id,
      receiverId: route?.params?.user?._id,
      type: type,
      data: message.text,
    });
    const object = {
      lastMessage: {
        __v: 0,
        _id: "671cf00635356fdc22b2c1fc",
        chat: currentChat,
        content: message.text,
        createdAt: new Date().toISOString(),
        sender: tempMessage.sender,
        type: "text",
        updatedAt: new Date().toISOString(),
      },
      numberOfUnseen: 0,
    };
    dispatch(addChatMessage(object));

    console.log("============================");
    const foundChat = updatedMessages.find((chat) => chat.chat === currentChat);
    console.log("found chat:", foundChat);
    // console.log(updatedMessages[0].messages)
    console.log("============================");
    setMessages([...messages, tempMessage]);

    const object2 = {
      lastMessage: {
        __v: 0,
        _id: "671cf00635356fdc22b2c1fc",
        chat: currentChat,
        content: "message",
        createdAt: new Date().toISOString(),
        sender: reduxState?.auth?.user?.id,
        type: "text",
        updatedAt: new Date().toISOString(),
      },
      numberOfUnseen: 0,
      chat: currentChat,
      messages: [...messages, tempMessage],
    };
    // console.log("messagesASL", messages);
    dispatch(addUpdatedMessages(object2));

    setInputText("");
    try {
      const response = await addMessagesApi(
        type,
        route?.params?.conversation,
        message.text,
        route?.params?.user?._id,
        reduxState.auth.token
      );

      if (response.success) {
        // console.log("Response:", response.msg);
        // setMessages([...messages, response.msg]);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempId ? { ...response.msg, isTemporary: false } : msg
          )
        );
      } else {
        Alert.alert("Try Again", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during message addition: ", error);
    }

    // setInputText("");
  };

  const startCall = async () => {
    try {
      // const res = await videoAuthApi(reduxState.auth.token,route?.params?.user.id, channelName)
      // console.log(res);

      // if (res.tokenWithUid)
      setVideoCall(true);
    } catch (error) {
      console.error("Error occurred during message addition: ", error);
    }
  };
  const sendCall = async () => {
    if (reduxState?.auth?.user?.myprofile?.proAccount) {
      setVideoCall(true);
      const roomId = videoConnectionData.channel;
      socket.current.emit("sendMessage", {
        senderId: reduxState?.auth?.user?.id,
        receiverId: route?.params?.user?._id,
        type: "link",
        data: roomId,
      });

      try {
        const res = await sendCallApi(
          route?.params?.conversation,
          roomId,
          reduxState.auth.token
        );

        setMessages([...messages, res.msg]);
      } catch (e) {
        console.error("Error in sending call", e);
      }
    } else {
      // // If the user does not have a proAccount, navigate to the PremiumPlan screen
      // props.navigation.navigate("PremiumPlan");
      openModal(
        "Upgrade to Pro Plan",
        "To make voice calls, you need to upgrade to a Pro Plan",
        "OK",
        "error"
      );
    }
  };
  // console.log("send call")

  const sendVoiceCall = async () => {
    const type = "link";
    // Check if the sender has a proAccount
    // if (reduxState?.auth?.user?.myprofile?.proAccount) {
    if(voiceConnectionData.channel.includes('voice')){
    setVoiceCall(true);
    const roomId = voiceConnectionData.channel;

    socket.current.emit("sendMessage", {
      senderId: reduxState?.auth?.user?.id,
      receiverId: route?.params?.user?._id,
      type: type,
      data: roomId,
    });

    const object = {
      lastMessage: {
        __v: 0,
        _id: "671cf00635356fdc22b2c1fc",
        chat: currentChat,
        content: "Voice Call",
        createdAt: new Date().toISOString(),
        sender: reduxState?.auth?.user?.id,
        type: type,
        updatedAt: new Date().toISOString(),
      },
      numberOfUnseen: 0,
    };
    dispatch(addChatMessage(object));
    try {
      const res = await sendCallApi(
        route?.params?.conversation,
        roomId,
        reduxState.auth.token
      );
      setMessages([...messages, res.msg]);
    } catch (e) {
      console.error("Error in sending call2", e);
    }

    try {
      const response = await addMessagesApi(
        type,
        route?.params?.conversation,
        "Incoming Call",
        route?.params?.user?._id,
        reduxState?.auth?.token,
        reduxState?.auth?.user?.id,
        "7d46bd57ef5b4804891bddc782f52515",
        reduxState?.auth?.user,
        roomId
      );
    } catch (error) {
      console.error("Error occurred during message addition: ", error);
    }
  }
    // } else {
    //   // // If the user does not have a proAccount, navigate to the PremiumPlan screen
    //   // props.navigation.navigate("PremiumPlan");
    //   openModal(
    //     "Upgrade to Pro Plan1",
    //     "To make voice calls, you need to upgrade to a Pro Plan",
    //     "OK",
    //     "error"
    //   );
    // }
  };
  useEffect(() => {
    setTimeout(() => {
      listViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const openGallery = async () => {
    // Request media library permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Allow the app to access your media library from settings."
      );
      return;
    }

    let quality = 0.6;
    let base64Image = null;
    let result = null;

    // Loop to keep adjusting the quality if the image size is larger than 1 MB
    do {
      // Launch the image picker with the current quality
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: quality,
        base64: true, // We need the base64 to calculate the size
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        base64Image = result.assets[0].base64;

        // Calculate the size of the base64 image in bytes
        const base64SizeInBytes = (base64Image.length * 3) / 4;
        const base64SizeInMB = base64SizeInBytes / (1024 * 1024); // Convert to MB

        console.log(`Image size: ${base64SizeInMB.toFixed(2)} MB`);

        // If the image size is greater than 1 MB, reduce the quality
        if (base64SizeInMB > 1) {
          quality -= 0.1; // Decrease the quality by 0.1
        } else {
          break; // Exit loop when the image size is under 1 MB
        }
      }
    } while (quality > 0.1); // Stop reducing quality when it is too low

    if (!result.cancelled && base64Image) {
      const type = "image";

      // Create a unique temporary ID for the image message
      const tempId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // Create a temporary image message object
      const tempMessage = {
        _id: tempId, // Unique temporary ID
        chat: "tempChatId", // Placeholder for chat ID
        content: base64Image, // Base64 image data
        createdAt: new Date().toISOString(),
        sender: reduxState?.auth?.user?.id, // Sender ID
        type: type,
        status: "sending", // Temporary status
        isTemporary: true, // Flag for temporary message
      };

      // Add the temporary image message to the chat
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // Emit the message to the socket (real-time messaging)
      socket.current.emit("sendMessage", {
        senderId: reduxState?.auth?.user?.id,
        receiverId: route?.params?.user?._id,
        type: type,
        data: base64Image,
      });

      const object = {
        lastMessage: {
          __v: 0,
          _id: "671cf00635356fdc22b2c1fc",
          chat: currentChat,
          content: "Sent Image",
          createdAt: new Date().toISOString(),
          sender: tempMessage.sender,
          type: "image",
          updatedAt: new Date().toISOString(),
        },
        numberOfUnseen: 0,
      };
      dispatch(addChatMessage(object));

      try {
        // Send the image message via the API
        const response = await addMessagesApi(
          type,
          route?.params?.conversation,
          base64Image,
          route?.params?.user?._id,
          reduxState.auth.token
        );

        // console.log("Response:", response);  // Log for debugging

        // Replace the temporary message with the real message from the server
        if (response.doc) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === tempId ? { ...response.doc, isTemporary: false } : msg
            )
          );
        } else {
          Alert.alert("Try Again", "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error occurred during message addition: ", error);

        // If there's an error, update the temporary message status to 'failed'
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempId ? { ...msg, status: "failed" } : msg
          )
        );
      }
    }
  };
  // const openGallery = async () => {
  //     // Request media library permissions
  //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //
  //     if (!permissionResult.granted) {
  //         Alert.alert("Permission Denied", "Allow the app to access your media library from settings.");
  //         return;
  //     }
  //
  //     // Launch the image picker
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //         allowsEditing: true,
  //         aspect: [4, 3],
  //         quality: 1,  // Maximum quality
  //         base64: true,
  //     });
  //
  //     if (!result.cancelled && result.assets && result.assets.length > 0) {
  //         const type = "image";
  //         const base64Image = result.assets[0].base64;
  //
  //         // Create a unique temporary ID for the image message
  //         const tempId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  //
  //         // Create a temporary image message object
  //         const tempMessage = {
  //             _id: tempId,  // Unique temporary ID
  //             chat: "tempChatId",  // Placeholder for chat ID
  //             content: base64Image,  // Base64 image data
  //             createdAt: new Date().toISOString(),
  //             sender: reduxState?.auth?.user?.id,  // Sender ID
  //             type: type,
  //             status: 'sending',  // Temporary status
  //             isTemporary: true,  // Flag for temporary message
  //         };
  //
  //         // Add the temporary image message to the chat
  //         setMessages(prevMessages => [...prevMessages, tempMessage]);
  //
  //         // Emit the message to the socket (real-time messaging)
  //         socket.current.emit("sendMessage", {
  //             senderId: reduxState?.auth?.user?.id,
  //             receiverId: route?.params?.user?._id,
  //             type: type,
  //             data: base64Image,
  //         });
  //
  //         try {
  //             // Send the image message via the API
  //             const response = await addMessagesApi(
  //                 type,
  //                 route?.params?.conversation,
  //                 base64Image,
  //                 route?.params?.user?._id,
  //                 reduxState.auth.token
  //             );
  //
  //             console.log("Response:", response);  // Log for debugging
  //
  //             // Replace the temporary message with the real message from the server
  //             if (response.doc) {
  //                 setMessages(prevMessages =>
  //                     prevMessages.map(msg =>
  //                         msg._id === tempId ? { ...response.doc, isTemporary: false } : msg
  //                     )
  //                 );
  //             } else {
  //                 Alert.alert("Try Again", "Something went wrong. Please try again.");
  //             }
  //         } catch (error) {
  //             console.error("Error occurred during message addition: ", error);
  //
  //             // If there's an error, update the temporary message status to 'failed'
  //             setMessages(prevMessages =>
  //                 prevMessages.map(msg =>
  //                     msg._id === tempId ? { ...msg, status: 'failed' } : msg
  //                 )
  //             );
  //         }
  //     }
  // };

  const openMic = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setAudioChanged(true);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedURI(uri);

    // Convert the audio file to base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setAudioBase64(base64); // Assuming setAudioBase64 is the state setter for the base64 string
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: recordedURI },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      setPlaybackStatus(status);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const uploadAudio = async () => {
    const type = "audio";
    const tempId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Create a temporary audio message object
    const tempMessage = {
      _id: tempId, // Unique temporary ID
      chat: route?.params?.conversation, // Placeholder for chat ID
      content: audioBase64, // Temporary audio data
      createdAt: new Date().toISOString(),
      sender: reduxState?.auth?.user?.id, // Sender ID
      type: type,
      status: "sending", // Temporary status
      isTemporary: true, // Flag for temporary message
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);

    socket.current.emit("sendMessage", {
      senderId: reduxState?.auth?.user?.id,
      receiverId: route?.params?.user?._id,
      type: type,
      data: audioBase64,
    });
    const object = {
      lastMessage: {
        __v: 0,
        _id: "671cf00635356fdc22b2c1fc",
        chat: currentChat,
        content: "Voice Message",
        createdAt: new Date().toISOString(),
        sender: tempMessage.sender,
        type: "audio",
        updatedAt: new Date().toISOString(),
      },
      numberOfUnseen: 0,
    };
    dispatch(addChatMessage(object));

    try {
      setRecordedURI(null);
      setRecording(null);
      const response = await addMessagesApi(
        type,
        route?.params?.conversation,
        audioBase64,
        route?.params?.user?._id,
        reduxState.auth.token
      );

      // console.log("Response:", response);  // Check if 'doc' is present

      // Check if 'doc' field exists in the response, meaning success
      if (response.doc) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempId ? { ...response.doc, isTemporary: false } : msg
          )
        );
        // setMessages([...messages, response.doc]);  // Add the new message to the chat
      } else {
        // If no 'doc', treat it as a failure
        Alert.alert("Try Again", "Something went wrong. Please try again.");
      }

      // Clear the recording after processing
      // setRecordedURI(null);
      // setRecording(null);
    } catch (error) {
      console.error("Error occurred during message addition: ", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const clearRecording = async () => {
    setRecordedURI(null);
    setRecording(null);
    await recording.stopAndUnloadAsync();
  };

  const play = async (uri, id) => {
    if (currentAudio && currentAudio !== id) {
      await pause();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: uri },
      { shouldPlay: true }
    );
    setSound2(sound);
    setCurrentAudio(id);
    setIsPlaying2(true);
    await sound.playAsync();

    if (Platform.OS === "android") {
      intervalRef.current = setInterval(async () => {
        const status = await sound.getStatusAsync();
        setPlaybackStatus2(status);
        if (status.didJustFinish) {
          clearInterval(intervalRef.current);
          setIsPlaying2(false);
          setCurrentAudio(null);
        }
      }, 500);
    } else {
      sound.setOnPlaybackStatusUpdate((status) => {
        setPlaybackStatus2(status);
        if (status.didJustFinish) {
          setIsPlaying2(false);
          setCurrentAudio(null);
        }
      });
    }
  };

  const pause = async () => {
    if (sound2) {
      await sound2.pauseAsync();
      setIsPlaying2(false);
      setCurrentAudio(null);
      if (Platform.OS === "android") {
        clearInterval(intervalRef.current);
      }
    }
  };

  const Block = async () => {
    try {
      const res = await blockUserApi(
        route?.params?.user?._id,
        reduxState.auth.token
      );

      if (res.success) {
        setOpenBlockMenu(false);
        props.navigation.navigate("Tab", { screen: "Chat" });
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnmatch = async () => {
    try {
      const res = await unmatchUserApi(
        route?.params?.user?._id,
        reduxState.auth.token
      );

      if (res.success) {
        setOpenUnmatch(false);
        setIsUnmatched(true);
        props.navigation.navigate("Tab", { screen: "Chat" });
      }
    } catch (error) {
      console.error("Error unmatching user:", error);
    }
  };
  // useEffect(()=>{
  //   props?.route?.params?.addEventListener('answer',()=>{
  //     setVoiceConnectionData({
  //       appId: "7d46bd57ef5b4804891bddc782f52515",
  //       channel: "voice" + reduxState?.auth?.user?.id + route?.params?.user?._id,
  //       token: null, // enter your channel token as a string
  //     });
  //     setVoiceCall(true);
  //   })
  // },[reduxState?.auth?.user?.id,route?.params?.user?._id])
  const renderItem = (item: any, index: any) => {
    const isCurrentUser = item.sender === reduxState?.auth?.user?.id;
    const messageStyle = [
      styles.messageContainer,
      isCurrentUser ? styles.userMessage : styles.recieverMessage,
      item.type === "image" && {
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 0,
      },
    ];
    const renderMessageContent = () => {
      switch (item.type) {
        case "image":
          const source =
            item.typebase === "base64"
              ? { uri: `data:image/jpeg;base64,${item.content}` }
              : { uri: item.content };

          return (
            <Image
              source={source}
              style={
                Platform.OS === "ios"
                  ? { width: 250, height: 250 }
                  : { width: 200, height: 200 }
              }
            />
          );

        case "text":
          return (
            <View>
              <Text
                style={[
                  styles.messageText,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                {item.content}
              </Text>
            </View>
          );

        case "audio":
          const audioContent = item.content.startsWith("https")
            ? item.content
            : `data:audio/mpeg;base64,${item.content}`;
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  isPlaying2 && currentAudio === item._id
                    ? pause()
                    : play(audioContent, item._id)
                }
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: AppColors.gray_E8E8E8,
                  borderRadius: 1000,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isPlaying2 && currentAudio === item._id ? (
                  <FontAwesome name={"pause"} size={18} color="black" />
                ) : (
                  <FontAwesome name={"play"} size={18} color="black" />
                )}
              </TouchableOpacity>
              <Slider
                style={{ width: "68%", height: 40, marginTop: 10 }}
                minimumValue={0}
                disabled
                maximumValue={playbackStatus2?.durationMillis || 0}
                value={
                  currentAudio === item._id
                    ? playbackStatus2?.positionMillis || 0
                    : 0
                }
                onSlidingComplete={async (value) => {
                  if (sound2 && currentAudio === item.id) {
                    await sound2.setPositionAsync(value);
                  }
                }}
              />
            </View>
          );

          case "link":
            return (
              <TouchableOpacity
                onPress={()=>{ 
                pickCall(item);  
                }
              }
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  columnGap: 4,
                }}
              >
                <View
                  style={
                    isCurrentUser
                      ? {
                          backgroundColor: "white",
                          height: 40,
                          width: 40,
                          borderRadius: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      : {
                          backgroundColor: AppColors.gray_D5D5D5,
                          height: 40,
                          width: 40,
                          borderRadius: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                  }
                >
                  <FontAwesome
                    name={
                      item.content.includes("voice") ? "phone" : "video-camera"
                    }
                    size={19}
                    color="black"
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.messageText,
                      { fontFamily: "Poppins_400Regular" },
                    ]}
                  >
                    {isCurrentUser ? "You" : route.params?.user?.fullName} started
                    a{item.content.includes("voice") ? " audio" : " video"} call
                  </Text>
                  <Text
                    style={[
                      styles.messageText,
                      { fontFamily: "Poppins_300Light", fontSize: 12 },
                    ]}
                  >
                    Click to join
                  </Text>
                </View>
              </TouchableOpacity>
            );
          case "linkEnd":
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  columnGap: 4,
                }}
              >
                <View
                  style={
                    isCurrentUser
                      ? {
                          backgroundColor: "white",
                          height: 40,
                          width: 40,
                          borderRadius: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      : {
                          backgroundColor: AppColors.gray_D5D5D5,
                          height: 40,
                          width: 40,
                          borderRadius: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                  }
                >
                  <FontAwesome
                    name={
                      item.content.includes("voice") ? "phone" : "video-camera"
                    }
                    size={19}
                    color="black"
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.messageText,
                      { fontFamily: "Poppins_400Regular" },
                    ]}
                  >
                    {isCurrentUser ? "You" : route.params?.user?.fullName} ended
                    {item.content.includes("voice")
                      ? " a audio Call"
                      : " a video Call"}
                  </Text>
                  <Text
                    style={[
                      styles.messageText,
                      { fontFamily: "Poppins_300Light", fontSize: 12 },
                    ]}
                  >
                    Call has ended
                  </Text>
                </View>
              </View>
            );
  
        default:
          // console.log("Invalid message type");

          return null;
      }
    };

    return (
      <View>
        <View style={messageStyle}>{renderMessageContent()}</View>
        <View style={styles.seenStyle}>
          <Text style={styles.seenTextStyle}>
            {item._id === idMessageSeen ? "Seen" : ""}
          </Text>
        </View>
      </View>
    );
  };

  const handleRematch = async () => {
    // console.log("rematch user");

    try {
      const res = await rematchUserApi(
        route?.params?.user?._id,
        reduxState.auth.token
      );

      if (res.success) {
        setIsUnmatched(false);
        props.navigation.navigate("Tab", { screen: "Chat" });
      }
    } catch (error) {
      console.error("Error unmatching user:", error);
    }
  };

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };
  useEffect(() => {});
  const [videoConnectionData, setVideoConnectionData] = useState({
    appId: "7d46bd57ef5b4804891bddc782f52515",
    channel: reduxState?.auth?.user?.id + route?.params?.user?._id,
    token: null, // enter your channel token as a string
  });
  const [voiceConnectionData, setVoiceConnectionData] = useState({
    appId: "7d46bd57ef5b4804891bddc782f52515",
    channel: "voice" + reduxState?.auth?.user?.id + route?.params?.user?._id,
    token: null, // enter your channel token as a string
  });
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  const onHangUp = async () => {
    // Check if the sender has a proAccount
    // if (reduxState?.auth?.user?.myprofile?.proAccount) {
    if (voiceConnectionData.channel.includes("voice")) {
      setVoiceCall(false);
      const roomId = voiceConnectionData.channel;
      socket.current.emit("sendMessage", {
        senderId: reduxState?.auth?.user?.id,
        receiverId: route?.params?.user?._id,
        type: "linkEnd",
        data: roomId,
      });

      const object = {
        lastMessage: {
          __v: 0,
          _id: "671cf00635356fdc22b2c1fc",
          chat: currentChat,
          content: "Voice Call",
          createdAt: new Date().toISOString(),
          sender: reduxState?.auth?.user?.id,
          type: "linkEnd",
          updatedAt: new Date().toISOString(),
        },
        numberOfUnseen: 0,
      };
      dispatch(addChatMessage(object));

      const res = await endCallApi(
        route?.params?.conversation,
        roomId,
        reduxState.auth.token
      );

      setMessages([...messages, res.msg]);
    }

    // } else {
    //   // // If the user does not have a proAccount, navigate to the PremiumPlan screen
    //   // props.navigation.navigate("PremiumPlan");
    //   openModal(
    //     "Upgrade to Pro Plan1",
    //     "To make voice calls, you need to upgrade to a Pro Plan",
    //     "OK",
    //     "error"
    //   );
    // }
  };
  const pickCall=(item:any)=>{
    if (item?.content?.includes("voice")) {
      setVoiceConnectionData({
        appId: "7d46bd57ef5b4804891bddc782f52515",
        channel: item?.content,
        token: null,
      });
      setVoiceCall(true);
    } else {
      setVideoConnectionData({
        appId: "7d46bd57ef5b4804891bddc782f52515",
        channel: item?.content,
        token: null,
      });
      setVideoCall(true);
    }
  }

  if (videoCall)
    return (
      <AgoraUIKit
        connectionData={videoConnectionData}
        rtcCallbacks={callbacks}
      />
    );
  if (voiceCall)
    return (
      <AudioCallUiKit
        username={route?.params?.user.fullName}
        userImage={image}
        appId={voiceConnectionData.appId}
        callState={voiceCall}
        channelName={voiceConnectionData.channel}
        onHangUp={onHangUp}
        ruid={route?.params?.user?._id}
        euid={reduxState?.auth?.user?.id}
        token={reduxState?.auth?.token}
      />
    );
  else
    return (
      <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
        <ChatHeader
          onCall={sendCall}
          onVoiceCall={sendVoiceCall}
          data={route?.params?.user}
          image={image}
          goBack={() => props.navigation.navigate("Tab")}
          menuHandler={() => setOpenMenu(true)}
        />

        <KeyboardAvoidingView
          style={{ flex: 1, overflow: "hidden" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
        >
          <FlatList
            ref={listViewRef}
            data={messages}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={<ChatStarter />}
            style={styles.contentContainer}
            // onContentSizeChange={() => listViewRef?.current?.scrollToEnd({animated: true})}
            initialScrollIndex={messages.length - 1} // Start at the last message
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
            onScrollToIndexFailed={(error) => {
              listViewRef.current?.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true,
              });
            }}
          />
          <ChatSender
            name={route.params?.user?.fullName}
            isUnmatched={isUnmatched}
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMessage}
            setIsUnmatched={handleRematch}
            openGallery={openGallery}
            openMic={openMic}
            stopRecording={stopRecording}
            playSound={playSound}
            isPlaying={isPlaying}
            audioChanged={audioChanged}
            recordedURI={recordedURI}
            uploadAudio={uploadAudio}
            recording={recording}
            clearRecording={clearRecording}
            playbackStatus={playbackStatus}
          />
        </KeyboardAvoidingView>

        {/* main menu */}
        <Modal visible={openMenu} transparent={true}>
          <Pressable onPress={() => setOpenMenu(false)} style={styles.overlay}>
            <View
              style={{
                backgroundColor: AppColors.whiteColor,
                padding: 15,
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 30,
              }}
            >
              {/* Unmatch */}
              <TouchableOpacity
                style={styles.menuOptionContainer}
                onPress={() => {
                  setOpenMenu(false); // Close main menu
                  setOpenUnmatch(true); // Open block menu
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    textAlign: "center",
                    fontSize: 16,
                    color: AppColors.blackColor,
                  }}
                >
                  Unmatch
                </Text>
              </TouchableOpacity>
              {/* Block */}
              <TouchableOpacity
                style={styles.menuOptionContainer}
                onPress={() => {
                  setOpenMenu(false); // Close main menu
                  setOpenBlockMenu(true); // Open block menu
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    textAlign: "center",
                    fontSize: 16,
                    color: AppColors.blackColor,
                  }}
                >
                  Block
                </Text>
              </TouchableOpacity>

              <Text
                onPress={() => setOpenMenu(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                  fontSize: 16,
                  color: AppColors.blackColor,
                  marginVertical: 20,
                }}
              >
                Close
              </Text>
            </View>
          </Pressable>
        </Modal>

        {/* block and report menu */}
        <Modal visible={openBlockMenu} transparent={true}>
          <Pressable
            onPress={() => setOpenBlockMenu(false)}
            style={styles.overlay}
          >
            <View
              style={{
                backgroundColor: AppColors.whiteColor,
                padding: 15,
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 30,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: AppColors.blackColor,
                  marginTop: 20,
                }}
              >
                Block
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: AppColors.secondaryText,
                  marginVertical: 10,
                }}
              >
                Are you sure you wanna do this?
              </Text>
              {/* Block Sabrina */}
              <TouchableOpacity
                style={[
                  styles.menuOptionContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={Block}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    textAlign: "center",
                    fontSize: 16,
                    color: AppColors.blackColor,
                  }}
                >
                  Block {route.params?.user?.fullName.split(" ")[0]}
                </Text>
                <Entypo name="block" size={24} color="black" />
              </TouchableOpacity>

              <Text
                onPress={() => setOpenBlockMenu(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                  fontSize: 16,
                  color: AppColors.blackColor,
                  marginVertical: 20,
                }}
              >
                Close
              </Text>
            </View>
          </Pressable>
        </Modal>

        {/* report modal */}
        <Modal visible={openReport} transparent={true}>
          <Pressable
            onPress={() => setOpenReport(false)}
            style={styles.overlay}
          >
            <View
              style={{
                backgroundColor: AppColors.whiteColor,
                padding: 15,
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 30,
              }}
            >
              <Text
                onPress={() => setOpenBlockMenu(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: AppColors.blackColor,
                  marginTop: 20,
                }}
              >
                Reason of Report
              </Text>
              <Text
                onPress={() => setOpenBlockMenu(false)}
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: AppColors.secondaryText,
                  marginVertical: 10,
                  lineHeight: 25,
                }}
              >
                We’re really sorry!{"\n"}Please let us know the reason.
              </Text>
              <TextInput
                placeholder="State your reason"
                multiline
                style={{
                  backgroundColor: AppColors.greyFill,
                  borderWidth: 1,
                  borderColor: "rgba(0, 0, 0, 0.05)",
                  height: 153,
                  borderRadius: 10,
                  padding: 10,
                  fontFamily: "Poppins_500Medium",
                  marginVertical: 10,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}
              />

              <Text
                onPress={() => setOpenReport(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                  fontSize: 16,
                  color: AppColors.blackColor,
                  marginVertical: 20,
                }}
              >
                Send
              </Text>
            </View>
          </Pressable>
        </Modal>

        {/* unmatch menu */}
        <Modal visible={openUnmatch} transparent={true}>
          <Pressable
            onPress={() => setOpenUnmatch(false)}
            style={styles.overlay}
          >
            <View
              style={{
                backgroundColor: AppColors.whiteColor,
                padding: 15,
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 30,
              }}
            >
              <Text
                onPress={() => setOpenBlockMenu(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: AppColors.blackColor,
                  marginTop: 20,
                }}
              >
                Unmatch
              </Text>
              <Text
                onPress={() => setOpenBlockMenu(false)}
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: AppColors.secondaryText,
                  marginVertical: 10,
                  lineHeight: 25,
                }}
              >
                Unmatching will remove you from each other’s matches.
              </Text>
              <CommonButton title={"Unmatch"} pressHandler={handleUnmatch} />

              <Text
                onPress={() => setOpenUnmatch(false)}
                style={{
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                  fontSize: 16,
                  color: AppColors.blackColor,
                  marginBottom: 30,
                }}
              >
                Close{" "}
              </Text>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  contentContainer: {
    paddingHorizontal: 15,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 20,
  },
  seenStyle: {
    flexDirection: "row", // Set row direction
    justifyContent: "flex-end", // Aligns content to the right
    alignItems: "center", // Centers vertically
    paddingHorizontal: horizontalScale(0),
  },
  seenTextStyle: {
    color: "#93989E",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: AppColors.appThemeColor,
    borderTopRightRadius: 0,
  },
  recieverMessage: {
    alignSelf: "flex-start",
    backgroundColor: AppColors.greyFill,
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  menuOptionContainer: {
    backgroundColor: AppColors.greyFill,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
  },
  overlay: {
    margin: 0,
    backgroundColor: AppColors.transparentBlack,
    width: "100%",
    height: FULL_HEIGHT,
  },
});

export default ChatScreen;
