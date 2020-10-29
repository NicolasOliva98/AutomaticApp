import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Switch,
    TouchableOpacity,
    ToastAndroid,
    StatusBar
} from 'react-native';
import _ from 'lodash'
import BluetoothSerial from 'react-native-bluetooth-serial-next'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default ({navigation}) => {

    const [lista, setLista] = useState([])
    const [bolEnable, setBolEnable] = useState(false)
    useEffect(() =>{
        async function init(){
            const enable = await BluetoothSerial.requestEnable()
            const lista = await BluetoothSerial.list()
            setLista(lista)
            setBolEnable(enable)
            enable ? navigation.navigate('Home') :navigation.navigate('Home')
        }

        init();
        return() => {
            async function remove(){
                await BluetoothSerial.stopScanning();
                console.log('terminó scaneo')
            }
            remove();
        }
    },[])
 const enableBluetooth = async () => {
    try {
        await BluetoothSerial.requestEnable()
        const lista = await BluetoothSerial.list()
        await BluetoothSerial.stopScanning();
        setBolEnable(true)
        setLista(lista)
        console.log(lista)
    } catch (e) {
        console.log('Error: ',e)
    } 
} 

const disableBluetooth = async () => {
    try {
        await BluetoothSerial.disable();
        await BluetoothSerial.stopScanning()
        setBolEnable(false)
        setLista([])
    }catch(e){
        console.log('Error: ', e)
    }

}

 togglebluetooth = value => value ? enableBluetooth() : disableBluetooth() 

/* 
    read = async () => {
        try {
            await BluetoothSerial.readEvery(
                (data, intervalId) => {
                    console.log(data);

                    if (this.imBoredNow && intervalId) {
                        clearInterval(intervalId);
                    }
                },
                1000,
                "\r\n"
            );
            ToastAndroid.show("Successfuly read from device", ToastAndroid.SHORT);
        } catch (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        }
    } */

 const renderItem = ({item}) => (
        <View style={styles.item}> 
            <TouchableOpacity>
          <Text style={{color:'black', fontSize:20}}>{item.name}</Text>
          <Text style={styles.title}>{item.address}</Text>
            </TouchableOpacity>
        </View>
      );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#fff' barStyle='dark-content' />
            <View style={styles.toolbar}>
                <Text style={styles.toolbarTitle}>Lista de dispositivos</Text>
                <View style={styles.toolbarButton}>
              <Switch
                        trackColor={{ false: "#767577", true: "#ccc" }}
                        thumbColor={bolEnable ? "#841584" : "#ccc"}
                        value={bolEnable}
                        onValueChange={togglebluetooth}
                    />
                </View>
            </View>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginHorizontal: 15 }}>{bolEnable ? 'ON' : "OFF"}</Text>
            <FlatList
                ListEmptyComponent={<Text>No hay dispositivos</Text>}
                data={lista}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    toolbar: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    toolbarButton: {
        marginTop: 8,
    },
    toolbarTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        marginTop: 6
    },
    deviceName: {
        fontSize: 17,
        color: "#222",
        fontWeight: '600'

    },
    deviceNameWrap: {
        marginHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.8,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    }
});