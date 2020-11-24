import React,{useEffect} from 'react'
import {ActivityIndicator, View, Text} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
export default ({navigation}) => {
    useEffect(() => {
        AsyncStorage.getItem('token')
        .then(x => {
           navigation.navigate(x ? 'Root' : 'Onboarding')
           console.log('token:', x)
        })
    },[])
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator 
             size='large'
             color='#000'/>
            <Text style={{color:'#000'}}>Cargando...</Text>
        </View>
    )
}