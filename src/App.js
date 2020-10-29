import React from "react";
import {
  Platform,
  Switch,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  StatusBar
} from "react-native";

import BluetoothSerial, {
  withSubscription
} from "react-native-bluetooth-serial-next";
import { Buffer } from "buffer";
import AsyncStorage from '@react-native-community/async-storage'
import Button from "./components/Button";
import DeviceList from "./components/DeviceList";
import styles from "./styles";

global.Buffer = Buffer;

const iconv = require("iconv-lite");

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
      datos:'dato'
    };
  }



  async componentDidMount() {
    const isEnabled= await BluetoothSerial.requestEnable();
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
        console.log(`Data from device ${id} : ${data}`);
      }
    });

    this.events.on("error", e => {
      if (e) {
        console.log(`Error: ${e.message}`);
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    });
  }

  requestEnable = () => async () => {
    try {
      await BluetoothSerial.requestEnable();
      this.setState({isEnabled});
      
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
      ToastAndroid.show("Successfuly wrote to device", ToastAndroid.SHORT);
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
          console.log(data);
          this.setState({datos: data})
          if (this.imBoredNow && intervalId) {
            clearInterval(intervalId);
          }
        },
        1000,
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
        console.log(data);
      this.setState({datos: data})
        if (this.imBoredNow && subscription) {
          BluetoothSerial.removeSubscription(subscription);
        }
      }, "\r\n");
      ToastAndroid.show("Datos leídos", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }


  renderModal = (device, processing) => {
    if (!device) return null;

    const { id, name, paired, connected } = device;

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={true}
        onRequestClose={() => { }}
      >
        {device ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
            <Text style={{ fontSize: 14 }}>{id}</Text>

            {processing && (
              <ActivityIndicator
                style={{ marginTop: 15 }}
                size={Platform.OS === "ios" ? 1 : 60}
              />
            )}

            {!processing && (
              <View style={{ marginTop: 20, width: "50%" }}>
                <Button
                  title={connected ? "Desconectar" : "Conectar"}
                  style={{
                    backgroundColor: "#22509d"
                  }}
                  textStyle={{ color: "#fff" }}
                  onPress={() => this.toggleDeviceConnection(device)}
                />
                {connected && (
                  <>
                    <Button
                      title="RED"
                      style={{
                        backgroundColor: "#red"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.write(id, "R") && this.readOne(id)}
                    />
                       <Button
                      title="GREEN"
                      style={{
                        backgroundColor: "green"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.write(id, "G") && this.readOne(id)}
                    />
                       <Button
                      title="BLUE"
                      style={{
                        backgroundColor: "blue"   
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() => this.write(id, "B") && this.readOne(id)}
                    />
                    <Button
                      title="Escribir por paquetes"
                      style={{
                        backgroundColor: "#22509d"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() =>
                        this.writePackets(
                          id,
                          "hOLA AMIKOSSS"
                        )
                      }
                    />
                    <Button
                      title="leer datos"
                      style={{
                        backgroundColor: "#22509d"
                      }}
                      textStyle={{ color: "#fff" }}
                      onPress={() =>
                        this.readOne(id)
                      }
                    />
                  </>
                )}
                <Button
                  title="Cerrar"
                  onPress={() => this.setState({ device: null })}
                />

              <Text>
              {this.state.datos}
              </Text>
                 
              </View>
            )}
          </View>
        ) : null}
      </Modal>
    );
  };

  render() {
    const { isEnabled, device, devices, processing } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>  
        <StatusBar backgroundColor='#22509d' />
        <View style={styles.topBar}>
          <Text style={styles.heading}>Listado de bluetooth</Text>
          <View style={styles.enableInfoWrapper}>
            <Text style={{ fontSize: 15, color: "#fff", fontWeight: 'bold', paddingRight: 10 }}>
              {isEnabled ? "ON" : "OFF"}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#ccc" }}
              thumbColor={isEnabled ? "#17b978" : "#ccc"}
              value={isEnabled}
              onValueChange={this.toggleBluetooth}
            />
          </View>
        </View>

        {!isEnabled ?
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center",backgroundColor:'#ccc' }} />
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





        {/*    {scanning ? (isEnabled && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActivityIndicator
                style={{ marginBottom: 15 }}
                size={Platform.OS === "ios" ? 1 : 60}
              />
            </View>)) : (
            <>
              {this.renderModal(device, processing)}
              <DeviceList
                devices={devices}
                onDevicePressed={device => this.setState({ device })}
                onRefresh={this.listDevices}
              />
            </>
          )} */}
      </SafeAreaView>
    );
  }
}

export default withSubscription({ subscriptionName: "events" })(App);
