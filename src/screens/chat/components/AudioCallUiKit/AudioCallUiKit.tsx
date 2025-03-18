import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useAgoraAudio from './hook';

interface AudioCallUiKitProps {
  appId: string;
  channelName: string;
  callState: boolean;
  onHangUp: () => void;
  userImage: string;
  username: string;
  ruid: string;
  euid:string;
  token: string;
}

const AudioCallUiKit: React.FC<AudioCallUiKitProps> = ({ appId, channelName, callState, onHangUp, userImage, username,ruid,euid, token }) => {
  const { isJoined, remoteUid, message, joinChannel, leaveChannel, isMuted, toggleMute } = useAgoraAudio(appId, channelName,ruid,euid,token);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isJoined && remoteUid !== 0) { // Only start timer when remote user joins
      timer = setInterval(() => {
        setCallTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setCallTime(0); // Reset call time when no one is connected
    }
    return () => clearInterval(timer);
  }, [isJoined, remoteUid]);

  useEffect(() => {
    if (callState) joinChannel();
    else if (isJoined) leaveChannel();
  }, [callState]);

  if (!isJoined) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.username}>{username}</Text>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <Text style={styles.callTime}>
          {remoteUid === 0 ? "Connecting..." : formatTime(callTime)}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={toggleMute} style={styles.iconButton}>
          <FontAwesome name={isMuted ? "microphone-slash" : "microphone"} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          leaveChannel();
          onHangUp();
        }} style={[styles.iconButton, styles.hangUpButton]}>
          <FontAwesome name="phone" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  callTime: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: '#333',
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 20,
  },
  hangUpButton: {
    backgroundColor: 'red',
  },
});

export default AudioCallUiKit;
