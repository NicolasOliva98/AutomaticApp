import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/Ionicons'

const colors = {
    primary: '#f5f5f5',
    secondary: '#d7fbe8',
    info: '#409b74',
    dark: '#40514e'
}

const Home = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState([])
    const fetchUser = async () => {
        const x = await AsyncStorage.getItem('token')
        const res = await fetch('https://servelessautomatic.vercel.app/api/auth/me', { method: 'GET', headers: { 'Content-Type': 'application/json', authorization: x }, })
        const data = await res.json()
        setUser(data)
        setLoading(false)
    }
    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            {loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator color="#000" size="large" />
                    <Text style={{ color: '#fff' }}>Cargando...</Text>
                </View> :
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Perfil')
                    }}
                        style={[styles.signIn, {
                            backgroundColor: colors.dark,
                            borderColor: colors.dark,
                            borderWidth: 1,
                            marginTop: 15
                        }]}>
                        <Text style={[styles.textSign, { color: colors.primary }]}>Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Bluetooth')
                    }}
                        style={[styles.signIn, {
                            backgroundColor: colors.dark,
                            borderColor: colors.dark,
                            
                            borderWidth: 1,
                            marginTop: 15
                        }]}>
                        <Text style={[styles.textSign, { color: colors.secondary }]}>Perfil</Text>
                    </TouchableOpacity>
                </View>


            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 5
    },
    signIn: {
        width: '50%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonsave: {
        width: 40,
        height: 40,
        borderColor: colors.dark,
        borderWidth: 2,
        borderRadius: 50,
        justifyContent: 'center', alignItems: 'center',
        color: colors.primary,
        position: 'absolute',
        right: 10,
        top: 10
    }
})

export default Home
