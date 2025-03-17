import { PopupModal } from "@/components/common/PopupModal";
import React, { createContext, useState, useContext, ReactNode } from "react";

export type ModalTypes = "success" | "error" | "warning" | "internet" | "date" | "profile" | "profile_created" | "profile_success" | "error_validation";

type ModalContextType = {
  openModal: (title: string, description: string, buttonText: string, type: ModalTypes) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    buttonText: "",
    type: "success" as ModalTypes,
  });

  const openModal = (title: string, description: string, buttonText: string, type: ModalTypes) => {
    setModalContent({ title, description, buttonText, type });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <PopupModal
        title={modalContent.title}
        description={modalContent.description}
        buttonText={modalContent.buttonText}
        type={modalContent.type}
        visible={modalVisible}
        onPress={closeModal}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
};

export const useInfoModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
