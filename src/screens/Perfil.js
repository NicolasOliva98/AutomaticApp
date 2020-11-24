import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, StatusBar, TextInput, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../components/Header'
import useForm from '../hooks/useForm'
import { validate, clean, format } from '../components/rut'


const colors = {
    primary: '#f5f5f5',
    secondary: '#d7fbe8',
    info: '#409b74',
    dark: '#40514e'
}

const Perfil = ({ navigation }) => {
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

    const initialState = {
        nombre: user.nombre,
        telefono: user.telefono,
        rut: user.rut,
        domicilio: user.domicilio,
        email: user.email,
        password: user.password,
    }
    const onSubmit = (values) => {
        if (inputs.nombre === '' || inputs.email === '' || inputs.password === '' || inputs.telefono === '' || inputs.domicilio === '' || inputs.rut === '') {
            return Alert.alert('Error!', 'Debe llenar los campos correspondientes')
            /* }else if(validate(inputs.rut) === false  ){
                return Alert.alert('Error!', 'Rut no valido, porfavor ingrese el rut correcto. Ejemplo: 11111111-1') */
        } else {
            fetch(`https://servelessautomatic.vercel.app/api/auth/modify/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
                .then(x => x.text())
                .then(x => {
                    Alert.alert(
                        'Exito',
                        x,
                        [
                            { text: 'Aceptar', onPress: () => navigation.navigate('Home') }
                        ]
                    )
                })
        }//finn else
    }
    const { subscribe, inputs, handleSubmit } = useForm(initialState, onSubmit)
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            {loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator color="#000" size="large" />
                    <Text style={{ color: '#fff' }}>Cargando...</Text>
                </View> :
                <View style={styles.container}>
                    <Header title='Mi Perfil' iconName={'arrow-back'} onPress={() => navigation.goBack()} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 15, backgroundColor: colors.info }}>
                        {/*  <Text style={{ fontSize: 25, color: colors.dark, marginVertical:10,fontWeight: 'bold'}}>Editar Perfil</Text> */}
                        <Image style={{ width: 100, height: 100, borderRadius: 50, borderColor: colors.dark, borderWidth: 2 }} source={{ uri: user.foto }} />
                        <Text style={{ fontSize: 20, color: colors.secondary, fontWeight: 'bold', marginTop: 5 }}>{user.nombre}</Text>
                    </View>
                    
                    <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Text style={styles.text_footer}>Email</Text>
                        <View style={styles.action}>
                            <Icon
                                name='mail'
                                color='#222'
                                size={22}
                            />
                            <TextInput
                                autoCapitalize='none'
                                placeholder={'ingrese su correo'}
                                style={styles.TextInput}
                                defaultValue={user.email}
                                keyboardType='email-address'
                                editable={false}
                                value={inputs.email}
                                onChangeText={subscribe('email')}
                            />
                        </View>
                        <Text style={styles.text_footer}>Rut</Text>
                        <View style={styles.action}>
                            <Icon
                                name='mail'
                                color='#222'
                                size={22}
                            />
                            <TextInput
                                autoCapitalize='none'
                                placeholder='example@gmail.com'
                                style={styles.TextInput}
                                editable={false}
                                keyboardType='email-address'
                                defaultValue={user.rut}
                                value={inputs.rut}
                                onChangeText={subscribe('rut')}
                            />
                        </View>
                        <Text style={styles.text_footer}>Nombre</Text>
                        <View style={styles.action}>
                            <Icon
                                name='mail'
                                color='#222'
                                size={22}
                            />
                            <TextInput
                                autoCapitalize='none'
                                placeholder='ingrese su telefono'
                                style={styles.TextInput}
                                defaultValue={user.nombre}
                                value={inputs.nombre}
                                onChangeText={subscribe('nombre')}
                            />
                        </View>
                        <Text style={styles.text_footer}>Telefono</Text>
                        <View style={styles.action}>
                            <Icon
                                name='mail'
                                color='#222'
                                size={22}
                            />
                            <TextInput
                                autoCapitalize='none'
                                placeholder='ingrese su telefono'
                                style={styles.TextInput}
                                keyboardType='number-pad'
                                defaultValue={user.telefono}
                                value={inputs.telefono}
                                onChangeText={subscribe('telefono')}
                            />
                        </View>
                        <Text style={styles.text_footer}>Dirección</Text>
                        <View style={styles.action}>
                            <Icon
                                name='map'
                                color='#222'
                                size={22}
                            />
                            <TextInput
                                autoCapitalize='none'
                                placeholder='Ingrese se dirección nueva'
                                style={styles.TextInput}
                                keyboardType='default'
                                defaultValue={user.domicilio}
                                value={inputs.domicilio}
                                onChangeText={subscribe('domicilio')}
                            />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={handleSubmit} style={{ paddingVertical: 15, backgroundColor: "#fff", borderColor: "#2eb66c", borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 50, marginVertical: 10, marginTop: 20 }}>
                                <Text style={{ color: "#2eb66c" }}>Guardar datos</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                 {/*    <View style={styles.buttonsave}>
                        <Icon
                            name='ios-checkmark'
                            size={23}
                            color={colors.primary}
                        />
                    </View> */}
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary
    },
    text_footer: {
        color: colors.dark,
        fontSize: 15
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
    action: {
        flexDirection: 'row',
        marginTop: 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.info,
        paddingBottom: 2,
        alignItems: 'center'
    },
})

export default Perfil
