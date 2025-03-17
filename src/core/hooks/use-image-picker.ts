import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { usePersonalInfoStore } from '@/features/auth/store/use-personal-info-store';

export const useImagePicker = () => {
  const setImage = usePersonalInfoStore((state) => state.setImage);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const img = result.assets[0];
        setImage(img.uri, ''); // Update with the correct parameters
        console.log('Image URI:', img.uri);
      }
    } catch (error) {
      console.error(error);
    }
  }, [setImage]);

  return { pickImage };
};
