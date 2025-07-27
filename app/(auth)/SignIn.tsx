import { View, Text, Button } from 'react-native'
import { router, Link } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import * as Sentry from "@sentry/react-native"

const SignIn = () => {


  const [isSubmitting, setIsSubmitting ] = useState(false);
  const [form, SetForm] = useState({email : '', password : ''});

  const submit = async () => {
    const {email, password} = form;
    if(!email || !password)  return Alert.alert('Error', 'Please Enter Valid Credentials');

    setIsSubmitting(true);

    try{
      //Calling Appwrite Sign In Function

      await signIn({
        email, password
      })
      router.replace('/')
    }
    catch(error: any){
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    }
    finally{
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
        <CustomInput
        placeholder="Email"
        value={form.email}
        onChangeText ={(text) => SetForm((prev)=> ({...prev, email: text}))}
        label="Email"
        keyboardType="email-address"
        />
        <CustomInput
        placeholder="Password"
        value={form.password}
        onChangeText ={(text) => SetForm((prev) => ({...prev, password : text}))}
        label="Password"
        secureTextEntry={true}
        />
        <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
        />

      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='text-gray-black base-regular'>Don't have an account ?</Text>
        <Link href='/SignUp' className='base-bold text-primary'>
        Sign Up
        </Link>
      </View>
    </View>
  )
}

export default SignIn