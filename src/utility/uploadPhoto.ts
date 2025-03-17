import * as ImagePicker from "expo-image-picker";

export const pickImage = async (props: any) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    // allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });


  if (!result.canceled) {
    return props.setImage.push(result.assets);
  }
};
