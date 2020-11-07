import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, ActivityIndicator, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/Ionicons'

const colors = {
    primary: '#f5f5f5',
    secondary: '#d7fbe8',
    info: '#409b74',
    dark: '#40514e'
}

const Home = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState({
        name: "Cargando...",
        temp: "Cargando..",
        humidity: "Cargando...",
        desc: "Cargando...",
        icon: "Cargando.."
    })

    const fetchWater = async () => {
        const res = await fetch('http://api.openweathermap.org/data/2.5/weather?q=Santiago&lang=sp&appid=f6757f01d6a1bacc578d10c3308676b8&units=metric', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        setInfo({
            name: data.name,
            temp: data.main.temp,
            humidity: data.main.humidity,
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
        })
        setLoading(false)
    }
    useEffect(() => {
        fetchWater()
    }, [])

    const img = `http://openweathermap.org/img/wn/${info.icon}@4x.png`
    return (
        <SafeAreaView>
            <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            {loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator color="#000" size="large" />
                    <Text style={{ color: '#fff' }}>Cargando...</Text>
                </View> :
                <>
                    <Header title='Mi registro' iconName={'ios-menu'} onPress={() => navigation.openDrawer()} />
                    <ScrollView style={{ backgroundColor: '#fff' }}>
                        <View style={styles.container}>
                            <Text>{info.name}</Text>
                            <Image style={{ width: 170, height: 170 }} source={{ uri: img }} />
                            <Text>{info.temp} C°</Text>
                            <Text>{info.desc} </Text>
                            <Text>{info.humidity} %</Text>
                        </View>
                    </ScrollView>
                </>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
