import React from 'react';
import {
  Platform,
  Switch,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import BluetoothSerial, { withSubscription } from 'react-native-bluetooth-serial-next';
import AsyncStorage from '@react-native-community/async-storage'
import { Picker } from '@react-native-picker/picker';
import DeviceList from '../components/DeviceList';
import Header from '../components/Header';
import jwt_decode from "jwt-decode"
import { Buffer } from 'buffer';
import styles from '../styles';
import moment from 'moment'
global.Buffer = Buffer;

function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:{pad(duration.seconds())},{pad(centiseconds)}</Text>
    </View>
  )
}

const iconv = require('iconv-lite');
const today = moment().format("DD/MM/YYYY")
const cultivos = [
  {
    nombre: 'Arveja',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 1
  },
  {
    nombre: 'Berenjena',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Cebolla',
    inicial: 0.45,
    desarrollo: 0.70,
    media: 1.05,
    maduracion: 0.75
  },
  {
    nombre: 'Lechuga',
    inicial: 0.45,
    desarrollo: 0.60,
    media: 1,
    maduracion: 0.90
  },
  {
    nombre: 'Maíz',
    inicial: 0.40,
    desarrollo: 0.80,
    media: 1.15,
    maduracion: 0.70
  },
  {
    nombre: 'Melón',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1,
    maduracion: 0.75
  },
  {
    nombre: 'Papa',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.85
  },
  {
    nombre: 'Pimentón',
    inicial: 0.35,
    desarrollo: 0.70,
    media: 1.05,
    maduracion: 0.90
  },
  {
    nombre: 'Poroto verde',
    inicial: 0.35,
    desarrollo: 0.70,
    media: 1.10,
    maduracion: 0.90
  },
  {
    nombre: 'Sandía',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1,
    maduracion: 0.70
  },
  {
    nombre: 'Tomate',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Zanahoria',
    inicial: 0.45,
    desarrollo: 0.75,
    media: 1.05,
    maduracion: 0.90
  },
  {
    nombre: 'Zapallo',
    inicial: 0.45,
    desarrollo: 0.70,
    media: 1,
    maduracion: 0.70
  },
  {
    nombre: 'Maravilla',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.55
  },
  {
    nombre: 'Betarraga',
    inicial: 0.40,
    desarrollo: 0.80,
    media: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Soja',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.10,
    maduracion: 0.60
  },
  {
    nombre: 'Tabaco',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.10,
    maduracion: 0.90
  },
  {
    nombre: 'Avena',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.10,
    maduracion: 0.40
  },
  {
    nombre: 'Cebada',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.45
  },
  {
    nombre: 'Garbanzo',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.10,
    maduracion: 0.65
  },
  {
    nombre: 'Trigo',
    inicial: 0.35,
    desarrollo: 0.75,
    media: 1.15,
    maduracion: 0.45
  },
  {
    nombre: 'Berries',
    inicial: 0.3,
    desarrollo: 1.05,
    media: 0.5,
    maduracion: 1.5
  },
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.events = null;
    this.state = {
      isEnabled: false,
      device: null,
      devices: [],
      scanning: false,
      processing: false,
      datos: '',
      newdata: {
        humedad: 0,
        suelo: 0,
        temperatura: 0
      },
      regando: false,
      inicio: false,
      detener: false,
      start: 0,
      now: 0,
      laps: [],
      user_id: '',
      nombre: 'Arveja',
      tmin: 0,
      tmax: 0
    };
  }

  async componentDidMount() {
    const isEnabled = await BluetoothSerial.requestEnable();
    const devices = await BluetoothSerial.list();
    const x = await AsyncStorage.getItem('token');
    let temp_minima = await AsyncStorage.getItem('temp_min')
    let temp_maxima = await AsyncStorage.getItem('temp_max')
    this.setState({ tmin: temp_minima, tmax: temp_maxima })
    const decoded = jwt_decode(x);
    this.setState({ user_id: decoded._id })

    this.setState({
      isEnabled,
      devices: devices.map(device => ({
        ...device,
        paired: true,
        connected: false
      }))
    });
    this.events = this.props.events;

    this.events.on("bluetoothEnabled", () => {
      ToastAndroid.show("Bluetooth activado", ToastAndroid.SHORT);
      this.setState({ isEnabled: true });
    });

    this.events.on("bluetoothDisabled", () => {
      ToastAndroid.show("Bluetooth desactivado", ToastAndroid.SHORT);
      this.setState({ isEnabled: false });
    });

    this.events.on("connectionSuccess", ({ device }) => {
      if (device) {
        ToastAndroid.show(
          `Dispositivo ${device.name} conectado`, ToastAndroid.SHORT
        );
      }
    });

    this.events.on("connectionFailed", ({ device }) => {
      if (device) {
        ToastAndroid.show(
          `Conexión fallida con ${device.name}`, ToastAndroid.SHORT
        );
      }
    });

    this.events.on("connectionLost", ({ device }) => {
      if (device) {
        ToastAndroid.show(
          `Se ha perdido la conexión con ${device.name}`, ToastAndroid.SHORT
        );
      }
    });

    this.events.on("data", result => {
      if (result) {
        const { id, data } = result;
        console.log(`Data recivida ${id} : ${data}`);
      }
    });

    this.events.on("error", e => {
      if (e) {
        console.log(`Error: ${e.message}`);
        //ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    });
  }

  requestEnable = () => async () => {
    try {
      await BluetoothSerial.requestEnable();
      this.setState({ isEnabled });
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  toggleBluetooth = async value => {
    try {
      if (value) {
        await BluetoothSerial.enable();
      } else {
        await BluetoothSerial.disable();
      }
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  listDevices = async () => {
    try {
      const list = await BluetoothSerial.list();
      this.setState(({ devices }) => ({
        devices: devices.map(device => {
          const found = list.find(v => v.id === device.id);
          if (found) {
            return {
              ...found,
              paired: true,
              connected: false,
            };
          }
          return device;
        })

      }));
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  discoverUnpairedDevices = async () => {
    this.setState({ scanning: true });

    try {
      const unpairedDevices = await BluetoothSerial.listUnpaired();

      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices
          .map(device => {
            const found = unpairedDevices.find(d => d.id === device.id);

            if (found) {
              return {
                ...device,
                ...found,
                connected: false,
                paired: false
              };
            }

            return device.paired || device.connected ? device : null;
          })
          .map(v => v)
      }));
    } catch (e) {
      ToastAndroid.show(e.message);

      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices.filter(device => device.paired || device.connected)
      }));
    }
  };
  cancelDiscovery = () => async () => {
    try {
      await BluetoothSerial.cancelDiscovery();
      this.setState({ scanning: false });
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  toggleDevicePairing = async ({ id, paired }) => {
    if (paired) {
      await this.unpairDevice(id);
    } else {
      await this.pairDevice(id);
    }
  };
  pairDevice = async id => {
    this.setState({ processing: true });

    try {
      const paired = await BluetoothSerial.pairDevice(id);

      if (paired) {
        ToastAndroid.show(
          `Device ${paired.name}<${paired.id}> paired successfully`, ToastAndroid.SHORT
        );

        this.setState(({ devices, device }) => ({
          processing: false,
          device: {
            ...device,
            ...paired,
            paired: true
          },
          devices: devices.map(v => {
            if (v.id === paired.id) {
              return {
                ...v,
                ...paired,
                paired: true
              };
            }

            return v;
          })
        }));
      } else {
        ToastAndroid.show(`Device <${id}> pairing failed`, ToastAndroid.SHORT);
        this.setState({ processing: false });
      }
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
      this.setState({ processing: false });
    }
  };
  unpairDevice = async id => {
    this.setState({ processing: true });

    try {
      const unpaired = await BluetoothSerial.unpairDevice(id);

      if (unpaired) {
        ToastAndroid.show(
          `Device ${unpaired.name}<${unpaired.id}> unpaired successfully`, ToastAndroid.SHORT
        );

        this.setState(({ devices, device }) => ({
          processing: false,
          device: {
            ...device,
            ...unpaired,
            connected: false,
            paired: false
          },
          devices: devices.map(v => {
            if (v.id === unpaired.id) {
              return {
                ...v,
                ...unpaired,
                connected: false,
                paired: false
              };
            }

            return v;
          })
        }));
      } else {
        ToastAndroid.show(`Device <${id}> unpairing failed`, ToastAndroid.SHORT);
        this.setState({ processing: false });
      }
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
      this.setState({ processing: false });
    }
  };
  toggleDeviceConnection = async ({ id, connected }) => {
    if (connected) {
      await this.disconnect(id);
    } else {
      await this.connect(id);
      await this.readOne(id)

    }
  };
  connect = async id => {
    this.setState({ processing: true });
    try {
      const connected = await BluetoothSerial.device(id).connect();

      if (connected) {
        ToastAndroid.show(
          `Conectado al dispositivo ${connected.name}`, ToastAndroid.SHORT);

        this.setState(({ devices, device }) => ({
          processing: false,
          device: {
            ...device,
            ...connected,
            connected: true
          },
          devices: devices.map(v => {
            if (v.id === connected.id) {
              return {
                ...v,
                ...connected,
                connected: true
              };
            }

            return v;
          })
        }));
      } else {
        ToastAndroid.show(`Failed to connect to device <${id}>`, ToastAndroid.SHORT);
        this.setState({ processing: false });
      }
    } catch (e) {
      ToastAndroid.show(e.message);
      this.setState({ processing: false });
    }
  };
  disconnect = async id => {
    this.setState({ processing: true });

    try {
      await BluetoothSerial.device(id).disconnect();

      this.setState(({ devices, device }) => ({
        processing: false,
        device: {
          ...device,
          connected: false
        },
        devices: devices.map(v => {
          if (v.id === id) {
            return {
              ...v,
              connected: false
            };
          }

          return v;
        })
      }));
    } catch (e) {
      ToastAndroid.show(e.message);
      this.setState({ processing: false });
    }
  };
  write = async (id, message) => {
    try {
      await BluetoothSerial.device(id).write(message);
      //ToastAndroid.show("Successfuly wrote to device", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  writePackets = async (id, message, packetSize = 64) => {
    try {
      const device = BluetoothSerial.device(id);
      const toWrite = iconv.encode(message, "cp852");
      const writePromises = [];
      const packetCount = Math.ceil(toWrite.length / packetSize);

      for (var i = 0; i < packetCount; i++) {
        const packet = new Buffer(packetSize);
        packet.fill(" ");
        toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
        writePromises.push(device.write(packet));
      }

      await Promise.all(writePromises).then(() =>
        ToastAndroid.show("Writed packets", ToastAndroid.SHORT)
      );
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  read = async () => {
    try {
      await BluetoothSerial.readEvery(
        (data, intervalId) => {
          this.setState({ datos: data });
          this.setState({ newdata: data != '' ? JSON.parse(this.state.datos) : null });
          if (this.imBoredNow && intervalId) {
            clearInterval(intervalId);
          }
        },
        10000,
        "\r\n"
      );
      ToastAndroid.show("Leyendo datos", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }
  readOne = async () => {

    try {
      await BluetoothSerial.read((data, subscription) => {


        this.setState({ datos: data })

        this.setState({ newdata: JSON.parse(this.state.datos) });
        if (this.imBoredNow && subscription) {
          BluetoothSerial.removeSubscription(subscription);
        }
      }, "\r\n");
      //ToastAndroid.show("Datos leídos", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  DetenerRiego = () => {
    this.setState({ inicio: false, detener: true })
    const { suelo, humedad, temperatura } = this.state.newdata;
    const duracionriego = moment(this.state.now - this.state.start).format("mm:ss")
    const horariegos = moment().format("HH:mm");
    fetch('https://servelessautomatic.vercel.app/api/riego', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.user_id,
        fecha: today,
        hora: horariegos,
        duracion: duracionriego,
        temperature: temperatura,
        humidity: humedad,
        hsuelo: suelo
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('Crashed:', data);
    });
    Alert.alert('Fin del riego', `Ha finzalizado su riego con una duración de: ${duracionriego}`)
    //console.log(`id_user : ${this.state.user_id} -  Tiempo de riego: ${duracionriego} - temp: ${temperatura} - Humedad R: ${humedad} - Humedad S: ${suelo} - Dia: ${today} - hora: ${horariegos}`);
    clearInterval(this.timer)
    this.setState({
      laps: [0],
      start: 0,
      now: 0,
    })
  }
  IniciarRiego = () => {
    this.setState({ inicio: true })
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() })
    }, 100)
  }

  renderModal = (device, processing) => {
    if (!device) return null;
    const { id, name, connected } = device;
    const { suelo, humedad, temperatura } = this.state.newdata;
    const { now, start, laps } = this.state
    const timer = now - start
    const one = 0.0023
    const two = 17.78
    const ro = 18.2
    const tmed = (parseInt(this.state.tmin) + parseInt(this.state.tmax)) / 2
    const parteuno = one * (tmed + two)
    const partedos = Math.pow((parseInt(this.state.tmax) - parseInt(this.state.tmin)), 0.5)
    const evp = parteuno * ro * partedos
    const datosdelcultivos = cultivos.filter(x => x.nombre === this.state.nombre)
    const { inicial, media, desarrollo, maduracion } = datosdelcultivos[0]
    return (
      <Modal
        animationType='fade'
        transparent={false}
        visible={true}
        onRequestClose={() => { }}>
        {device ? (
          <ScrollView style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{connected ? `Conectado a ${name}` : name}</Text>
            </View>
            {processing && (
              <ActivityIndicator
                color='#000'
                style={{ marginTop: 15 }}
                size={Platform.OS === "ios" ? 1 : 60}
              />
            )}
            {!processing && (
              <View style={{ flex: 1 }}>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.toggleDeviceConnection(device)} style={[styles.butonwg, { paddingVertical: 5, width:'50%' }]}>
                    <Text style={{ color: "#2eb66c" }}>{connected ? "Desconectar" : "Conectar"}</Text>
                  </TouchableOpacity>
                </View>

                {connected && (
                  <>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>¿Que deseas regar?</Text>
                        <Picker
                          selectedValue={this.state.nombre}
                          mode='dialog'
                          dropdownIconColor='#2eb66c'
                          style={{ height: 50, width: 200, borderColor: '#000', borderWidth: 2 }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ nombre: itemValue })
                          }>
                          {cultivos.map(x => <Picker.Item key={x.nombre} label={x.nombre} value={x.nombre} />)}
                        </Picker>
                      </View>
                      <View>
                        <Text>Pequeña: {((evp * inicial) * 10).toFixed(2)} litros =  {((((evp * inicial) * 10) * 60) / 120).toFixed(2)} minutos </Text>
                        <Text>Mediana: {((evp * media) * 10).toFixed(2)} litros =  {((((evp * media) * 10) * 60) / 120).toFixed(2)} minutos</Text>
                        <Text>Desarrollo: {((evp * desarrollo) * 10).toFixed(2)} litros =  {((((evp * desarrollo) * 10) * 60) / 120).toFixed(2)} minutos</Text>
                        <Text>Cosechable:  {((evp * maduracion) * 10).toFixed(2)} litros =  {((((evp * maduracion) * 10) * 60) / 120).toFixed(2)} minutos</Text>
                      </View>
                    </View>
                    <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }} >
                      <Timer interval={laps.reduce((total, curr) => total + curr, 0) + timer} style={styles.timer} />
                      <Text style={{ fontSize: 18 }}>{today}</Text>
                      {
                        !this.state.regando ?
                          <TouchableOpacity onPress={() => this.IniciarRiego(this.write(id, "T") && this.setState({ regando: true }))} style={styles.butonwg}>
                            <Text style={{ color: "#2eb66c" }}>Iniciar Riego</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => this.DetenerRiego(this.write(id, "F") && this.setState({ regando: false }))} style={styles.butonwg}>
                            <Text style={{ color: "#2eb66c" }}>Detener Riego</Text>
                          </TouchableOpacity>
                      }
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: 15 }}>
                      <Text style={{ color: '#000', fontSize: 30, fontWeight: 'bold', paddingVertical: 10 }}>Estado de riego</Text>
                      <View style={{
                        marginVertical: 8,
                        backgroundColor: '#2eb66c', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65,
                        elevation: 6, width: '100%', borderRadius: 20, paddingVertical: 15
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25 }}>
                          <Text style={{ color: '#fff', fontSize: 80, fontWeight: 'bold' }}>{temperatura}</Text>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '300' }}>Temperatura actual</Text>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>   {
                              temperatura >= 0 && temperatura < 10 ? 'Baja' :
                                temperatura >= 11 && temperatura < 18 ? 'Medio' :
                                  temperatura >= 19 && temperatura < 25 ? 'Agradable' :
                                    temperatura >= 26 && temperatura < 35 ? 'Caluroso' :
                                      temperatura >= 36 && temperatura < 45 ? 'Extremo calor' : ' '
                            } </Text>
                          </View>
                          <View style={{ position: 'absolute', top: 15, left: 120 }}>
                            <Text style={{ color: '#fff', fontSize: 35, fontWeight: 'bold' }}>°c</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{
                        marginVertical: 8,
                        backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65,
                        elevation: 6, width: '100%', borderRadius: 20, paddingVertical: 15
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25 }}>
                          <Text style={{ color: '#2eb66c', fontSize: 80, fontWeight: 'bold' }}>{humedad}</Text>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2eb66c', fontSize: 20, fontWeight: '300' }}>Humedad actual</Text>
                            <Text style={{ color: '#2eb66c', fontSize: 20, fontWeight: 'bold' }}>
                              {
                                humedad >= 0 && humedad < 10 ? 'Muy baja' :
                                  humedad >= 11 && humedad < 20 ? 'Baja' :
                                    humedad >= 21 && humedad < 40 ? 'Media' :
                                      humedad >= 41 && humedad < 80 ? 'Alta' :
                                        humedad >= 81 && humedad < 100 ? 'Muy Alta' :
                                          ' '
                              }
                            </Text>
                          </View>
                          <View style={{ position: 'absolute', top: 15, left: 120 }}>
                            <Text style={{ color: '#2eb66c', fontSize: 35, fontWeight: 'bold' }}>%</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{
                        marginVertical: 8,
                        backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65,
                        elevation: 6, width: '100%', borderRadius: 20, paddingVertical: 15
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25 }}>
                          <Text style={{ color: '#2eb66c', fontSize: 80, fontWeight: 'bold' }}>{suelo}</Text>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2eb66c', fontSize: 20, fontWeight: '300' }}>Humedad Suelo</Text>
                            <Text style={{ color: '#2eb66c', fontSize: 20, fontWeight: 'bold' }}>{
                              suelo >= 0 && suelo < 10 ? 'Muy baja' :
                                suelo >= 11 && suelo < 20 ? 'Baja' :
                                  suelo >= 21 && suelo < 40 ? 'Media' :
                                    suelo >= 41 && suelo < 80 ? 'Alta' :
                                      suelo >= 81 && suelo < 100 ? 'Muy Alta' :
                                        ' '
                            }
                            </Text>
                          </View>
                          <View style={{ position: 'absolute', top: 15, left: 120 }}>
                            <Text style={{ color: '#2eb66c', fontSize: 35, fontWeight: 'bold' }}>%</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                  </>
                )}
              </View>
            )}
            <TouchableOpacity onPress={() => this.setState({ device: null })} style={{ position: 'absolute', top: 10, right: 10, width: 40, height: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}   >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 15 }}>X</Text>
            </TouchableOpacity>
          </ScrollView>

        ) : null}
      </Modal>
    );
  };

  render() {
    const { isEnabled, device, devices, processing } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor='#409b74' />
        <Header title='Bluetooth' iconName={'arrow-back'} onPress={() => this.props.navigation.goBack()}>
          <View style={styles.enableInfoWrapper}>
            <Text style={{ fontSize: 15, color: "#fff", fontWeight: 'bold' }}>
              {isEnabled ? "ON" : "OFF"}
            </Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#ffa62b" }}
              thumbColor={isEnabled ? '#fff' : "#fff"}
              value={isEnabled}
              onValueChange={this.toggleBluetooth}
            />
          </View>
        </Header>
        {!isEnabled ?
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#ccc' }} />
          :
          <>
            {this.renderModal(device, processing)}
            <DeviceList
              devices={devices}
              onDevicePressed={device => this.setState({ device })}
              onRefresh={this.listDevices}
            />

          </>

        }
      </SafeAreaView>
    );
  }
}
export default withSubscription({ subscriptionName: "events" })(App);
