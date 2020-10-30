import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import useForm from '../hooks/useForm'

const colors = {
    primary:'#f5f5f5',
    secondary: '#d7fbe8',
    info:'#409b74',
    dark:'#40514e'
}

export default ({ navigation }) => {

    const initialState = {
        email: '',
        password: ''
    }
    const onSubmit = (values) => {
        if (inputs.email === '' || inputs.password === '') {
            return Alert.alert('Error', 'Debe llenar los campos correspondientes')
        } else {
            fetch('https://servelessautomatic.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then(x => x.text())
                .then(x => {
                    try {
                        return JSON.parse(x)
                    } catch {
                        throw x
                    }
                })
                .then(async (x) => {
                    try {
                        
                        await AsyncStorage.setItem('token', x.token)
                        navigation.navigate('Home')
                    } catch (e) {
                         Alert.alert('Error', e)
                    }
                })
                .catch(e => Alert.alert('Error', e))
        }

    }
    const { subscribe, inputs, handleSubmit } = useForm(initialState, onSubmit)

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            <View style={styles.header}>
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                <Image source={{ uri: 'https://automatic-us-east-1.s3.amazonaws.com/Logoautomatic.png' }} style={{height: 70, width:200 }} />
                <Text style={styles.text_header}>Inicio de Sesión</Text>
                </View>
                
            </View>
            <Animatable.View style={styles.footer}
                animation='fadeIn'
            >
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <Icon
                        name='user'
                        color='#222'
                        size={25}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder='example@gmail.com'
                        style={styles.TextInput}
                        keyboardType='email-address'
                        value={inputs.email}
                        onChangeText={subscribe('email')}
                    />
                </View>
                <Text style={[styles.text_footer, { marginTop: 15 }]}>Contraseña</Text>
                <View style={styles.action}>
                    <Icon
                        name='lock'
                        color='#222'
                        size={25}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder='Tu contresaña...'
                        style={styles.TextInput}
                        value={inputs.password}
                        onChangeText={subscribe('password')}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={[styles.signIn, {
                        backgroundColor: colors.info,
                        marginTop: 15
                    }]} onPress={handleSubmit}>
                        <Text style={[styles.textSign, { color: 'white' }]}>Ingresar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}
                        style={[styles.signIn, {
                            borderColor: colors.info,
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: colors.dark
                        }]}>
                            Registrarse
                    </Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#409b74'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35
    },
    text_footer: {
        color: '#222',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        alignItems: 'center'
    },
    TextInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#000'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});