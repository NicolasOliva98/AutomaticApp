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
  ScrollView
} from 'react-native';
import BluetoothSerial, { withSubscription } from 'react-native-bluetooth-serial-next';
import { Buffer } from 'buffer';
import Button from '../components/Button';
import DeviceList from '../components/DeviceList';
import Header from '../components/Header';
import styles from '../styles';
import { and } from 'react-native-reanimated';

global.Buffer = Buffer;
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}
today = dd + '/' + mm + '/' + yyyy;
const iconv = require('iconv-lite');

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
      newdata: {},
      regando: false,
    };
  }

  async componentDidMount() {
    const isEnabled = await BluetoothSerial.requestEnable();
    const devices = await BluetoothSerial.list();
    this.setState({
      isEnabled,
      devices: devices.map(device => ({
        ...device,
        paired: true,
        connected: false
      }))
    });
    console.log(devices)
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


  renderModal = (device, processing) => {
    if (!device) return null;
    const { id, name, connected } = device;
    const { suelo, humedad, temperatura } = this.state.newdata;
    return (
      <Modal
        animationType='fade'
        transparent={false}
        visible={true}
        onRequestClose={() => { }}>
        {device ? (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text> 
            {processing && (
              <ActivityIndicator
                style={{ marginTop: 15 }}
                size={Platform.OS === "ios" ? 1 : 60}
              />
            )}

            {!processing &&  ( 
              <View style={{ flex: 1 }}>
              <Button
                title={connected ? "Desconectar" : "Conectar"}
                style={{ backgroundColor: "#22509d" }}
                textStyle={{ color: "#fff" }}
                onPress={() => this.toggleDeviceConnection(device)}
              />           
                {connected && (
                  <>
                    {/*  <Button
                      title='Iniciar Riego'
                      style={{
                        backgroundColor: 'green'
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.write(id, "T")}
                    />
                    <Button 
                      title='Detener Riego'
                      style={{
                        backgroundColor: "red"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.write(id, "T")}
                    />
                    <Button
                      title="leer datos"
                      style={{
                        backgroundColor: "#22509d"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.readOne(id)}
                    /> */}

                    <View style={{ marginVertical: 30, justifyContent: 'center', alignItems: 'center' }} >
                      <Text style={{ fontSize: 45, fontWeight: 'bold' }}>00:00:00</Text>
                      <Text style={{ fontSize: 18 }}>{today}</Text>
                      {
                        !this.state.regando ?
                          <TouchableOpacity onPress={() => this.write(id, "T") && this.setState({ regando: true })} style={{ paddingVertical: 15, backgroundColor: "#fff", borderColor: "#2eb66c", borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 50, marginVertical: 10, marginTop: 20 }}>
                            <Text style={{ color: "#2eb66c" }}>Iniciar Riego</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => this.write(id, "F") && this.setState({ regando: false })} style={{ paddingVertical: 15, backgroundColor: "#fff", borderColor: "#2eb66c", borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 50, marginVertical: 10, marginTop: 20 }}>
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
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Agradable</Text>
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
                            <Text style={{ color: '#2eb66c', fontSize: 20, fontWeight: 'bold' }}>Agradable</Text>
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
          </View>

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
