import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import Question from "./Question";
import OptionSelect from "@/components/common/OptionSelect";
import InterestedIn from "./InterestedIn";
import Interests from "./Interests";
import Personality from "./Personality";
import HeightInput from "./HeightInput";
import { AppColors } from "@/utility/AppColors";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import {verticalScale} from "@/styles/scaling";

interface DynamicQuestionProps {
  mode: "question" | "height" | "interestedIn" | "personality" | "interest" | "biography";
  addSearch: boolean;
  options: any;
  selected: any;
  setSelected: any;
  sectionTitle: string;
  subTitle: string;
  emptySearch:boolean;
}

const DynamicQuestion: React.FC<DynamicQuestionProps> = ({
  mode,
  addSearch,
  options,
  selected,
  sectionTitle,
  setSelected,
  subTitle,
  emptySearch,
}) => {
  const handleTextChange = (text: string) => {
    setSelected(text);
  };

  const renderComponentByMode = () => {
    switch (mode) {
      case "question":
        return (
          <Question
            setSelected={setSelected}
            heading={sectionTitle}
            subheading={subTitle}
            addSearch={addSearch}
            emptySearch={emptySearch}
            options={options}
          >
            <OptionSelect selected={selected} setSelected={setSelected} />
          </Question>
        );

      case "interestedIn":
        return (
          <InterestedIn
            heading={sectionTitle}
            subheading={subTitle}
            selected={selected}
            setSelected={setSelected}
          />
        );

      case "interest":
        return <Interests selectedInterests={selected} setSelectedInterests={setSelected} />;

      case "personality":
        return <Personality selectedTraits={selected} setSelectedTraits={setSelected} />;

      case "height":
        return <HeightInput setHeightFilter={setSelected} heightFilter={selected} />;

      case "biography":
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{paddingBottom: verticalScale(150)}}>
            <Text style={styles.biographyTitle}>Add Biography</Text>
            <Text style={styles.biographySubtitle}>Add Your Bio</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
                placeholder="Write here..."
                placeholderTextColor={AppColors.greyOutline}
                value={selected}
                onChangeText={handleTextChange}
                multiline
                maxLength={500}
              />
            </View>
            <View style={{display:'flex',justifyContent:'flex-end',alignItems:'flex-end'}}>
              <Text style={{fontSize:10,color:AppColors.gray_3E454B}}>{selected?.length==undefined?0:selected?.length}/500</Text>
            </View>
          </View>
          </TouchableWithoutFeedback>
        );

      default:
        return null;
    }
  };

  return renderComponentByMode();
};

export default DynamicQuestion;

const styles = StyleSheet.create({
  biographyTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: AppColors.blackColor,
  },
  biographySubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: AppColors.secondaryText,
    marginVertical: 10,
  },
  inputContainer: {
    borderColor: AppColors.greyOutline,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    height: 100,
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: AppColors.greyFill,
    paddingTop: 20,
  },
  input: {
    paddingHorizontal: 3,
    width: "100%",
    textAlignVertical: "top",
  },
});
