import { Image, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const scaleLogo = useSharedValue(0);
  const navigation = useNavigation();
  useEffect(() => {
    scaleLogo.value = withSpring(1, { damping: 20, mass: 0.5 });
    setTimeout(() => {
      scaleLogo.value = withSpring(0, { damping: 20, mass: 0.5 });
      setTimeout(() => {
        navigation.navigate("Home");
      }, 500);
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-white">
      <StatusBar style="light" />
      <Animated.View style={{ transform: [{ scale: scaleLogo }] }}>
        <Image
          source={require("../../assets/dieta-na-luzie-logo.png")}
          style={{ width: wp(70) }}
        />
      </Animated.View>
    </View>
  );
}
