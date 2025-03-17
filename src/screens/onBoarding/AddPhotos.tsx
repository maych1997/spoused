import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Switch } from "@rneui/themed";
import { AppColors } from "../../utility/AppColors";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FlatList } from "react-native";
import { FULL_HEIGHT, FULL_WIDTH } from "../../utility/Constant";
import { AntDesign } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import CommonButton from "../../components/common/CommonButton";
import { useSelector, useDispatch } from "react-redux";
import { updatemyprofile, updatephotos } from "../../../redux/authSlice";
import { addPhotosApi } from "../../../api/ProfileCompletion/PostApis/addPhotosApi";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { getMyProfileApi } from "../../../api/ProfileCompletion/GetApis/getMyProfileApi";
import { swapPhotos } from "../../../api/ProfileCompletion/PostApis/swapPhotos";
import { deletePhoto } from "../../../api/ProfileCompletion/PostApis/deletePhoto";
import { Entypo } from "@expo/vector-icons";
import { updateBlurPhotoApi } from "../../../api/ProfileCompletion/PostApis/updateBlurPhotosApi";
import { useInfoModal } from "@/context/ModalContext";

const AddPhotos = forwardRef(({ setCurrentStep }: { setCurrentStep: (step: number) => void }, ref: any) => {
  const [toggleBlurPhoto, setToggleBlurPhoto] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { openModal } = useInfoModal();
  useEffect(() => {
    setProfileData(reduxState?.auth?.user?.myprofile);
  }, [reduxState?.auth?.user?.myprofile]);

  const pickImage = async (indexToAddTo: number) => {
    console.log("this is the pick image");


    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Allow the app to access your media library from settings.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("this is the image that we picked");
    console.log(result);
    console.log("this is the image that we picked");
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
          // Alert.alert("uploading failed", "Please upload a photo with your face visible");
          openModal("uploading failed", "Please upload a photo with your face visible", "Ok", "error_validation");
          return
        }
        if (data.verified) {
          try {
            // Navigate to the next screen after fetching profile data
            if (reduxState.auth.token) {
              // const location = await Location.getCurrentPositionAsync({});
              // const coordinates = [location.coords.latitude, location.coords.longitude];
              const coordinates = [33.5651, 73.0169]
              const response = await getMyProfileApi(reduxState.auth.token, coordinates);

              dispatch(updatemyprofile(response.data));
              setLoading(false);

              openModal("Photo uploaded", "Congratulations! Your photo has been uploaded successfully.", "Ok", "success");
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
        const coordinates = [location.coords.latitude, location.coords.longitude];
        const response = await getMyProfileApi(reduxState.auth.token, coordinates);
        dispatch(updatemyprofile(response.data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error setting as main:", error);
    }
  }

  const deleteImage = async (index: number) => {
    try {
      setModal(false);
      setLoading(true);
      const res = await deletePhoto(reduxState.auth.token, index);
      if (res.success) {
        const location = await Location.getCurrentPositionAsync({});
        const coordinates = [location.coords.latitude, location.coords.longitude];
        const response = await getMyProfileApi(reduxState.auth.token, coordinates);
        dispatch(updatemyprofile(response.data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  useImperativeHandle(ref, () => ({
    handleNextPress: () => {
    if (profileData.photos.filter(photo => photo !== null).length >= 2) {
          setCurrentStep(3);
        } else {
          Alert.alert("Upload more photos", "Please upload at least 2 photos to proceed.");
        }
    },
}));
  const handleBlurPhotos = async () => {
    try {
      setToggleBlurPhoto(!toggleBlurPhoto);
      const res = await updateBlurPhotoApi(reduxState.auth.token, !toggleBlurPhoto);

      if (res.success) {
        dispatch(updatemyprofile(res.user));
      }
    } catch (error) {
      console.error("Error updating gold member:", error);
    }
  }

  return (
      <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
        <View style={styles.contentWrapper}>
          <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 24,
                color: AppColors.blackColor,
              }}
          >
            Add your Photos
          </Text>
          <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: AppColors.secondaryText,
                marginVertical: 10,
              }}
          >
            Add at least two photos
          </Text>
          <View style={styles.blurPhotoContainer}>
            <View>
              <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 14,
                    color: AppColors.blackColor,
                    marginBottom: 5,
                  }}
              >
                Blur Photos
              </Text>
              <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: AppColors.blackColor,
                  }}
              >
                Blur your photos from others
              </Text>
            </View>
            <Switch
                value={toggleBlurPhoto}
                onValueChange={handleBlurPhotos}
                color={AppColors.appThemeColor}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            {profileData && profileData.photos && profileData.photos[0] ? (
                <TouchableOpacity onPress={() => { setImageIndex(0); setModal(true) }}>
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
                <TouchableOpacity onPress={() => { setImageIndex(1); setModal(true) }}>
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
                <TouchableOpacity onPress={() => { setImageIndex(2); setModal(true) }}>
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
                <TouchableOpacity onPress={() => { setImageIndex(3); setModal(true) }}>
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
                <TouchableOpacity onPress={() => { setImageIndex(4); setModal(true) }}>
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
                <TouchableOpacity onPress={() => { setImageIndex(5); setModal(true) }}>
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
        </View>
        {/* <TouchableOpacity
            style={[
              styles.buttonStyle,
              isButtonDisabled && styles.disabledButtonStyle,
            ]}
            onPress={handleNextPress}
            disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity> */}

        <ImageOptions openModal={modal} setOpenModal={setModal} index={imageIndex} picker={pickImage} swap={setAsMain} delete={deleteImage} />
        <Loader openModal={loading} setOpenModal={setLoading} />

      </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  headerContainer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  contentWrapper: {
    padding: 15,
    marginTop: 30,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    padding: 15,
  },
  blurPhotoContainer: {
    width: "100%",
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonStyle: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: AppColors.appThemeColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButtonStyle: {
    backgroundColor: AppColors.disabledColor,
  },
  buttonText: {
    color: AppColors.whiteColor,
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
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

export default AddPhotos;


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
            {props.index !== 0 && <TouchableOpacity
                onPress={() => { props.swap(props.index) }}
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
            </TouchableOpacity>}
            <TouchableOpacity
                onPress={() => { props.picker(props.index) }}
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
            {
                props.index !== 0 &&
                <TouchableOpacity
                    onPress={() => { props.delete(props.index) }}
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
            }
            <CommonButton
                title={"Cancel"}
                pressHandler={() => {
                  props.setOpenModal(false);
                }}
            />
          </View>
        </View>
      </Modal>
  )
}

const Loader = (props) => {

  return (
      <Modal visible={props.openModal} transparent={true} animationType="fade">
        <View style={[styles.overlay, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#FFCC21" />
        </View>
      </Modal>
  )
}