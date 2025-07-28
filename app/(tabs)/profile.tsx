import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import useAuthStore from '@/store/auth.store';
import { images } from '@/constants';
import { signOut } from '@/lib/appwrite';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              setUser(null);
              setIsLoggedIn(false);
              router.replace('/SignIn');
            } catch (error) {
              Alert.alert("Error", "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  const profileOptions = [
    {
      title: "Edit Profile",
      icon: images.pencil,
      onPress: () => {
        Alert.alert("Coming Soon", "Edit profile feature will be available soon");
      }
    },
    {
      title: "Order History",
      icon: images.clock,
      onPress: () => {
        Alert.alert("Coming Soon", "Order history feature will be available soon");
      }
    },
    {
      title: "Delivery Address",
      icon: images.location,
      onPress: () => {
        Alert.alert("Coming Soon", "Address management feature will be available soon");
      }
    },
    {
      title: "Payment Methods",
      icon: images.dollar,
      onPress: () => {
        Alert.alert("Coming Soon", "Payment methods feature will be available soon");
      }
    },
    {
      title: "Contact Info",
      icon: images.phone,
      onPress: () => {
        Alert.alert("Coming Soon", "Contact info management will be available soon");
      }
    },
    {
      title: "Help & Support",
      icon: images.envelope,
      onPress: () => {
        Alert.alert("Coming Soon", "Help & support feature will be available soon");
      }
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 py-6 bg-primary">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-bold">Profile</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View className="px-5 py-6 border-b border-gray-100">
          <View className="flex-row items-center">
            {/* Profile Picture */}
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mr-4">
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }} 
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={images.user}
                  className="w-12 h-12"
                  resizeMode="contain"
                  tintColor="#666"
                />
              )}
            </View>

            {/* User Details */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-dark-100 mb-1">
                {user?.username || 'User'}
              </Text>
              <Text className="text-gray-500 mb-2">
                {user?.email || 'user@example.com'}
              </Text>
              <TouchableOpacity className="bg-primary/10 px-3 py-1 rounded-full self-start">
                <Text className="text-primary text-sm font-medium">Premium Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-5 py-4 flex-row justify-around border-b border-gray-100">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary">12</Text>
            <Text className="text-gray-500 text-sm">Orders</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary">4.8</Text>
            <Text className="text-gray-500 text-sm">Rating</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary">$245</Text>
            <Text className="text-gray-500 text-sm">Spent</Text>
          </View>
        </View>

        {/* Profile Options */}
        <View className="px-5 py-4">
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-gray-50"
              onPress={option.onPress}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                <Image 
                  source={option.icon} 
                  className="w-5 h-5"
                  resizeMode="contain"
                  tintColor="#666"
                />
              </View>
              <Text className="flex-1 text-dark-100 text-base font-medium">
                {option.title}
              </Text>
              <Image
                source={images.arrowRight}
                className="w-4 h-4"
                resizeMode="contain"
                tintColor="#ccc"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="px-5 py-4 border-t border-gray-100">
          <Text className="text-gray-400 text-sm text-center mb-2">
            Fast Food Delivery v1.0.0
          </Text>
          <Text className="text-gray-400 text-xs text-center">
            Made with ❤️ for food lovers
          </Text>
        </View>

        {/* Sign Out Button */}
        <View className="px-5 py-6">
          <TouchableOpacity
            className="bg-red-500 py-4 rounded-lg items-center flex-row justify-center"
            onPress={handleSignOut}
          >
            <Image
              source={images.logout}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
              tintColor="white"
            />
            <Text className="text-white text-base font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;