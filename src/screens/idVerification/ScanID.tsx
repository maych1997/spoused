import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Button,
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
import CommonButton from "../../components/common/CommonButton";
import { FULL_WIDTH } from "../../utility/Constant";
import globalStyles from "../../styles/globalStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { color } from "@rneui/base";
import { useSelector, useDispatch } from "react-redux";
import { updateimage1redux } from "../../../redux/authSlice";
import Toast from "react-native-toast-message";

const ScanID = (props) => {
  const [fontsLoaded] = useFonts({
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
  const [facing, setFacing] = useState("back");
  const [captBut, setCaptBut] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
    if(!permission) {
      requestPermission();
    }
  }, []);


  if (!permission) {
    return <View />;
  }



  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const showToast = (title: string, message: string) => {

    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  }

  async function captureImage() {
    if (cameraRef.current) {
      setCaptBut(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setCapturedImage(photo.uri);
      setBase64Image(photo);
    }
  }

  const handleSubmit = () => {
    if (base64Image) {
      dispatch(updateimage1redux(base64Image));
      props.navigation.navigate("ConfirmIdentity", {
        stepCompleted: 1,
        base64Image: base64Image,
      });
    } else {
      showToast("Error", "Please take image of your ID");
    }
  }

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setBase64Image(null);
    setCaptBut(false);
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.androidSafeArea]}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={30}
          onPress={() => props.navigation.navigate("UploadID")}
          color="black"
          style={{ position: "absolute", left: 0 }}
        />
      </View>
      {/* <Image
        source={{
          uri: `data:image/png;base64,${reduxState.auth.user.image1redux}`,
        }}
        style={{ maxHeight: 600, height: 250, marginTop: 40 }}
        resizeMode="contain"
      /> */}
      {capturedImage ? (
        <Image
          source={{ uri: capturedImage }}
          style={{ maxHeight: 600, height: 250, marginTop: 40 }}
          resizeMode="contain"
        />
      ) : (
        <CameraView style={styles.camera} ref={cameraRef} />
      )}
      {captBut == false && (
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            width: 55,
            height: 55,
            alignSelf: "center",
            borderRadius: 100,
            marginTop: -70,
            borderColor: "lightgrey",
            borderWidth: 2,
          }}
          onPress={captureImage}
        ></TouchableOpacity>
      )}

      <View style={{ padding: 15, width: 400 }}>
        <Text
          style={[
            styles.lightText,
            {
              fontFamily: "Poppins_500Medium",
              marginVertical: 20,
            },
          ]}
        >
          Scan Your Front Page Of ID Document
        </Text>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <CommonButton
          title="Submit"
          pressHandler={handleSubmit}
        />
        {
          base64Image &&
          <TouchableOpacity
            onPress={handleRetakePhoto}
            style={{ alignItems: "center", marginTop: 0 }}
          >
            <Text style={{ color: AppColors.primaryText }}>
              Retake Photo
            </Text>
          </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  heading: {
    fontSize: 16,
    color: AppColors.blackColor,
  },
  lightText: {
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  scanContainer: {
    backgroundColor: AppColors.greyFill,
    height: 240,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: 250,
    alignSelf: "center",
    width: "90%",
    marginTop: 30,
    borderRadius: 25,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default ScanID;
