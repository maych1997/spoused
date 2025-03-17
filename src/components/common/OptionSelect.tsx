import React, { useCallback, useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { Pressable, Text, View, colors } from "@/ui";
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from "@/styles/scaling";

const OptionItem = React.memo(
  ({selected, item, isSelected, onOptionChange }: { selected:string,item: string; isSelected: boolean; onOptionChange: (option: string) => void }) => {
    return (
      <Pressable
        onPress={() => onOptionChange(item)}
        className={`flex-row justify-between items-center rounded-10 px-3 py-4 mb-2 ${
          isSelected ? "border-main" : "border-gray-200"
        } bg-[#FAFAFA] border`}
      >
        <Text className="text-black">{item}</Text>
        <Checkbox
          value={isSelected}
          onValueChange={() => onOptionChange(item)}
          color={isSelected ? colors.main : colors.gray[500]}
          style={{
            backgroundColor: isSelected ? colors.main : colors.gray[500],
            borderRadius: 99,
          }}
        />
      </Pressable>
    );
  }
);

const OptionSelect = ({ selected, setSelected, filteredOptions, back }: any) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(selected);
  useEffect(() => {
    setSelectedOption(selected)
  },[selected])
  const handleOptionChange = useCallback(
    (option: string) => {
      setSelectedOption(option);
      setSelected(option); // Assuming setSelected updates the external state
    },
    [setSelected]
  );

  useEffect(() => {
    if (back === 2 && filteredOptions[0] !== "No Preference") {
      filteredOptions.unshift("No Preference");
    }
  }, [back, filteredOptions]);

  return (
    <View style={{marginBottom:'20%'}}>
      <FlashList
        data={filteredOptions}
        extraData={selectedOption} // Only re-render based on selected item
        renderItem={({ item }: any) => <OptionItem item={item} selected={selected} isSelected={selectedOption === item} onOptionChange={handleOptionChange} />}
        keyExtractor={(item) => item as string}
        estimatedItemSize={55}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default OptionSelect;
