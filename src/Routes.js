import React from 'react'
import Text from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AuthLoading from './screens/AuthLoading'
import HomeScreen from './screens/Home'
import LoginScreen from './screens/Login'
import RegisterScreen from './screens/Register'
import PerfilScreen from './screens/Perfil'
import BluetoothScreen from './screens/Bluetooth'
import MainScreen from './screens/Main'
import FirtsScreen from './screens/firts'


if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;


const OnboardingNavigator = createStackNavigator({
  Firts:{
    screen: FirtsScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen, 
  },
}, {
  initialRouteName: 'Firts',
  headerMode: 'none'
})

const AppNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,

    },
    Perfil:{
      screen: PerfilScreen,
    },
    Bluetooth:{
      screen: BluetoothScreen,
    }
},{
    initialRouteName: 'Home',
    headerMode: 'none'
})

const BaseStack = createSwitchNavigator({
    AuthLoading,
    Onboarding: OnboardingNavigator,
    Root: AppNavigator
  },{
      initialRouteName: 'AuthLoading'
  })


export default createAppContainer(BaseStack)