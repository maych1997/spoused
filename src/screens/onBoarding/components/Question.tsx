import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SearchBar } from "@/components/common/SearchBar";
import { AppColors } from "@/utility/AppColors";
import { verticalScale } from "@/styles/scaling";

export const Question = (props: any) => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(props.options);
  useEffect(() => {
    setFilteredOptions(props.options);
  }, [props.options]);
  
  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      const lowerCasedText = text.toLowerCase();
  
      const filtered = props.options.filter((option: any) => {
        if (typeof option === "string") {
          return option.toLowerCase().startsWith(lowerCasedText);
        }
        return false; // Ignore non-string cases
      });
  
      setFilteredOptions(filtered);
    },
    [props.options]
  );
  
  
useEffect(()=>{
      
  

  if (props.emptySearch==true) {
  console.log(props.emptySearch);
    setSearchText("");
  }
},[searchText,props.emptySearch])

  return (
    <View style={styles.container}>
      {/* Heading and Subheading */}
      <View style={styles.header}>
        <Text style={styles.heading}>{props.heading}</Text>
        {props.back !== 2 && <Text style={styles.subheading}>{props.subheading}</Text>}

        {/* Optional Search Bar */}
        {props.addSearch && (
          <SearchBar
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search"
          />
        )}
      </View>

      {/* Scrollable Content */}

        {React.Children.map(props.children, (child) => {
          return React.cloneElement(child, { filteredOptions:filteredOptions, back: props.back });
        })}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whiteColor,
  },
  header: {
    paddingTop: 16,
    backgroundColor: AppColors.whiteColor,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.blackColor,
  },
  subheading: {
    fontSize: 16,
    color: AppColors.secondaryText,
    marginTop: 8,
  },

});

export default Question;
