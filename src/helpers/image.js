import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";

export const CachedImage = (props) => {
  const [cachedSource, setCachedSource] = useState(null);
  const { uri } = props;

  useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          const blob = await response.blob();
          const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64String = reader.result;
              resolve(base64String);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error('Failed to cache image: ', error);
      }
    };
    getCachedImage();
  }, []);

  return <Animated.Image {...props} source={cachedSource} />;
};
