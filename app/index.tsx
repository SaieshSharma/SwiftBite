import { Redirect } from 'expo-router';
import useAuthStore from '@/store/auth.store';

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/SignIn" />;
}