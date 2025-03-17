import { StyleSheet, Platform, StatusBar } from "react-native";
import { horizontalScale, scaleFontSize, verticalScale } from "./scaling";
import { AppColors } from "@/utility/AppColors";
import { s } from "react-native-size-matters";
export default StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  viewLogo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: { 
    marginTop: verticalScale(15),
    width: horizontalScale(90),
    height: horizontalScale(90),
  },
  inputContainer: {
    color: AppColors.primaryText,
    borderRadius: 10,
    marginVertical: verticalScale(15),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.listGray,
    padding: 20,
    paddingTop: verticalScale(20),
  },
  input: {
    width: "30%",
  },
  checkbox: {
    borderRadius: 500,
    marginLeft: 94,
  },
  selectedOption: {
    backgroundColor: AppColors.lightYellow,
    
  },
});