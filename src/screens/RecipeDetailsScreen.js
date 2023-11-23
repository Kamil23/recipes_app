import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { CachedImage } from "../helpers/image";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon, ClockIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useEffect, useState, memo } from "react";
import { useNavigation } from "@react-navigation/core";
import { getSingleRecipeBySlug } from "../api/graphql";
import Loading from "../components/loading";
import RenderHtml from "react-native-render-html";
import { extractNumericPart } from "../helpers/helpers";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function RecipeDetailsScreen(props) {
  const item = props.route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [singleRecipe, setSingleRecipe] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSingleRecipe(item.node.slug);
  }, []);

  const fetchSingleRecipe = async (recipeSlug) => {
    const recipe = await getSingleRecipeBySlug(recipeSlug);
    const totalTime =
      JSON.parse(`${recipe?.post?.saswpSchema?.json_ld}`)?.find(
        (item) => item["@type"] === "HowTo"
      )?.totalTime || null;
    setSingleRecipe(recipe);
    if (totalTime) {
      setTotalTime(extractNumericPart(totalTime));
    }
    setLoading(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style="light" />

      {/** recipe image */}
      <View className="flex-row justify-center">
        <CachedImage
          uri={item.node.featuredImage.node.sourceUrl}
          sharedTransitionTag="tag"
          style={{
            height: hp(50),
            width: wp(98),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>

      {/* back button */}
      <Animated.View
        entering={FadeIn.delay(200).duration(1000)}
        className="w-full absolute flex-row justify-between items-center pt-14"
      >
        <TouchableOpacity
          className="p-2 rounded-full ml-5 bg-white"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="p-2 rounded-full mr-5 bg-white"
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={`${isFavorite ? "red" : "gray"}`}
          />
        </TouchableOpacity> */}
      </Animated.View>

      {/* meal description */}
      {loading ? (
        <Loading size="large" className="mt-32" />
      ) : (
        <Animated.View
          entering={FadeInDown.duration(700).springify().damping(12)}
          className="px-4 flex justify-between space-y-4 pt-8"
        >
          {/* title */}
          <Text
            style={{ fontSize: hp(3) }}
            className="font-bold flex-1 text-neutral-700"
          >
            {singleRecipe.post.title}
          </Text>

          {/* categories */}
          <Animated.ScrollView
            entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-1 mb-6"
          >
            {singleRecipe.post.categories.edges.map((cat, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center rounded-full bg-amber-300 px-3 py-2"
                onPress={() => console.log("TODO")}
              >
                <Text
                  className="text-neutral-700 font-medium"
                  style={{ fontSize: hp(1.6) }}
                >
                  {cat.node.name}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>

          {/* misc
          {totalTime && (
            <View className="flex-row justify-around">
              <View className="flex rounded-full bg-amber-300 p-2">
                <View
                  style={{ height: hp(6.5), width: hp(6.5) }}
                  className="bg-white rounded-full flex items-center justify-center"
                >
                  <ClockIcon size={hp(4)} color="#525252" strokeWidth={2.5} />
                </View>
                <View className="flex items-center py-2 space-y-1">
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="font-bold text-neutral-700"
                  >
                    {totalTime}
                  </Text>
                  <Text
                    style={{ fontSize: hp(1.3) }}
                    className="font-bold text-neutral-700"
                  >
                    minut
                  </Text>
                </View>
              </View>
            </View>
          )} */}

          {/* content html */}
          <RecipeHTMLContent html={singleRecipe.post.content} />
        </Animated.View>
      )}
    </ScrollView>
  );
}

const RecipeHTMLContent = memo(function WebDisplay({ html }) {
  const { width: contentWidth } = useWindowDimensions();
  const tagsStyles = {
    a: {
      textDecorationLine: "none",
      color: "#fbbf24",
    },
    p: { fontSize: hp(2), lineHeight: hp(3.5), color: "#4b5563" },
    h1: { fontSize: hp(3), lineHeight: hp(4), color: "#4b5563" },
    h2: { fontSize: hp(2.5), lineHeight: hp(3.5), color: "#4b5563" },
    h3: { fontSize: hp(2), lineHeight: hp(3), color: "#4b5563" },
    ol: { fontSize: hp(2), lineHeight: hp(3), color: "#4b5563" },
    ul: { fontSize: hp(2), lineHeight: hp(3), color: "#4b5563" },
    li: { fontSize: hp(2), lineHeight: hp(3), color: "#4b5563" },
  };
  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html }}
      tagsStyles={tagsStyles}
    />
  );
});
