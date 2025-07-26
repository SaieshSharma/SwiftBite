import { View, Text } from 'react-native'
import { Redirect, Slot } from 'expo-router'
import React from 'react'

const _layout = () => {
    const isAuthenticated = false;
    if(!isAuthenticated) return <Redirect href="/SignIn"/>
  return <Slot />
  
}

export default _layout