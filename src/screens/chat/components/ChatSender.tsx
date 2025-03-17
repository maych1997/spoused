import React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { AppColors } from "../../../utility/AppColors";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CommonButton from "../../../components/common/CommonButton";
import { FULL_WIDTH } from "../../../utility/Constant"
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

;

const ChatSender = (props: any) => {
  return (
    <View>
      {!props.isUnmatched ? (
        props.recording ?
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingVertical: 12, alignItems: "center" }}>
            <View>
              <Text style={{ fontFamily: "Poppins_500Medium", color: "red", fontSize: 16 }}>Recording</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", columnGap: 18 }}>
              <TouchableOpacity
                onPress={props.clearRecording}
                style={{ height: 35, width: 35, backgroundColor: AppColors.red_FF0000, borderRadius: 1000, justifyContent: "center", alignItems: "center" }}>
                <FontAwesome name={"trash"} size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={props.stopRecording}
              >
                <Entypo
                  name="mic"
                  size={24}
                  color="black"
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            </View>
          </View> :
          !props.recording && props.recordedURI ?
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 12, alignItems: "center" }}>

              <Slider
                style={{ width: "62%", height: 40, marginTop: 10 }}
                minimumValue={0}
                disabled
                maximumValue={props.playbackStatus?.durationMillis || 0}
                value={props.playbackStatus?.positionMillis || 0}
                onSlidingComplete={async (value) => {
                  if (props.sound) {
                    await props.sound.setPositionAsync(value);
                  }
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "center", columnGap: FULL_WIDTH * 0.05 }}>
                <TouchableOpacity
                  onPress={props.isPlaying ? props.pauseSound : props.playSound}
                  style={{ height: 35, width: 35, backgroundColor: AppColors.gray_E8E8E8, borderRadius: 1000, justifyContent: "center", alignItems: "center" }}>
                  {props.isPlaying ? <FontAwesome name={"pause"} size={18} color="black" /> :
                    <FontAwesome name={"play"} size={18} color="black" />
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={props.clearRecording}
                  style={{ height: 35, width: 35, backgroundColor: AppColors.red_FF0000, borderRadius: 1000, justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome name={"trash"} size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={props.uploadAudio}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <MaterialIcons
                    name="send"
                    size={25}
                    color={AppColors.appThemeColor}
                  />
                </TouchableOpacity>
              </View>
            </View> :
            <View style={styles.inputContainer}>
              <View style={styles.input}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: AppColors.greyFill,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 15,
                    width: "100%",
                  }}
                  value={props.inputText}
                  onChangeText={props.setInputText}
                  placeholder={`Message ${String(props.name).split(" ")[0]}`}
                />
              </View>
              {
                props.inputText.length === 0 ?
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={props.openGallery}
                    >
                      <Entypo
                        name="camera"
                        size={24}
                        color="black"
                        style={{ marginLeft: 15 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={props.openMic}
                    >
                      <Entypo
                        name="mic"
                        size={24}
                        color="black"
                        style={{ marginLeft: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                  :
                  <TouchableOpacity
                    onPress={props.sendMessage}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <MaterialIcons
                      name="send"
                      size={25}
                      color={AppColors.appThemeColor}
                      style={{ paddingHorizontal: 15 }}
                    />
                  </TouchableOpacity>

              }
            </View>
      ) : (
        <View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              textAlign: "center",
              fontSize: 16,
              color: AppColors.blackColor,
            }}
          >
            You unmatched with{" "}
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                textAlign: "center",
                fontSize: 16,
                color: AppColors.secondaryText,
              }}
            >
              {props.name.split(" ")[0]}
            </Text>
          </Text>
          <CommonButton
            title="Rematch"
            pressHandler={props.setIsUnmatched}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.greyFill,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
export default ChatSender;
