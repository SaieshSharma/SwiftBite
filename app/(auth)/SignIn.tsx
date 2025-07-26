import { View, Text, Button } from 'react-native'
import { router } from 'expo-router'
import React from 'react'

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>   
      <Button title="Sign In" onPress={() => router.push("/SignUp")} />
    </View>
  )
}

export default SignIn