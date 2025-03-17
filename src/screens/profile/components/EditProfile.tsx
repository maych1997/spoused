import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
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
import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import { AppColors } from "../../../utility/AppColors";
import { FontAwesome5 } from "@expo/vector-icons";
import Filter from "../../notifications/components/Filter";
import Slider from "@react-native-community/slider";

import * as ImagePicker from "expo-image-picker";
import { FULL_HEIGHT, FULL_WIDTH } from "../../../utility/Constant";
import { Audio, ResizeMode } from "expo-av";

import { Entypo } from "@expo/vector-icons";
import SwitchSetting from "./SwitchSetting";
import { AntDesign } from "@expo/vector-icons";
import { updatemyprofile } from "../../../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { addPhotosApi } from "../../../../api/ProfileCompletion/PostApis/addPhotosApi";
import { Video } from "expo-av";
import { updateVideoApi } from "../../../../api/ProfileCompletion/PutApis/updateVideoApi";
import { updateAudioApi } from "../../../../api/ProfileCompletion/PutApis/updateAudioApi";
import { getMyProfileApi } from "../../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { travelModeApi } from "../../../../api/ProfileCompletion/PutApis/travelModeApi";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Location from "expo-location";
import CommonButton from "../../../components/common/CommonButton";
import { swapPhotos } from "../../../../api/ProfileCompletion/PostApis/swapPhotos";
import { deletePhoto } from "../../../../api/ProfileCompletion/PostApis/deletePhoto";
import { deleteVideo } from "../../../../api/ProfileCompletion/PostApis/deleteVideo";
import { deleteIntro } from "../../../../api/ProfileCompletion/PostApis/deleteIntro";
import { updateGoldApi } from "../../../../api/ProfileCompletion/PostApis/updateGoldApi";
import { useInfoModal } from "@/context/ModalContext";

