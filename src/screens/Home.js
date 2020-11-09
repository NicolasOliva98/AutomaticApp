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
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
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

                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                            <View>
                                <Image style={{ width: 190, height: 190 }} source={{ uri: img }} />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='location-sharp' size={25} color={colors.dark} />
                                    <Text style={{ fontSize: 18, color: 'black' }}>{info.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 85, fontWeight: 'bold', color: 'black' }}>{(info.temp).toFixed()}</Text>
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', position: 'absolute', top: 25, right: -22 }}>°C</Text>
                                </View>
                                <Text style={{ fontSize: 20, color:'gray', textTransform: 'capitalize',fontWeight: 'bold'}}>{info.desc}</Text>
                            </View>
                        </View>
                        <View style={styles.detailsweather}>
                            <Text>Minima: {(info.temp_min).toFixed()}°c</Text>
                            <Text>Maxima: {(info.temp_max).toFixed()}°c</Text>
                            <Text>Humedad: {info.humidity}%</Text>
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
    },
    detailsweather: {
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: 50, 
        backgroundColor: colors.primary
    }
})

export default Home
