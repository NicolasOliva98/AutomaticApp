import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, FlatList, Dimensions, RefreshControl } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import jwt_decode from 'jwt-decode'

const colors = {
    primary: '#f5f5f5',
    secondary: '#d7fbe8',
    info: '#409b74',
    dark: '#40514e'
}

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const Home = ({ navigation }) => {
    Geolocation.getCurrentPosition((data) => {
        setLatitude(data.coords.latitude)
        setLongitude(data.coords.longitude)
    })
    const [latitude, setLatitude] = useState(-33.4685982)
    const [longitude, setLongitude] = useState(-70.7566206)
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [datos, setRiegos] = useState([])
    const [datosreverse, setRiegosreverse] = useState([])
    const [info, setInfo] = useState({
        name: "Cargando...",
        temp: "Cargando..",
        humidity: "Cargando...",
        desc: "Cargando...",
        icon: "Cargando.."
    })

    const fetchgeneral = async () => {
        const x = await AsyncStorage.getItem('token')
        const decoded = jwt_decode(x)
        const res2 = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&appid=f6757f01d6a1bacc578d10c3308676b8&units=metric`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data2 = await res2.json()
        setInfo({
            name: data2.name,
            temp: data2.main.temp,
            temp_min: data2.main.temp_min,
            temp_max: data2.main.temp_max,
            humidity: data2.main.humidity,
            desc: data2.weather[0].description,
            icon: data2.weather[0].icon,
        })
        await AsyncStorage.setItem('temp_min', String(data2.main.temp_min))
        await AsyncStorage.setItem('temp_max', String(data2.main.temp_max))

        const res3 = await fetch(`https://servelessautomatic.vercel.app/api/riego/riegouser/${decoded._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const riegos = await res3.json()
        setRiegos(riegos)
        setRiegosreverse(riegos)
        setLoading(false)
    }
    useEffect(() => {
        fetchgeneral()
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);


        fetchgeneral()
        wait(1000).then(() => setRefreshing(false))
    }, []);
    const renderItem = ({ item }) => (
        <View style={styles.containerList}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.dark }}>{item.fecha} {item.hora}hrs</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                <Icon
                    name={parseInt(item.hora) >= 6 && parseInt(item.hora) < 20 ? 'md-sunny' : 'moon'}
                    size={50}
                    color='#f08a5d'
                />
                <Text style={{ fontSize: 35 }}> {item.temperature}°c</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#222' }}>Duración: {item.duracion} min</Text>
                <Text >Humedad suelo: {item.hsuelo}%</Text>
                <Text>Humedad relativa: {item.humidity}%</Text>

            </View>
        </View>
    )

    const img = `http://openweathermap.org/img/wn/${info.icon}@4x.png`
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            {loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator color="#000" size="large" />
                    <Text style={{ color: '#000' }}>Cargando...</Text>
                </View> :
                <>
                    <Header title='Mi registro' iconName={'ios-menu'} onPress={() => navigation.openDrawer()} />
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                        <View style={{
                            marginHorizontal: 12,
                            borderRadius: 20,
                            marginTop: 20,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0.1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 0.02,
                            elevation: 10,
                        }}>
                            <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: '#fff', borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                <View>
                                    <Image style={{ width: 190, height: 190 }} source={{ uri: img }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name='location-sharp' size={25} color={colors.dark} />
                                        <Text style={{ fontSize: 18, color: 'black' }}>{info.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 85, fontWeight: 'bold', color: colors.dark }}>{(info.temp).toFixed()}</Text>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.dark, position: 'absolute', top: 25, right: -24 }}>°C</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, color: 'gray', textTransform: 'capitalize', fontWeight: 'bold' }}>{info.desc}</Text>
                                </View>
                            </View>
                            <View style={styles.detailsweather}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Minima: {(info.temp_min).toFixed()}°c</Text>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Maxima: {(info.temp_max).toFixed()}°c</Text>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Humedad:{info.humidity}%</Text>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#000', fontSize: 30, fontWeight: 'bold', paddingVertical: 10 }}>Mis riegos</Text>
                            {datos.length <= 0 ? <Text>No tienes riegos realizados</Text> :
                                <FlatList
                                    data={datos}
                                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                                    horizontal={true}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item._id}
                                />}
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#000', fontSize: 30, fontWeight: 'bold', paddingVertical: 10 }}>Grafico de consumo</Text>
                            {datosreverse.length <= 0 ? <Text>No tienes riegos realizados</Text> :
                                <>
                                <Text>{`ha consumido ${ datosreverse.map(x => (120*parseInt(x.duracion.substring(0, 2)))/60 ).reverse().slice(-7).reduce((acc, curr) => acc + curr ) } Litros en los ultimos 7 riegos`} </Text>
                                <LineChart
                                    data={{
                                        labels: datosreverse.map(x => `${x.fecha.substring(0, 5)}`).reverse().slice(-7),
                                        datasets: [
                                            {
                                                data: datosreverse.map(x => (120*parseInt(x.duracion.substring(0, 2)))/60 ).reverse().slice(-7),
                                                strokeWidth: 4
                                            }
                                        ],
                                        legend: ['Litros']
                                    }}

                                    width={Dimensions.get("window").width - 20} // from react-native
                                    height={200}
                                    yAxisLabel=" "
                                    yAxisSuffix=" Litros"
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                        backgroundColor: "#fff",
                                        backgroundGradientFrom: "#83a4d4",
                                        backgroundGradientTo: "#b6fbff",
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(29, 45, 80, ${opacity})`,
                                        style: {
                                            borderRadius: 16,

                                        },
                                        propsForDots: {
                                            r: "7",
                                            strokeWidth: "2",
                                            stroke: "#fff"
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,

                                    }}
                                />
                                </>
                            }

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
        backgroundColor: '#2eb66c',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    containerList: {
        width: 200,
        height: 170,
        margin: 2,
        marginBottom: 10,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }
})

export default Home
