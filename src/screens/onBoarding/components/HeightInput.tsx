import React, { useState, useEffect, useCallback } from "react";
import { Pressable, Text, View } from "@/ui";
import { RulerPicker } from "react-native-ruler-picker";
import { HeaderTexts } from "@/components/common/header-texts";

// Type for the height filter prop
type HeightFilter = {
  cm: number;
  ft: number;
};

// Props for the HeightInput component
interface HeightInputProps {
  setHeightFilter: (filter: HeightFilter) => void;
  heightFilter: HeightFilter;
}

// Utility function for converting cm to feet and inches
const convertCmToFeetInches = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches, formatted: `${feet}'${inches}"` };
};

// Props for the UnitSwitcher component
interface UnitSwitcherProps {
  type: "cm" | "ft";
  setType: (type: "cm" | "ft") => void;
}

// Unit switcher component (reusable)
const UnitSwitcher: React.FC<UnitSwitcherProps> = ({ type, setType }) => {
  return (
    <View className="flex-row justify-between items-center w-full h-16 bg-gray-100 rounded-full mt-4 p-4">
      <Pressable onPress={() => setType("cm")} className={`h-10 rounded-full items-center justify-center w-40 ${type === "cm" ? "bg-main" : ""}`}>
        <Text className={`text-black ${type === "cm" ? "font-medium" : ""}`}>Centimeters</Text>
      </Pressable>
      <Pressable onPress={() => setType("ft")} className={`h-10 rounded-full items-center justify-center w-40 ${type === "ft" ? "bg-main" : ""}`}>
        <Text className={`text-black ${type === "ft" ? "font-medium" : ""}`}>Inches</Text>
      </Pressable>
    </View>
  );
};

// Main HeightInput component
const HeightInput: React.FC<HeightInputProps> = ({ setHeightFilter, heightFilter={ cm: 122, ft: 4 } }) => {
  const [cm, setCm] = useState<number>(heightFilter?heightFilter.cm:0);
  const [ft, setFt] = useState<number>(heightFilter?heightFilter.ft:0);
  const [type, setType] = useState<"cm" | "ft">("cm");

  // Update state when heightFilter prop changes
  useEffect(() => {
    setCm(heightFilter.cm);
    setFt(heightFilter.ft);
  }, [heightFilter]);

  // Memoized function for height conversion
  const handleHeightChange = useCallback(
    (value: number) => {
      const { formatted } = convertCmToFeetInches(value);
      setFt(formatted);
      setHeightFilter({ cm: value, ft: formatted });
    },
    [setHeightFilter]
  );

  return (
    <View className="flex-1">
      <HeaderTexts title="How tall are you?" subTitle="Please select your height" />

      {/* Unit switcher component */}
      <UnitSwitcher type={type} setType={setType} />

      {/* Ruler picker */}
      <RulerPicker
        initialValue={
          type === "cm"
            ? parseFloat(cm as any)
            : parseFloat(ft as any)
        }
        height={500}
        min={type === "cm" ? 155 : 48}
        max={type === "cm" ? 244 : 96}
        unit={type === "cm" ? "cm" : "ft"}
        step={
          type === "cm"
            ? 0.5
            : 0.1
        }
        onValueChangeEnd={handleHeightChange}
        indicatorHeight={100}
        shortStepHeight={50}
        longStepHeight={100}
        decelerationRate={"fast"}
        stepWidth={1}
        indicatorColor="#FFCC21"
        valueTextStyle={{ fontSize: 24, fontWeight: "800" }}
        unitTextStyle={{ fontSize: 24, fontWeight: "800" }}
        gapBetweenSteps={20}
      />
    </View>
  );
};

export default HeightInput;
