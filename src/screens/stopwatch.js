import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { Timer } from 'react-native-stopwatch-timer';
import RadioForm from 'react-native-simple-radio-button';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage'
import OtherStop from './copiastopwatsh1'


const cultivos = [
  {
    nombre: 'Arveja',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 1
  },
  {
    nombre: 'Berenjena',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Cebolla',
    inicial: 0.45,
    media: 0.70,
    desarrollo: 1.05,
    maduracion: 0.75
  },
  {
    nombre: 'Lechuga',
    inicial: 0.45,
    media: 0.60,
    desarrollo: 1,
    maduracion: 0.90
  },
  {
    nombre: 'Maíz',
    inicial: 0.40,
    media: 0.80,
    desarrollo: 1.15,
    maduracion: 0.70
  },
  {
    nombre: 'Melón',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1,
    maduracion: 0.75
  },
  {
    nombre: 'Papa',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.85
  },
  {
    nombre: 'Pimentón',
    inicial: 0.35,
    media: 0.70,
    desarrollo: 1.05,
    maduracion: 0.90
  },
  {
    nombre: 'Poroto verde',
    inicial: 0.35,
    media: 0.70,
    desarrollo: 1.10,
    maduracion: 0.90
  },
  {
    nombre: 'Sandía',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1,
    maduracion: 0.70
  },
  {
    nombre: 'Tomate',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Zanahoria',
    inicial: 0.45,
    media: 0.75,
    desarrollo: 1.05,
    maduracion: 0.90
  },
  {
    nombre: 'Zapallo',
    inicial: 0.45,
    media: 0.70,
    desarrollo: 1,
    maduracion: 0.70
  },
  {
    nombre: 'Maravilla',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.55
  },
  {
    nombre: 'Betarraga',
    inicial: 0.40,
    media: 0.80,
    desarrollo: 1.15,
    maduracion: 0.80
  },
  {
    nombre: 'Soja',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.10,
    maduracion: 0.60
  },
  {
    nombre: 'Tabaco',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.10,
    maduracion: 0.90
  },
  {
    nombre: 'Avena',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.10,
    maduracion: 0.40
  },
  {
    nombre: 'Cebada',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.45
  },
  {
    nombre: 'Garbanzo',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.10,
    maduracion: 0.65
  },
  {
    nombre: 'Trigo',
    inicial: 0.35,
    media: 0.75,
    desarrollo: 1.15,
    maduracion: 0.45
  },
  {
    nombre: 'Berries',
    inicial: 0.3,
    media: 1.05,
    desarrollo: 0.5,
    maduracion: 1.5
  },
]


