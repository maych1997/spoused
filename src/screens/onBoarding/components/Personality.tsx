import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppColors } from "../../../utility/AppColors";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import Toast from "react-native-toast-message";
import {useInfoModal} from "@/context/ModalContext";


const Personality = ({ selectedTraits = [], setSelectedTraits }) => {
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
  });
  const { openModal } = useInfoModal();

  const personalityTraits = [
    "Able", "Accepting", "Adaptable", "Bold", "Brave", "Calm", "Caring", 
    "Cheerful", "Clever", "Complex", "Confident", "Dependable", "Dignified", 
    "Empathetic", "Energetic", "Extroverted", "Friendly", "Giving", "Happy", 
    "Helpful", "Idealistic", "Independent", "Ingenious", "Intelligent", 
    "Introverted", "Kind", "Knowledgeable", "Logical", "Loving", "Mature", 
    "Modest", "Nervous", "Observant", "Organized", "Patient", "Powerful", 
    "Proud", "Quiet", "Reflective", "Relaxed", "Religious", "Responsive", 
    "Searching", "Self-assertive", "Self-conscious", "Sensible", "Sentimental", 
    "Shy", "Silly", "Spontaneous", "Sympathetic", "Tense", "Trustworthy", 
    "Warm", "Wise", "Witty"
  ];

  const showToast = (title, message) => {
    Toast.show({
      type: "error",
      position: "top",
      text1: title,
      text2: message,
      visibilityTime: 3500,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  const handleTraitPress = (trait) => {
    const isSelected = selectedTraits.includes(trait);

    setSelectedTraits((prevTraits) => {
      console.log("this is the prevTraits");
      console.log(prevTraits);
      console.log("this is the prevTraits");
      let updatedSelection: any[] = []
      if(prevTraits !==undefined) {
         updatedSelection = [...prevTraits];  
      } else{
        console.log("this is undefined");
      }
      if (isSelected) {
        updatedSelection.splice(updatedSelection.indexOf(trait), 1);
      } else if (updatedSelection.length < 5) {
        updatedSelection.push(trait);
      } else {
        openModal("Limit Exceeded","You can select up to 5 traits only." , "Try again", "error");

      }
      return updatedSelection;
    });
  };

  const RenderItem = ({ item }) => {
    // const isSelected = selectedTraits.includes(item);
    const isSelected = Array.isArray(selectedTraits) && selectedTraits.includes(item);

    return (
      <TouchableOpacity
        key={item}
        style={[
          styles.traitButton,
          isSelected && styles.traitButtonSelected,
        ]}
        onPress={() => handleTraitPress(item)}
      >
        <Text style={styles.traitText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.contentWrapper}>
      <Text style={styles.titleText}>Describe Your{"\n"}Personality</Text>
      <Text style={styles.subheading}>
        Select 5 Options That Best Describe You
      </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.traitsContainer}
      >
        {personalityTraits.map((trait) => (
          <RenderItem key={trait} item={trait} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 15,
    marginTop: 15,
  },
  titleText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: AppColors.blackColor,
  },
  subheading: {
    fontSize: 16,
    color: AppColors.secondaryText,
    marginTop: 8,
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  traitButton: {
    backgroundColor: "#FAFAFA",
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginRight: 12,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  traitButtonSelected: {
    backgroundColor: AppColors.appThemeColor,
    borderColor: AppColors.whiteColor,
  },
  traitText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",

  },
});

export default Personality;
