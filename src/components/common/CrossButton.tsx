import { TouchableOpacity } from "react-native";
import { AppColors } from "../../utility/AppColors";
import { Feather } from "@expo/vector-icons";
const CrossButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.buttonHandler}
      style={{
        backgroundColor: AppColors.appThemeColor,
        height: 30,
        width: 30,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather name="x" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default CrossButton;
