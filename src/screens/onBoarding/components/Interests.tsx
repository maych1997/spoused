import React, { useCallback, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { AppColors } from "../../../utility/AppColors";
import { useInfoModal } from "@/context/ModalContext";
import { red } from "colorette";
import { horizontalScale, verticalScale } from "@/styles/scaling";
import Fontisto from "react-native-vector-icons/FontAwesome6";
import Swiper from "react-native-swiper";
import FlatGrid from "react-native-super-grid";
const screenWidth = Dimensions.get("window").width;

const Interests = ({
  selectedInterests = {
    foodanddrinks: [],
    sports: [],
    entertainment: [],
    hobbies: [],
  },
  setSelectedInterests,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const swiperRef = useRef(null);

  const { openModal } = useInfoModal();
  // Titles for each section
  const sectionTitles = [
    "What Kind Of Food Do You Like?",
    "Which Of This Sports Interests You?",
    "Which Entertainment Option Interest You?",
    "Which Are Your Favourite Hobbies",
  ];
  const sections = [
    {
      title: "FOOD & DRINK",
      key: "foodanddrinks",
      interest: [
        "Baking",
        "Bubble Tea",
        "Cooking",
        "Caking Decoration",
        "Coffee",
        "Pizza",
        "Junk Food",
        "Sushi",
        "Vegan",
        "Vegetarian",
        "Meat Lover",
        "Fish",
        "Chips",
        "Healthy Eating",
        "Eating out",
        "Chocolate",
      ],
    },
    {
      title: "SPORTS",
      key: "sports",
      interest: [
        "Basketball",
        "Soccer",
        "Tennis",
        "Running",
        "Swimming",
        "Yoga",
        "Cycling",
        "Golf",
        "Cricket",
        "Snowboarding",
        "Surfing",
        "Volleyball",
      ],
    },
    {
      title: "ENTERTAINMENT",
      key: "entertainment",
      interest: [
        "Netflix & Streaming",
        "Gaming",
        "Vlogging & Content Creation",
        "Movies & TV Shows",
        "Podcasts",
      ],
    },
    {
      title: "HOBBIES",
      key: "hobbies",
      interest: [
        "Book Reading",
        "Writing & Blogging",
        "Music",
        "Painting & Drawing",
        "Photography",
      ],
    },
  ];
  // Count the total number of selected interests across all sections
  const totalSelectedInterests = Object.values(selectedInterests).reduce(
    (total, interests) => total + interests.length,
    0
  );

  const handleInterestPress = useCallback(
    (category, interest) => {
      setSelectedInterests((prevState) => {
        const updatedSelection = { ...prevState };
        const totalInterests = totalSelectedInterests; // Use the total count across sections

        if (updatedSelection[category]) {
          if (updatedSelection[category].includes(interest)) {
            // If the interest is already selected, it's safe to remove it without checking the limit
            updatedSelection[category] = updatedSelection[category].filter(
              (i) => i !== interest
            );
          } else {
            // Only add the interest if the total number of interests is less than 15
            if (totalInterests < 15) {
              updatedSelection[category] = [
                ...updatedSelection[category],
                interest,
              ];
            } else {
              // Optionally, alert the user that they can't select more than 15 interests
              openModal(
                "Limit Exceeded",
                "You can select up to 15 interests only.",
                "Try Again",
                "error"
              );
            }
          }
        } else {
          // If the category doesn't exist and the total number of interests is less than 15, add the category with the interest
          if (totalInterests < 15) {
            updatedSelection[category] = [interest];
          } else {
            // Optionally, alert the user that they can't select more than 15 interests
            showToaster(
              "Limit Exceeded",
              "You can select up to 15 interests only.",
              "Try Again",
              "error"
            );
          }
        }
        return updatedSelection;
      });
    },
    [totalSelectedInterests]
  );
  // Check if the interest is selected and set color accordingly
  const isInterestSelected = (category, interest) =>
    selectedInterests[category]?.includes(interest);

  // Function to render each section's interests
  const renderSection = (section) => (
    <>
      <Text style={styles.sectionTitle}>{section.title}</Text>

      {/* Display selected count (Added this part) */}
      <Text style={styles.selectedCountText}>
        Selected: {totalSelectedInterests} of 15
      </Text>
      <View style={styles.interestsWrapper} key={section.key}>
        {section.interest.map((interest) => {
          return (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestItem,
                isInterestSelected(section.key, interest) &&
                  styles.selectedInterestItem, // Apply selected style
              ]}
              onPress={() => handleInterestPress(section.key, interest)} // Handle press
            >
              <Text
                style={[
                  styles.interestText,
                  isInterestSelected(section.key, interest) &&
                    styles.selectedInterestText, // Change text color if selected
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          );
        })}

      </View>
    </>
  );

  // Handle swipe navigation for sections
  const scrollToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      if (swiperRef.current) {
        // setCurrentSectionIndex(currentSectionIndex + 1);
        swiperRef.current.scrollBy(1);
      }
    }
  };

  const scrollToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      // setCurrentSectionIndex(currentSectionIndex - 1);
      swiperRef.current.scrollBy(-1);
    }
  };

  return (
    <View style={styles.contentWrapper}>
      {/* Render Progress Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{sectionTitles[currentSectionIndex]}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={scrollToPreviousSection}>
          <View style={styles.arrowLeft}>
            <Fontisto
              name="caret-left"
              color={
                sections[currentSectionIndex].title === "FOOD & DRINK"
                  ? AppColors.whiteColor
                  : AppColors.appThemeColor
              }
              size={30}
            ></Fontisto>
          </View>
        </TouchableOpacity>
        <Text style={styles.sectionIndicator}>
          {sections[currentSectionIndex].title}
        </Text>
        <TouchableOpacity onPress={scrollToNextSection}>
          <View style={styles.arrowLeft}>
            <Fontisto
              name="caret-right"
              color={
                sections[currentSectionIndex].title === "HOBBIES"
                  ? AppColors.whiteColor
                  : AppColors.appThemeColor
              }
              size={30}
            ></Fontisto>
          </View>
        </TouchableOpacity>
      </View>
      {/* Horizontal ScrollView for sections */}
      {/* <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}  // Disable manual scroll, use buttons to navigate
            contentOffset={{ x: currentSectionIndex * screenWidth, y: 0 }}
        >
          {sections.map((section) => renderSection(section))}
        </ScrollView> */}
        <View style={{marginBottom:'10%'}}>
      <Swiper
        showsPagination={false} // This disables the dots
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={swiperRef}
        loop={false}
        onIndexChanged={(index) => {
          setCurrentSectionIndex(index);
        }}
      >
        {sections.map((section) => renderSection(section))}
      </Swiper>
      </View>
      {/* Navigation Buttons */}

      {/*/!* Next Button *!/*/}
      {/*<TouchableOpacity style={styles.nextButton}>*/}
      {/*  <Text style={styles.nextButtonText}>Next</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 15,
    flex:1  
  },
  header: {
    marginTop: horizontalScale(19),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCountText:{
    paddingBottom:15,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: AppColors.blackColor,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: AppColors.blackColor,
    marginVertical: 10,
  },
  interestsContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  interestsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows items to wrap to new lines,
  },
  interestItem: {
    backgroundColor: "#FAFAFA",
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginRight: 12,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  selectedInterestItem: {
    backgroundColor: AppColors.appThemeColor, // Yellow for selected interests
    borderColor: AppColors.whiteColor,
    borderRadius: 90,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  selectedInterestText: {
    fontFamily: "Poppins_600SemiBold",
  },
  interestText: {
    fontSize: 14,
    color: AppColors.blackColor,
    fontFamily: "Poppins_600SemiBold",
    width: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(20),
    backgroundColor: AppColors.gray_F5F5F5,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(7),
    borderRadius: horizontalScale(20),
  },
  arrowButton: {
    fontSize: 30,
    color: AppColors.appThemeColor,
  },
  arrowButtonDisable: {
    fontSize: 30,
    color: AppColors.whiteColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  sectionIndicator: {
    fontSize: 17.5,
    // fontFamily: 'Poppins_500Medium',
    fontFamily: "Poppins_700Bold",
  },
  arrowLeft: {
    padding: 1,
    borderRadius: 100,
    backgroundColor: AppColors.selectedTabColor,
    width: verticalScale(30),
    height: verticalScale(30),
    alignItems: "center",
    justifyContent: "center",
  },

  arrowRight: {
    padding: 1,
    borderRadius: 100,
    backgroundColor: "grey",
    width: verticalScale(30),
    height: verticalScale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  // nextButton: {
  //   backgroundColor: "red",
  //   color: "green",
  //   padding: 15,
  //   borderRadius: 50,
  //   alignItems: 'center',
  // },
  // nextButtonText: {
  //   fontSize: 18,
  //   color: 'white',
  // },
});

export default Interests;
