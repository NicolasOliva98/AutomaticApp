import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, ImageBackground, Image, StyleSheet,Button } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer';
import AsyncStorage from '@react-native-community/async-storage'

export default props => {
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
        <ScrollView>
            <ImageBackground
                blurRadius={10}
                source={{uri:'https://wallpapertag.com/wallpaper/full/e/a/1/135335-firewatch-background-1920x1080-windows-10.jpg'}} style={{ width: undefined, padding: 16, paddingTop: 48 }}>
                <Image
                    style={styles.image}
                    source={{uri: user.foto}}
                />
                <Text style={styles.Textname}>{user.nombre}</Text>
                <Text style={{ fontSize:12, color:'#eee'}}>{user.email}</Text>
            </ImageBackground>
            <View style={styles.container}>
                <DrawerItems {...props} />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: 88,
        height: 88,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff',
        marginBottom:10
    },
    Textname: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    }
})