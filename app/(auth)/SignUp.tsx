import { View, Text, Button } from 'react-native'
import { router } from 'expo-router'
import React from 'react'

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
       <Button title="Sign In" onPress={() => router.push("/SignIn")} />
      
    </View>
  )
}

export default SignUp