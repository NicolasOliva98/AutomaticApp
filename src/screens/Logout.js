import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'

export default ({ navigation }) => {
   return AsyncStorage.removeItem('token'),
   navigation.navigate('Welcome')
}