export default class TestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      totalDuration: 10000,
      initialRadioform: -1,
      timerReset: true,
      nombre: 'Arveja',
      tmin: 0,
      tmax: 0,
      selectedItems: [],
      currentTab: 1,
      fishing: false,
     };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }

  async componentDidMount() {
    let temp_minima = await AsyncStorage.getItem('temp_min')
    let temp_maxima = await AsyncStorage.getItem('temp_max')
    this.setState({ tmin: temp_minima, tmax: temp_maxima })
   
      if(this.state.fishing === true) {
        console.log('envio de datos!!!', this.state.totalDuration);

        this.setState({fishing:false})
      }else{
        null
      }
   
   
  }

  onTabClick = (currentTab) => {
    this.setState({
      currentTab: currentTab,
    });
  }

  toggleTimer() {
    this.setState({ timerStart: !this.state.timerStart, timerReset: false });
  }

  resetTimer() {
    console.log('duracion:',this.state.totalDuration / 60000)
    this.setState({ timerStart: false, timerReset: true, totalDuration: 0 })
    

  }

  toggleStopwatch() {
    this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
  }

  resetStopwatch() {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
  }

  getFormattedTime(time) {
    this.currentTime = time;
  };


  handleTimerComplete = () => (
    this.resetTimer()    
  )
  render() {


    const one = 0.0023
    const two = 17.78
    const ro = 18.2
    const tmed = (parseInt(this.state.tmin) + parseInt(this.state.tmax)) / 2
    const parteuno = one * (tmed + two)
    const partedos = Math.pow((parseInt(this.state.tmax) - parseInt(this.state.tmin)), 0.5)
    const evp = parteuno * ro * partedos
    const { now, start, laps } = this.state
    const timer = now - start
    const datosdelcultivos = cultivos.filter(x => x.nombre === this.state.nombre)
    const { inicial, media, desarrollo, maduracion } = datosdelcultivos[0]
    const data = [
      { label: 'Inicial', value: ((((((evp * inicial) * 10) * 60) / 120).toFixed(2)) * 60000) },
      { label: 'Media', value: ((((((evp * media) * 10) * 60) / 120).toFixed(2)) * 60000) },
      { label: 'Desarrollo', value: ((((((evp * desarrollo) * 10) * 60) / 120).toFixed(2)) * 60000) },
      { label: 'Madura', value: ((((((evp * maduracion) * 10) * 60) / 120).toFixed(2)) * 60000) },
    ]

    return (
      <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#fff' }}>
         <View style={styles.tabs}>
         <Text onPress={() => {this.onTabClick(1) }} style={[ styles.tabTextStyle, this.state.currentTab === 1 ? styles.tabUnderline : null, ]}>Riego común</Text>
        <Text onPress={() => {this.onTabClick(2) }} style={[ styles.tabTextStyle, this.state.currentTab === 2 ? styles.tabUnderline : null, ]}>Riego personalizado </Text>
         </View>
          {this.state.currentTab === 1 && (
          <View style={{backgroundColor:'#fff', height:'50%'}}>
            <OtherStop/>
          </View>
        )}

        {this.state.currentTab === 2 && (
          <View >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>¿Que deseas regar?</Text>
              <Picker
                selectedValue={this.state.nombre}
                mode='dialog'
                dropdownIconColor='#2eb66c'
                style={{ height: 50, width: 200, borderColor: '#000', borderWidth: 2 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ nombre: itemValue, initialRadioform: -1 })
                }>
                {cultivos.map(x => <Picker.Item key={x.nombre} label={x.nombre} value={x.nombre} />)
                }
              </Picker>
            </View>

            <View>
              <Text>Inicial: {((evp * inicial) * 10).toFixed(2)} litros =  {((((evp * inicial) * 10) * 60) / 120).toFixed(1)} minutos </Text>
              <Text>Media: {((evp * media) * 10).toFixed(2)} litros =  {((((evp * media) * 10) * 60) / 120).toFixed(1)} minutos</Text>
              <Text>Desarrollo: {((evp * desarrollo) * 10).toFixed(2)} litros =  {((((evp * desarrollo) * 10) * 60) / 120).toFixed(1)} minutos</Text>
              <Text>Madura:  {((evp * maduracion) * 10).toFixed(2)} litros =  {((((evp * maduracion) * 10) * 60) / 120).toFixed(1)} minutos</Text>
            </View>
            <RadioForm
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'green'}
              selectedButtonColor={'green'}
              radio_props={data}
              animation={true}
              initial={this.state.initialRadioform}
              onPress={(value) => { this.setState({ totalDuration: value }) }}
            />
            <Timer totalDuration={this.state.totalDuration} msecs start={this.state.timerStart}
              reset={this.state.timerReset}
              options={options}
              handleFinish={this.handleTimerComplete}
              getTime={null} />
            <TouchableHighlight onPress={this.toggleTimer}>
              <Text style={{ fontSize: 30 }}>{!this.state.timerStart ? "Start" : "Stop"}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.resetTimer}>
              <Text style={{ fontSize: 30 }}>Reset</Text>
            </TouchableHighlight>
          </View>
        )}

<TouchableHighlight onPress={this.resetTimer}>
              <Text style={{ fontSize: 30}}>Reset</Text>
            </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tabTextStyle: {
    color: '#ccc',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 20,
  },
  tabUnderline: {
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  buttonStyle: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
});
const options = {
  container: {
    width: '100%', justifyContent: 'center', alignItems: 'center'
  },
  text: {
    fontSize: 45,
    color: '#000',
  }
};

