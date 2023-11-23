import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import MasonryList from "@react-native-seoul/masonry-list";
import Loading from "./loading";
import { CachedImage } from "../helpers/image";
import { useNavigation } from "@react-navigation/core";

export default function Recipes({
  isCategoriesLoaded,
  recipes,
  showMasonryList,
  setShowMasonryList,
  activeCategory,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      isCategoriesLoaded && recipes && setShowMasonryList(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [isCategoriesLoaded, recipes]);

  useEffect(() => {
    setShowMasonryList(false);
  }, [recipes]);

  return (
    <View className="mx-4 space-y-3">
      <Text
        style={{ fontSize: hp(3) }}
        className="font-semibold text-neutral-600"
      >
        {activeCategory}
      </Text>
      <View>
        {showMasonryList ? (
          <MasonryList
            data={recipes}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item, i }) => <RecipeCard item={item} index={i} />}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
          />
        ) : (
          <Loading size="large" className="mt-32" />
        )}
      </View>
    </View>
  );
}

const RecipeCard = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const { title, featuredImage } = item.node || {};
  const navigation = useNavigation();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()
        .damping(12)}
    >
      <Pressable
        style={{ width: "100%" }}
        className={`flex justify-center mb-4 space-y-1 ${
          isEven ? "pr-2" : "pl-2"
        }`}
        onPress={() => navigation.navigate("RecipeDetails", { ...item })}
      >
        <CachedImage
          uri={featuredImage.node.sourceUrl}
          style={{
            width: "100%",
            height: index % 3 === 0 ? hp(25) : hp(35),
            borderRadius: 35,
          }}
          className="bg-black/5"
          sharedTransitionTag="tag"
        />
        <Text
          style={{ fontSize: hp(1.5) }}
          className="font-semibold ml-2 text-neutral-600"
        >
          {title.length > 20 ? title.slice(0, 20) + "..." : title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
