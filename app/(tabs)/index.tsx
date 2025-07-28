//Internal
import useAuthStore from "@/store/auth.store";
import cn from "clsx";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from '@sentry/react-native'
import { router } from "expo-router";

//External
import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";

// Define mapping for offers to categories
const offerToCategoryMap: { [key: string]: string } = {
  "SUMMER COMBO": "all", // or whatever category ID you want
  "BURGER BASH": "Burgers",
  "PIZZA PARTY": "Pizzas", 
  "BURRITO DELIGHT": "Burritos"
};

export default function Index() {
  const { user } = useAuthStore();

  const handleOfferPress = (offerTitle: string) => {
    const categoryFilter = offerToCategoryMap[offerTitle];
    
    if (categoryFilter) {
      // Navigate to search with category filter
      router.push({
        pathname: "/search",
        params: { category: categoryFilter }
      });
    } else {
      // Navigate to search without filter
      router.push("/search");
    }
  };

  console.log("USER:", JSON.stringify(user, null, 2))

  return (
<SafeAreaView className="flex-1 bg-white">
    <FlatList data={offers}  renderItem={({item, index}) => {

      const isEven  = index%2 == 0;

      return(
        <View>
          <Pressable 
            className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")} 
            style={{backgroundColor: item.color}}
            android_ripple={{color: "#ffffff2"}}
            onPress={() => handleOfferPress(item.title)}
          >
            {({pressed}) => (
              <Fragment>
                <View className={"h-full w-1/2"}>
                  <Image source={item.image} className={"size-full"} resizeMode={"contain"}/>
                </View>
                <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
                  <Text className="h1-bold text-white leading-tight">
                    {item.title}
                  </Text>
                  <Image
                    source={images.arrowRight}
                    className="size-10"
                    resizeMode="contain"
                    tintColor="#ffffff"
                  />
                </View>
              </Fragment>
            )}
          </Pressable>
        </View>
      )
    }} 
    contentContainerClassName="pb-28 px-5"
    ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5">
      <View className="flex-start">
        <Text className="small-bold text-primary">DELIVER TO</Text>
        <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
        <Text className="paragraph-bold text-dark-100">India</Text>
        <Image source={images.arrowDown} className="size-3" resizeMode="contain"/>
        </TouchableOpacity>
      </View>

      <CartButton/>
  </View>
    )}
    />

</SafeAreaView>
  );
}