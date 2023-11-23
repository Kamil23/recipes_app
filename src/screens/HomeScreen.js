import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import { getAllCategories, getRecipesByCategoryName, getRecipesByQuery } from "../api/graphql";
import Recipes from "../components/recipes";

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState("Fit ciasta");
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  const [showMasonryList, setShowMasonryList] = useState(false);

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [activeCategory]);

  const fetchCategories = async () => {
    const categories = await getAllCategories();
    setCategories(categories);
    setIsCategoriesLoaded(true);
  };

  const fetchRecipes = async () => {
    const recipes = await getRecipesByCategoryName(activeCategory);
    setRecipes(recipes);
  };

  const fetchRecipesWithQuery = async (query) => {
    const recipes = await getRecipesByQuery(query);
    console.log(recipes);
    setRecipes(recipes);
  };

  const handleCategoryChange = async (categoryName) => {
    setActiveCategory(categoryName);
    setShowMasonryList(false);
    setRecipes([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6"
        horizontal={false}
      >
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../../assets/avatar.png")}
            style={{ height: hp(5), width: hp(5) }}
          />
          <BellIcon size={hp(4)} color="gray" />
        </View>
        <View className="mx-4 space-y-2 mb-2">
          <Text className="font-bold" style={{ fontSize: hp(3) }}>
            {/* Cześć <Text className="text-amber-400">Kamil</Text> */}
            Cześć!
          </Text>
          <Text className="text-neutral-600">Na co masz dziś ochotę?</Text>
        </View>

        {/* search bar */}
        {/* <View className="mx-4 flex-row rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="Wyszukaj przepis"
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} color="gray" strokeWidth={3} />
          </View>
        </View> */}

        {/* categories */}
        <View>
          {categories.edges && categories.edges.length > 0 ? (
            <Categories
              activeCategory={activeCategory}
              handleCategoryChange={handleCategoryChange}
              categories={categories.edges}
            />
          ) : null}
        </View>

        {/* recipes */}
        <View>
          <Recipes
            isCategoriesLoaded={isCategoriesLoaded}
            recipes={recipes?.posts?.edges}
            showMasonryList={showMasonryList}
            setShowMasonryList={setShowMasonryList}
            activeCategory={activeCategory}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
