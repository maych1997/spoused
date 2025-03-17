import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Modal, useModal } from "@/ui";
import { useInfoModal } from "@/context/ModalContext";

const TestPage = () => {
  const { ref, present, dismiss } = useModal();
  return (
    <SafeAreaView className="flex mx-5">
      <Text>Test Page</Text>
      <Button
        onPress={() => {
          present();
        }}
        label="Open Modal"
      />
      <Modal
        snapPoints={["60%"]} // optional
        title="Modal Title"
        ref={ref}
      >
        Modal Content
      </Modal>
    </SafeAreaView>
  );
};

export default TestPage;
