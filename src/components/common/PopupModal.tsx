import { Modal, StyleSheet } from "react-native";
import React from "react";
import { Button, Text, View, colors } from "@/ui";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, ExclaminationMark, Lock, Profile, ProfileCreated, Website , ProfileIcon } from "@/ui/icons";
import { ModalTypes } from "@/context/ModalContext";
import { verticalScale } from "react-native-size-matters";

type PopupModalType = {
  title: string;
  description: string;
  buttonText: string;
  type: ModalTypes;
  visible: boolean;
  onPress: () => void;
  onClose: () => void;
};
// Configuration for modal types
const modalConfig = {
  success: {
    color: colors.main,
    icon: <Ionicons name="checkmark" size={70} color="black" />,
  },
  error: {
    color: colors.info_red,
    icon: <ExclaminationMark width={26} height={70} />,
  },
  error_validation: {
    color: colors.info_red,
    icon: <Lock />,
  },
  warning: {
    color: colors.main,
    icon: <Lock />,
  },
  internet: {
    color: colors.info_red,
    icon: <Website color={colors.white} width={70} height={70} />,
  },
  date: {
    color: colors.info_red,
    icon: <Calendar />,
  },
  profile: {
    color: colors.info_red,
    icon: <Profile />,
  },
  profile_success: {
    color: colors.main,
    icon: <Profile />,
  },
  profile_created: {
    color: colors.main,
    icon: <ProfileCreated />,
  },
  profile_icon: {
    colors: colors.info_red,
    icon: <ProfileIcon />,
  },
  default: {
    color: colors.main,
    icon: null,
  },
};
export const PopupModal = ({ title, description, buttonText, type, visible, onPress, onClose }: PopupModalType) => {
  const { color, icon } = modalConfig[type] || modalConfig.default;

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <View className="bg-white p-5 rounded-20 justify-center w-11/12">
          <ModalIconWrapper type={type} icon={icon} color={color} />
          <Text
            style={{
              color: color,
            }}
            className={`text-2xl font-bold text-center`}
          >
            {title}
          </Text>
          <Text className="text-center mt-3 text-black  font-normal text-base">{description}</Text>
          <View style={styles.buttonMargin}>
          <Button title={buttonText} onPress={onPress} className="mt-5 rounded-full" textClassName="text-center font-bold" fullWidth={true} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ModalIconWrapper = ({ type, icon, color }: { type: ModalTypes; icon: React.ReactNode; color: string }) => {
  return type === "profile_created" ? (
    <View className="flex items-center justify-center">{icon}</View>
  ) : (
    <View
      style={{
        backgroundColor: color,
      }}
      className="p-5 rounded-full bg-white flex items-center justify-center w-32 h-32 self-center my-5"
    >
      {icon}
    </View>
  );
};
const styles = StyleSheet.create({
  buttonMargin: {
    marginTop: verticalScale(10)
  }
});

