import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,Image,StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Micon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Animatable from 'react-native-animatable'
import useForm from '../hooks/useForm'
import { validate, clean, format } from '../components/rut'

const colors = {
    primary:'#f5f5f5',
    secondary: '#d7fbe8',
    info:'#409b74',
    dark:'#40514e'
}

export default ({ navigation }) => {
    const initialState = {
        nombre:'',
        telefono:'',
        rut: '',
        domicilio:'',
        email: '',
        password: '',
    }
    const onSubmit = (values) => { 
        if(inputs.nombre === '' || inputs.email === '' || inputs.password === '' || inputs.telefono === '' || inputs.domicilio === ''|| inputs.rut === ''){
            return Alert.alert('Error!','Debe llenar los campos correspondientes')
        }else if(validate(inputs.rut) === false  ){
            return Alert.alert('Error!', 'Rut no valido, porfavor ingrese el rut correcto. Ejemplo: 11111111-1')
        }else if(inputs.password.length < 8  ){
            return Alert.alert('Error!', 'La contraseña debe contener al menos 8 caracteres.')   
        }else{
        fetch('https://servelessautomatic.vercel.app/api/auth/register',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body:JSON.stringify(values),
        })
        .then(x => x.text())
        .then(x => {
            if(x === 'El usuario se creo con éxito'){
                return Alert.alert('Exito', x, [{ text: 'Ir al inicio', onPress:() => navigation.navigate('Login')}])   
            }else{
                Alert.alert('Error', x)
            }
        })
        }
    }
    const { subscribe, inputs, handleSubmit } = useForm(initialState, onSubmit)

    const sizeicon = 22;

    return (
        <View style={styles.container}>
               <StatusBar backgroundColor={colors.info} barStyle='light-content' />
            <View style={styles.header}>
            <View style={{justifyContent:'center', alignItems: 'center'}}>
                <Image source={{ uri: 'https://automatic-us-east-1.s3.amazonaws.com/Logoautomatic.png' }} style={{height: 70, width:200 }} />
                <Text style={styles.text_header}>Registro de usuario</Text>
                </View>
            </View>
            <Animatable.View style={styles.footer}animation='fadeIn'>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <Text style={styles.text_footer}>Nombre</Text>
            <Text style={styles.text_footer}>Rut</Text>
            <Text/>
            </View>
                <View style={[styles.action, { flexDirection:'row' }]}>
                    <Icon
                        name='ios-person'
                        color='#222'
                        size={sizeicon}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder='Ingrese su nombre'
                        style={styles.TextInput}
                        value={inputs.nombre}
                        onChangeText={subscribe('nombre')}
                    />
                   <Micon
                        name='card-account-details'                        
                        color='#222'
                        size={sizeicon}
                    />
                       <TextInput
                        autoCapitalize='none'
                        placeholder='11111111-1'
                        style={styles.TextInput}
                        value={inputs.rut}
                        onChangeText={subscribe('rut')} 
                    />
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <Text style={styles.text_footer}>Telefono</Text>
            <Text style={styles.text_footer}>Dirección</Text>
            <Text/>
            </View>
                <View style={[styles.action, { flexDirection:'row'}]}>
                <Icon
                        name='md-phone-portrait-sharp'
                        color='#222'
                        size={sizeicon}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder='+569 87654321'
                        style={styles.TextInput}
                        keyboardType='number-pad'
                        value={inputs.telefono}
                        onChangeText={subscribe('telefono')}
                    />
                      <Icon
                        name='map'
                        color='#222'
                        size={sizeicon}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder='Ingrese su dirección'
                        style={styles.TextInput}
                        value={inputs.domicilio}
                        onChangeText={subscribe('domicilio')}
                    />
                </View>
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <Icon
                        name='mail'
                        color='#222'
                        size={sizeicon}
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
                <Text style={styles.text_footer}>Contraseña</Text>
                <View style={styles.action}>
                    <Icon
                        name='lock-closed'
                        color='#222'
                        size={sizeicon}
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
                    <TouchableOpacity    style={[styles.signIn, {
                            backgroundColor: colors.info,
                            marginTop: 15
                        }]} onPress={handleSubmit}>
                            <Text style={[styles.textSign, { color: 'white' }]}>Registrarse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}
                        style={[styles.signIn, {
                            borderColor: colors.info,
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: colors.info
                        }]}>
                            Volver al inicio
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
        backgroundColor: colors.info
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35
    },
    text_footer: {
        color: '#222',
        fontSize: 15,
        marginTop:10
    },
    action: {
        flexDirection: 'row',
        marginTop: 2,
        borderBottomWidth: 1,
        borderBottomColor: colors.info,
        marginHorizontal:5,
        paddingBottom: 2,
        alignItems: 'center'
    },
    TextInput: {
        flex: 1,
        paddingLeft: 5,
        color: '#000',
    },
    button: {
        alignItems: 'center',
        marginTop: 20
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