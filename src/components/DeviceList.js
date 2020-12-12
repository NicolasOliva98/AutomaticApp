import React from "react";
import {
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import styles from "../styles";
import Icon from 'react-native-vector-icons/Ionicons'
class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  onDevicePressed = device => () => {
    if (typeof this.props.onDevicePressed === "function") {
      this.props.onDevicePressed(device);
    }
  };


  render() {
    const { devices = [], children } = this.props;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.listContainer}>
          {devices.map(device => (
            <TouchableHighlight
              underlayColor="#eee"
              key={device.id}
              style={styles.listItem}
              onPress={this.onDevicePressed(device)}>
              <View style={{ flexDirection: "column" }}>
      {/*           <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.listItemStatus,{backgroundColor: device.connected ? "green" : "gray",}]}>
                    {device.connected ? "Conectado" : "Desconectado"}
                  </Text>
                </View> */}
                <View style={{flexDirection: 'row'}}>
                  <Icon name='md-bluetooth'size={25} color='#0278ae'/>
                  <Text style={{ fontWeight: "bold", fontSize: 18, marginHorizontal:10 }}>
                    {device.name}
                  </Text>
                  <View>
                  </View>
                </View> 
                {children}
         
              </View>

            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    );
  }
}

export default DeviceList;
