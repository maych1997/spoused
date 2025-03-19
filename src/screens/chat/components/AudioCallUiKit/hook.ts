import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
} from "react-native-agora";

const useAgoraAudio = (
  appId: string,
  channelName: string,
  token: string,
) => {
  const agoraEngineRef = useRef<IRtcEngine | null>(
    null
  ) as MutableRefObject<IRtcEngine | null>;
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isMuted, setMuted] = useState(false);
  
  useEffect(() => {
    const setupAgora = async () => {
      if (Platform.OS === "android") {
        const granted = await requestPermissions();
        if (!granted) {
          console.error("Microphone permission denied");
          return;
        }
      }

      const agoraEngine = await createAgoraRtcEngine();
      // Assign to ref
      agoraEngineRef.current = agoraEngine;
      agoraEngineRef.current.initialize({ appId });

      // Set channel profile
      agoraEngineRef.current.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication
      );
      agoraEngineRef.current.setClientRole(
        ClientRoleType.ClientRoleBroadcaster
      );
      // Event Listeners
      agoraEngineRef.current.addListener(
        "onJoinChannelSuccess",
        (_channel, euid) => {
          console.log("Joined Channel Successfully:", euid);
          setMessage(`Joined channel: ${channelName}`);
          setIsJoined(true);
        }
      );

      agoraEngineRef.current.addListener("onLeaveChannel", (_channel, euid) => {
        console.log("Left Channel Successfully:", euid);
        setMessage("Left the channel");
        setIsJoined(false);
      });

      agoraEngineRef.current.addListener("onUserJoined", (_channel, ruid) => {
        console.log(`Remote user ${ruid} joined`);
        setMessage(`Remote user ${ruid} joined`);
        setRemoteUid(ruid);
      });


      agoraEngineRef.current.addListener("onUserOffline", (_channel, ruid) => {
        console.log(`Remote user ${ruid} left`);
        setMessage(`Remote user ${ruid} left`);
        setRemoteUid(null);
      });
      
      await joinChannel();
      // Join the channel
     
    };

   
    setupAgora();

    return () => {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.removeAllListeners();

        const leaveChannelResult: any = agoraEngineRef.current.leaveChannel();

        if (leaveChannelResult instanceof Promise) {
          leaveChannelResult
            .then(() => {
              agoraEngineRef.current?.release();
              agoraEngineRef.current = null;
            })
            .catch((error) => {
              console.error("Error leaving channel:", error);
            });
        } else {
          // If leaveChannel() is not a Promise, execute cleanup immediately
          agoraEngineRef.current?.release();
          agoraEngineRef.current = null;
        }
      }
    };
  }, [appId, channelName, token]);



  const joinChannel = async () => {
    if (agoraEngineRef.current) {
      try {
        await agoraEngineRef.current.joinChannel(
          "", // Token (empty string if not using tokens)
          channelName, // Channel name
          0, // No optional info
          {
            token: token, // Pass the token if using authentication
          }
        );
      } catch (error) {
        console.error("joinChannel error:", error);
      }
    }
  };


  const leaveChannel = async () => {
    if (agoraEngineRef.current) {
      await agoraEngineRef.current.leaveChannel();
      // // console.log('Remote User',remoteUid);
      // setIsJoined(false);
      // setMessage('Left the channel');
      // setRemoteUid(null);
    }
  };

  const toggleMute = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.muteLocalAudioStream(!isMuted);
      setMuted((prev) => !prev);
    }
  };

  return {
    isJoined,
    remoteUid,
    message,
    joinChannel,
    leaveChannel,
    isMuted,
    toggleMute,
  };
};

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // Assume iOS has permissions by default
};

export default useAgoraAudio;
