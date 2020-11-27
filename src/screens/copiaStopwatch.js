import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';

class TestApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerStart: false,
            stopwatchStart: false,
            totalDuration: 90000,
            timerReset: false,
            stopwatchReset: false,
            currentTime: '',
        };
        this.iniciarRiego = this.iniciarRiego.bind(this);
        this.detenerRiego = this.detenerRiego.bind(this);
        this.toggleStopwatch = this.toggleStopwatch.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
      
    }

    
    iniciarRiego(){
        this.setState({stopwatchStart: true , stopwatchReset: false})
     
    }

    detenerRiego(){
        this.setState({stopwatchStart: false})
       console.log('TIEMPO DE RIEGO: ',this.state.currentTime);
        this.setState({stopwatchReset: true });
    }



    toggleStopwatch() {
        this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
    }

    resetStopwatch() {
        this.setState({ stopwatchStart: false, stopwatchReset: true });
    }
   

  /*   getFormattedTime(time){
        let _this = this;
        this.currentTime = time;
        _this.setState({currentTime: this.currentTime})
        console.log(this.currentTime)
    } */

    render() {
        return (
            <View>
                <Stopwatch laps start={this.state.stopwatchStart}
                    reset={this.state.stopwatchReset}
                    options={options}
                    startTime={1}
                    />            
                 
                 <TouchableHighlight onPress={this.iniciarRiego}>
                 <Text style={{fontSize: 30}}>iniciar riego</Text>
             </TouchableHighlight>
             <TouchableHighlight onPress={this.detenerRiego}>
                 <Text style={{fontSize: 30}}>Detener riego</Text>
             </TouchableHighlight>

          {/*    <TouchableHighlight onPress={this.resetStopwatch}>
             <Text style={{ fontSize: 30 }}>Detener riego</Text>
         </TouchableHighlight> */}
            </View>
        );
    }
}

const options = {
    container: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
        width: 220,
    },
    text: {
        fontSize: 30,
        color: '#000',
        marginLeft: 7,
    }
};

export default TestApp;