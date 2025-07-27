import useAuthStore from "@/store/auth.store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e4b3a1bda201b8941d15c34af0b450bf@o4509740113133568.ingest.us.sentry.io/4509740127289344',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded,error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf')
  })

  useEffect(()=>{
    if (error) throw error
    if(fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded, error])

  useEffect(() => {
    fetchAuthenticatedUser()
  }, []);

  if(!fontsLoaded || isLoading) return null;

  return <Stack  screenOptions={{headerShown: false}}/>;
});