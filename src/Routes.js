import React from 'react'
import {Text, Dimensions } from 'react-native'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'

import AuthLoading from './screens/AuthLoading'
import HomeScreen from './screens/Home'
import LoginScreen from './screens/Login'
import RegisterScreen from './screens/Register'
import PerfilScreen from './screens/Perfil'
import BluetoothScreen from './screens/Bluetooth'
import WelcomeScreen from './screens/Welcome'
import LogOutScreen from './screens/Logout'

import Icon from 'react-native-vector-icons/Ionicons'
import Micon from 'react-native-vector-icons/MaterialCommunityIcons'
import SideBar from './components/SideBar'

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

const sizeIcon = 25;

const OnboardingNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
}, {
  initialRouteName: 'Welcome',
  headerMode: 'none'
})


const AppNavigator = createDrawerNavigator({
   Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Inicio',
      drawerIcon: ({ tintColor }) => <Icon name='home' color={tintColor} size={sizeIcon} />
    }

  },
  Bluetooth: {
    screen: BluetoothScreen,
    navigationOptions: {
      title: 'Riego',
      drawerIcon: ({ tintColor }) => <Micon name='watering-can' color={tintColor} size={sizeIcon} />
    }
  },
  Perfil: {
    screen: PerfilScreen,
    navigationOptions: {
      title: 'Mi Perfil',
      drawerIcon: ({ tintColor }) => <Icon name='person' color={tintColor} size={sizeIcon} />
    }
  },
  LogOut: {
    screen: LogOutScreen,
    navigationOptions:{
      title:'Cerrar Sesión',
      drawerIcon:({tintColor}) => <Icon name='md-log-in' color={tintColor} size={sizeIcon} />
    }
  }
}, {
  contentComponent: props => <SideBar {...props}/>,
  drawerWidth: Dimensions.get('window').width * 0.70,
  overlayColor:'rgba(0,0,0,0.6)',
  contentOptions: {
    activeBackgroundColor: 'rgba(113,222,215,0.15)',
    activeTintColor: '#0f4c75',
    inactiveTintColor: '#4b5d67',
    itemsContainerStyle: {
      marginTop: 16,
      marginHorizontal: 8
    },
    itemStyle: {
      borderRadius: 10
    }
  },
 
})

const BaseStack = createSwitchNavigator({
  AuthLoading,
  Onboarding: OnboardingNavigator,
  Root: AppNavigator
}, {
  initialRouteName: 'AuthLoading'
})


export default createAppContainer(BaseStack)