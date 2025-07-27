import CustomButton from "@/components/CustomButton"
import CustomInput from "@/components/CustomInput"
import { images } from "@/constants"
import { Slot, Redirect } from 'expo-router'
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, View, Image, ImageBackground } from 'react-native'

export default function _layout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}>
      <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
        <View className='w-full relative'  style={{height: Dimensions.get('screen').height/ 2.25}}>
            <ImageBackground  source={images.loginGraphic} className='size-full rounded-b-lg'/>
            <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10"/>

        </View>
      
       <Slot />
      </ScrollView>
    </KeyboardAvoidingView>


  )
}