const EditProfile = (props: any) => {
  useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const [goldMember, setGoldMember] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [modal, setModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [videoModal, setVideoModal] = useState(false);
  const videoRef = useRef(null);
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChanged, setAudioChanged] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [localAudio, setLocalAudio] = useState(false);
  const { openModal } = useInfoModal();

  useEffect(() => {
    setProfileData(reduxState?.auth?.user?.myprofile);
    setGoldMember(reduxState?.auth?.user?.myprofile?.goldMemberBadge);
    if (reduxState?.auth?.user?.myprofile?.intro) {
      setRecordedURI(reduxState?.auth?.user?.myprofile?.intro);
    }
  }, [reduxState?.auth?.user?.myprofile]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const pickImage = async (indexToAddTo: number) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Allow the app to access your media library from settings."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setModal(false);
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setLoading(true);
      try {
        const data = await addPhotosApi(
          result.assets[0],
          indexToAddTo,
          reduxState.auth.token
        );

        if (!data?.verified) {
          setLoading(false);
          openModal(
            "uploading failed",
            "Please upload a photo with your face visible",
            "Ok",
            "error_validation"
          );
          // Alert.alert("uploading failed", "Please upload a photo with your face visible");
          return;
        }
        if (data.verified) {
          try {
            // Navigate to the next screen after fetching profile data
            if (reduxState.auth.token) {
              const location = await Location.getCurrentPositionAsync({});
              const coordinates = [
                location.coords.latitude,
                location.coords.longitude,
              ];

              const response = await getMyProfileApi(
                reduxState.auth.token,
                coordinates
              );

              dispatch(updatemyprofile(response.data));
              setLoading(false);
              openModal(
                "Photo uploaded",
                "Congratulations! Your photo has been uploaded successfully.",
                "Ok",
                "success"
              );
              // Alert.alert("Photo uploaded", "Congratulations! Your photo has been uploaded successfully.");
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        }
      } catch (error) {
        console.error("Error occurred during photo upload: ", error);
      }
    }
  };

  const setAsMain = async (index: number) => {
    try {
      setModal(false);
      setLoading(true);
      const res = await swapPhotos(reduxState.auth.token, index);
      if (res.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        const response = await getMyProfileApi(
          reduxState.auth.token,
          coordinates
        );
        dispatch(updatemyprofile(response.data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error setting as main:", error);
    }
  };

  const deleteImage = async (index: number) => {
    try {
      setModal(false);
      setLoading(true);
      const res = await deletePhoto(reduxState.auth.token, index);
      if (res.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        const response = await getMyProfileApi(
          reduxState.auth.token,
          coordinates
        );
        dispatch(updatemyprofile(response.data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
      allowsEditing: true,
      videoMaxDuration: 15,
    });

    setVideoModal(false);
    if (!result.canceled) {
      // uploaded video should be less than 10 MB
      if (result.assets[0].fileSize > 10000000) {
        Alert.alert(
          "Video uploading failed",
          "Video size should be less than 10 MB"
        );
        return;
      }
      setLoading(true);
      try {
        const data = await updateVideoApi(
          result.assets[0],
          reduxState.auth.token
        );

        if (!data.success) {
          setLoading(false);
          Alert.alert("Upload failed", "Please try again");
          return;
        }

        if (data.success) {
          const location = await Location.getCurrentPositionAsync({});
          const coordinates = [
            location.coords.latitude,
            location.coords.longitude,
          ];
          const response = await getMyProfileApi(
            reduxState.auth.token,
            coordinates
          );
          dispatch(updatemyprofile(response.data));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const deleteVid = async () => {
    try {
      setVideoModal(false);
      setLoading(true);
      const res = await deleteVideo(reduxState.auth.token);

      if (res.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        const response = await getMyProfileApi(
          reduxState.auth.token,
          coordinates
        );
        dispatch(updatemyprofile(response.data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const startRecording = async () => {
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
    setLocalAudio(true);
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

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const uploadAudio = async () => {
    setLoading(true);
    try {
      const response = await updateAudioApi(recordedURI, reduxState.auth.token);

      if (!response.success) {
        Alert.alert("Upload failed", "Please try again");
        setLoading(false);
        setLocalAudio(false);
        return;
      }

      if (response.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        const response = await getMyProfileApi(
          reduxState.auth.token,
          coordinates
        );
        dispatch(updatemyprofile(response.data));
        setRecordedURI(null);
        setAudioChanged(false);
        setLoading(false);
        openModal(
          "Audio uploaded",
          "Congratulations! Your audio has been uploaded successfully.",
          "Okay",
          "success"
        );
      }
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  const deleteAudio = async () => {
    try {
      setLoading(true);
      const res = await deleteIntro(reduxState.auth.token);

      if (res.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        const response = await getMyProfileApi(
          reduxState.auth.token,
          coordinates
        );
        dispatch(updatemyprofile(response.data));
        setRecordedURI(null);
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert("Error", "Failed to delete audio");
      }
    } catch (error) {
      console.error("Error deleting audio:", error);
    }
  };

  const removeRecordedAudio = async () => {
    try {
      setLoading(true);
      // If you need to communicate with the backend to delete the audio file, do it here
      // Example: await deleteAudioFromBackend(recordedAudio);

      // Clear the recorded audio from the state
      setRecordedURI(null);
      console.log("Recorded audio removed successfully");
    } catch (error) {
      console.error("Error removing recorded audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGold = async () => {
    if (!profileData.proAccount) {
      Alert.alert(
        "Upgrade to Pro Account",
        "You need to upgrade to Pro Account to enable this feature"
      );
      return;
    }
    try {
      setGoldMember(!goldMember);
      const res = await updateGoldApi(reduxState.auth.token, !goldMember);

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  };
  console.log(profileData);
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Poppins_700Bold",
          fontSize: 20,
          color: AppColors.blackColor,
          marginVertical: 10,
        }}
      >
        Edit Profile
      </Text>
      <View style={{ flexDirection: "row" }}>
        {profileData && profileData.photos && profileData.photos[0] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(0);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[0] || null }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(0)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}

        {profileData && profileData.photos && profileData.photos[1] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(1);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[1] || null }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(1)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}

        {profileData && profileData.photos && profileData.photos[2] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(2);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[2] || null }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(2)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flexDirection: "row" }}>
        {profileData && profileData.photos && profileData.photos[3] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(3);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[3] }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(3)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}

        {profileData && profileData.photos && profileData.photos[4] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(4);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[4] || null }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(4)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}

        {profileData && profileData.photos && profileData.photos[5] ? (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(5);
              setModal(true);
            }}
          >
            <Image
              source={{ uri: profileData.photos[5] || null }}
              style={styles.imageTile}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraTile}
            onPress={() => pickImage(5)}
          >
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Video
      </Text>
      {profileData?.video ? (
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => setVideoModal(true)}
        >
          <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
            Change Video
          </Text>
          <FontAwesome name="video-camera" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.contentContainer} onPress={handleVideo}>
          <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
            Add A Video
          </Text>
          <FontAwesome name="video-camera" size={24} color="black" />
        </TouchableOpacity>
      )}
      {profileData?.video && (
        <View>
          <Video
            ref={videoRef}
            style={{
              height: 500,
              width: "100%",
              marginTop: 20,
              borderRadius: 10,
              alignSelf: "center",
            }}
            source={{ uri: profileData?.video }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            onPlaybackStatusUpdate={(status) => setStatus(status)}
          />
        </View>
      )}

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Intro
      </Text>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
          {profileData?.intro
            ? "Change Intro"
            : recording
            ? "Stop Recording"
            : "Record Your Intro"}
        </Text>
        <FontAwesome name="microphone" size={24} color="black" />
      </TouchableOpacity>

      {recordedURI && !recording && audioChanged && (
        <CommonButton title="Upload Intro" pressHandler={uploadAudio} />
      )}

      {recordedURI && !recording && (
        <Slider
          style={{ width: "100%", height: 40, marginTop: 10 }}
          minimumValue={0}
          disabled
          maximumValue={playbackStatus?.durationMillis || 0}
          value={playbackStatus?.positionMillis || 0}
          onSlidingComplete={async (value) => {
            if (sound) {
              await sound.setPositionAsync(value);
            }
          }}
        />
      )}

      {recordedURI && !recording && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            columnGap: 18,
          }}
        >
          <TouchableOpacity
            onPress={isPlaying ? pauseSound : playSound}
            style={{
              height: 50,
              width: 50,
              backgroundColor: AppColors.gray_E8E8E8,
              borderRadius: 1000,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isPlaying ? (
              <FontAwesome name={"pause"} size={18} color="black" />
            ) : (
              <FontAwesome name={"play"} size={18} color="black" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={stopSound}
            style={{
              height: 50,
              width: 50,
              backgroundColor: AppColors.red_FF0000,
              borderRadius: 1000,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name={"stop"} size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={localAudio ? removeRecordedAudio : deleteAudio}
            style={{
              height: 50,
              width: 50,
              backgroundColor: AppColors.red_FF0000,
              borderRadius: 1000,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name={"trash"} size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Profile Features
      </Text>
      <SwitchSetting
        toggle={goldMember}
        setToggle={handleGold}
        title="Gold Member Badge"
        content="Show Gold Member Badge on Profile"
      />
      <TouchableOpacity style={styles.contentContainer}>
        <View>
          <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>
            ID Verified Badge
          </Text>
          <Text
            style={[
              styles.description,
              { fontFamily: "Poppins_500Medium", marginVertical: 5 },
            ]}
          >
            Verify Your ID To Get More Likes And Matches
          </Text>
          <Text
            style={[
              styles.description,
              {
                fontFamily: "Poppins_700Bold",
                color: AppColors.appThemeColor,
                marginTop: 10,
              },
            ]}
          >
            Complete Profile
          </Text>
        </View>
        <FontAwesome5 name="caret-right" size={34} color="black" />
      </TouchableOpacity>

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Location
      </Text>
      <Filter
        title={"Current Location"}
        content={"00114 Shields Falls"}
        pressHandler={() =>
          props.navigation.navigate("CurrentLocation", { back: 0 })
        }
      />

      <View style={{ position: "relative" }}>
        <Filter
          title={"Travel Mode"}
          content={"Change your location to be found abroad"}
          pressHandler={() => props.navigation.navigate("CurrentLocation")}
        />
      </View>

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        About Me
      </Text>
      <Filter
        title={"Name"}
        content={profileData?.fullName}
        pressHandler={() => props.navigation.navigate("Name", { back: 0 })}
      />
      <Filter
        title={"Gender"}
        content={profileData?.gender}
        pressHandler={() => props.navigation.navigate("Gender", { back: 0 })}
      />
      <Filter
        title={"Date of Birth"}
        content={profileData?.birthday?.split("T")[0]}
        pressHandler={() =>
          props.navigation.navigate("DateOfBirth", { back: 0 })
        }
      />
      <Filter
        title={"Height"}
        content={profileData?.height?.ft}
        pressHandler={() => props.navigation.navigate("Height", { back: 0 })}
      />
      <Filter
        title={"Marital Status"}
        content={profileData?.maritalStatus || "No Preferences"}
        pressHandler={() =>
          props.navigation.navigate("MaritalStatus", { back: 0 })
        }
      />
      <Filter
        title={"Children"}
        content={profileData?.children || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Children", { back: 0 })}
      />
      <Filter
        title={"Bio"}
        content={
          profileData?.biography?.length > 30
            ? profileData?.biography.slice(0, 30) + "..."
            : profileData?.biography
        }
        pressHandler={() => props.navigation.navigate("Bio", { back: 0 })}
      />
      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Religiosity
      </Text>
      <Filter
        title={"Religion"}
        content={profileData?.religion || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Religion", { back: 0 })}
      />
      <Filter
        title={"Do You Smoke?"}
        content={profileData?.smoking || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Smoke", { back: 0 })}
      />
      <Filter
        title={"Do You Drink?"}
        content={profileData?.drink || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Drink", { back: 0 })}
      />
      <Filter
        title={"Star Sign"}
        content={profileData?.starSign || "No Preferences"}
        pressHandler={() => props.navigation.navigate("StarSign", { back: 0 })}
      />

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Preferences
      </Text>
      <Filter
        title={"Who would you like to date?"}
        content={profileData?.gender}
        pressHandler={() =>
          props.navigation.navigate("DatingPreference", { back: 0 })
        }
      />
      <Filter
        title={"Age Preferences"}
        content={profileData?.Age}
        pressHandler={() =>
          props.navigation.navigate("AgePreference", { back: 0 })
        }
      />
      <Filter
        title={"Ethnicity"}
        content={profileData?.ethnicGroup}
        pressHandler={() => props.navigation.navigate("Ethnicity", { back: 0 })}
      />

      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Interests & Personality
      </Text>
      <Filter
        title={"Interests"}
        content={
          profileData?.interests
            ? `${
                profileData?.interests[
                  Object.keys(profileData?.interests)[0]
                ][0]
              } and ${Object.keys(profileData?.interests).length - 1} more`
            : ""
        }
        // content={
        //   Object.values(interestsFilter).flat().length === 0
        //       ? "No Preference"
        //       : (() => {
        //         const allInterests = Object.values(interestsFilter).flat();
        //         return allInterests.length > 3
        //             ? `${allInterests.slice(0, 3).join(', ')} and ${allInterests.length - 3} more`
        //             : allInterests.join(', ');
        //       })()
        // }
        pressHandler={() =>
          props.navigation.navigate("Interests", {
            back: 0,
            oldInterests: profileData?.interests,
          })
        }
      />
      <Filter
        title={"Personality"}
        content={(() => {
          const traits = profileData?.personalityTraits || [];
          if (traits.length > 4) {
            return traits.slice(0, 4).join(", ") + ", ...";
          }
          return traits.join(", ");
        })()}
        pressHandler={() =>
          props.navigation.navigate("PersonalityTraits", { back: 0 })
        }
      />
      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Education & Career
      </Text>
      <Filter
        title={"Education"}
        content={profileData?.education || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Education", { back: 0 })}
      />
      <Filter
        title={"Profession"}
        content={profileData?.profession || "No Preferences"}
        pressHandler={() =>
          props.navigation.navigate("Profession", { back: 0 })
        }
      />
      <Filter
        title={"Job Title"}
        incomplete
        pressHandler={() => props.navigation.navigate("JobTitle", { back: 0 })}
      />
      <Filter
        title={"Employer"}
        incomplete
        pressHandler={() =>
          props.navigation.navigate(
            "Employer",

            { back: 0 }
          )
        }
      />
      <Text
        style={[
          {
            fontFamily: "Poppins_700Bold",
          },
          styles.heading,
        ]}
      >
        Language & Ethnicity
      </Text>
      <Filter
        title={"Country of Origin"}
        content={profileData?.location || "No Preferences"}
        pressHandler={() =>
          props.navigation.navigate("EthnicGroup", { back: 0 })
        }
      />
      <Filter
        title={"Ethnic Group"}
        content={profileData?.ethnicGroup || "No Preferences"}
        pressHandler={() => props.navigation.navigate("Ethnicity", { back: 0 })}
      />

      {/* modals */}
      <ImageOptions
        openModal={modal}
        setOpenModal={setModal}
        index={imageIndex}
        picker={pickImage}
        swap={setAsMain}
        delete={deleteImage}
      />
      <Loader openModal={loading} setOpenModal={setLoading} />
      <VideoOptions
        openModal={videoModal}
        setOpenModal={setVideoModal}
        delete={deleteVid}
        picker={handleVideo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  heading: {
    fontSize: 20,
    color: AppColors.blackColor,
    marginVertical: 10,
    marginTop: 40,
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(245, 245, 245, 1)",
    padding: 20,
    borderRadius: 10,
    paddingLeft: 20,
    flexDirection: "row",
    marginVertical: 10,
  },
  title: {
    color: AppColors.blackColor,
    fontSize: 14,
  },
  description: {
    color: AppColors.secondaryText,
    fontSize: 12,
  },
  cameraTile: {
    width: (FULL_WIDTH - 80) / 3,
    height: (FULL_WIDTH - 80) / 3,
    borderRadius: 10,
    backgroundColor: "rgba(245, 245, 245, 1)",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  imageTile: {
    width: (FULL_WIDTH - 80) / 3,
    height: (FULL_WIDTH - 80) / 3,
    borderRadius: 10,
    margin: 10,
  },
  overlay: {
    margin: 0,
    backgroundColor: AppColors.transparentBlack,
    width: "100%",
    height: FULL_HEIGHT,
  },
});

export default EditProfile;

const ImageOptions = (props) => {
  return (
    <Modal visible={props.openModal} transparent={true} animationType="fade">
      <View style={styles.overlay}>
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
          {props.index !== 0 && (
            <TouchableOpacity
              onPress={() => {
                props.swap(props.index);
              }}
              style={[
                {
                  backgroundColor: "#FAFAFA",
                  padding: 16,
                  paddingHorizontal: 20,
                  marginBottom: 12,
                  marginRight: 12,
                  borderRadius: 90,
                  borderWidth: 1,
                  borderColor: "rgba(0, 0, 0, 0.05)",
                },
              ]}
            >
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>
                Use as main photo
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              props.picker(props.index);
            }}
            style={[
              {
                backgroundColor: "#FAFAFA",
                padding: 16,
                paddingHorizontal: 20,
                marginBottom: 12,
                marginRight: 12,
                borderRadius: 90,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>
              Replace photo
            </Text>
          </TouchableOpacity>
          {props.index !== 0 && (
            <TouchableOpacity
              onPress={() => {
                props.delete(props.index);
              }}
              style={[
                {
                  backgroundColor: "#FAFAFA",
                  padding: 16,
                  paddingHorizontal: 20,
                  marginBottom: 12,
                  marginRight: 12,
                  borderRadius: 90,
                  borderWidth: 1,
                  borderColor: "rgba(0, 0, 0, 0.05)",
                },
              ]}
            >
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
          <CommonButton
            title={"Cancel"}
            pressHandler={() => {
              props.setOpenModal(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const VideoOptions = (props) => {
  return (
    <Modal visible={props.openModal} transparent={true} animationType="fade">
      <View style={styles.overlay}>
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
          <TouchableOpacity
            onPress={() => props.picker()}
            style={[
              {
                backgroundColor: "#FAFAFA",
                padding: 16,
                paddingHorizontal: 20,
                marginBottom: 12,
                marginRight: 12,
                borderRadius: 90,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>
              Replace Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => props.delete()}
            style={[
              {
                backgroundColor: "#FAFAFA",
                padding: 16,
                paddingHorizontal: 20,
                marginBottom: 12,
                marginRight: 12,
                borderRadius: 90,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>
              Delete Video
            </Text>
          </TouchableOpacity>
          <CommonButton
            title={"Cancel"}
            pressHandler={() => {
              props.setOpenModal(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const Loader = (props) => {
  return (
    <Modal visible={props.openModal} transparent={true} animationType="fade">
      <View
        style={[
          styles.overlay,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FFCC21" />
      </View>
    </Modal>
  );
};
