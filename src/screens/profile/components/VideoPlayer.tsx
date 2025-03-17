// VideoPlayer.js
import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

const VideoPlayer = ({ uri }) => {
  const videoRef = useRef(null);

  const playVideo = async () => {
    if (uri && videoRef.current) {
      try {
        await videoRef.current.playAsync();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

  useEffect(() => {
    playVideo();
  }, [uri]);

  return (
    <View style={styles.container}>
      {uri && (
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri }}
          useNativeControls
          resizeMode="cover"
          shouldPlay
          isLooping
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    alignSelf: "center",
    width: 350,
    height: 220,
  },
});

export default VideoPlayer;
