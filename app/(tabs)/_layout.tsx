import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Image } from "react-native";
import useAuthStore from "@/store/auth.store";
import { account } from "@/lib/appwrite";
import { images } from "@/constants";

export default function TabsLayout() {
  const { fetchAuthenticatedUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only check session if not already authenticated
    if (!isAuthenticated) {
      const checkSessionAndFetch = async () => {
        try {
          const session = await account.getSession('current');
          console.log('Existing session found:', session);
          await fetchAuthenticatedUser();
        } catch (e) {
          console.log('No existing session or session invalid');
          try {
            await account.deleteSessions();
          } catch (clearError) {
            console.log('Error clearing sessions:', clearError);
          }
        }
      };
      
      checkSessionAndFetch();
    }
  }, [isAuthenticated]);

  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#FFA500",
      tabBarInactiveTintColor: "#CDCDE0",
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        height: 84,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.home}
              resizeMode="contain"
              tintColor={color}
              className="w-6 h-6"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.search}
              resizeMode="contain"
              tintColor={color}
              className="w-6 h-6"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.bag}
              resizeMode="contain"
              tintColor={color}
              className="w-6 h-6"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.person}
              resizeMode="contain"
              tintColor={color}
              className="w-6 h-6"
            />
          ),
        }}
      />
    </Tabs>
  );
}