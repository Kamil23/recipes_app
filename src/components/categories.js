import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CachedImage } from "../helpers/image";

export default function Categories({ activeCategory, handleCategoryChange, categories }) {
  const filteredCategories = categories.filter((cat) => cat.node.name !== "Bez kategorii");
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {filteredCategories.map((cat, index) => {
          const isActiveCategory = activeCategory === cat.node.name;
          const activeButtonStyle = isActiveCategory ? "bg-amber-400" : "bg-white";
          const imageSourceUrl = cat.node.posts.edges[0].node.featuredImage.node.sourceUrl;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategoryChange(cat.node.name)}
              className="flex items-center space-y-1 space-x-2"
            >
              <View className={`rounded-full p-[6px] ${activeButtonStyle}`}>
                <CachedImage
                  uri={imageSourceUrl}
                  style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                />
              </View>
              <Text className="text-neutral-600 w-16 text-center" style={{ fontSize: hp(1.6) }}>
                {cat.node.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
