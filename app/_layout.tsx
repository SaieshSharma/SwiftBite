import useAuthStore from "@/store/auth.store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e4b3a1bda201b8941d15c34af0b450bf@o4509740113133568.ingest.us.sentry.io/4509740127289344',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { isLoading } = useAuthStore();

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

  // Removed duplicate fetchAuthenticatedUser - tabs layout handles it
  
  if(!fontsLoaded || isLoading) return null;

  return <Stack screenOptions={{headerShown: false}}/>;
});