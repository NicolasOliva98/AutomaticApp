import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'

export default ({ navigation }) => {

   const CerrarSession = () => {
      AsyncStorage.removeItem('token'),
         navigation.navigate('Login')
   }
   return AsyncStorage.removeItem('token'),
   navigation.navigate('Welcome')
}

