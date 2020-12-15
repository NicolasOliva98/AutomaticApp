import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import moment from 'moment'

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
const items = [
    // this is the parent or 'item'
    {
        name: 'Fruits',
        id: 0,
        // these are the children or 'sub items'
        children: [
            {
                name: 'Apple',
                id: 10,
            },
            {
                name: 'Strawberry',
                id: 17,
            },
            {
                name: 'Pineapple',
                id: 13,
            },
            {
                name: 'Banana',
                id: 14,
            },
            {
                name: 'Watermelon',
                id: 15,
            },
            {
                name: 'Kiwi fruit',
                id: 16,
            },
        ],
    }
]

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            now: 0,
            laps: [],
            nombre: 'Arveja',
            tmin: 0,
            tmax: 0,
            selectedItems: [],
        }
    }
    async componentDidMount() {
        let temp_minima = await AsyncStorage.getItem('temp_min')
        let temp_maxima = await AsyncStorage.getItem('temp_max')
        this.setState({ tmin: temp_minima, tmax: temp_maxima })
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    start = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
        })
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() })
        }, 50)

    }

    stop = () => {
        const duracionriego = moment(this.state.now - this.state.start).format("mm:ss")
        console.log('duracion: ', duracionriego);
        clearInterval(this.timer)
        this.setState({
            laps: [0],
            start: 0,
            now: 0,
        })
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };
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
            { label: 'Inicial', value: ((((evp * inicial) * 10) * 60) / 120).toFixed(2) },
            { label: 'Media', value: ((((evp * media) * 10) * 60) / 120).toFixed(2) },
            { label: 'Desarrollo', value: ((((evp * desarrollo) * 10) * 60) / 120).toFixed(2) },
            { label: 'Madura', value: ((((evp * maduracion) * 10) * 60) / 120).toFixed(2) }
        ]
        return (
            <View style={styles.container}>
                <Timer
                    interval={laps.reduce((total, curr) => total + curr, 0) + timer}
                    style={styles.timer}
                />
                <TouchableOpacity onPress={() => this.start()} style={{ paddingVertical: 15, backgroundColor: "#fff", borderColor: "#2eb66c", borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 50, marginVertical: 10, marginTop: 20 }}>
                    <Text style={{ color: "#2eb66c" }}>Iniciar Riego</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.stop()} style={{ paddingVertical: 15, backgroundColor: "#fff", borderColor: "#2eb66c", borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 50, marginVertical: 10, marginTop: 20 }}>
                    <Text style={{ color: "#2eb66c" }}>Detener Riego</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    timer: {
        color: '#000',
        fontSize: 70,
        fontWeight: '800',

    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        fontSize: 18,
    },
    buttonBorder: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: 80,
        marginBottom: 30,
    },
    lapText: {
        color: '#000',
        fontSize: 18,
    },
    lapTimer: {
        width: 30,
    },
    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#151515',
        borderTopWidth: 1,
        paddingVertical: 10,
    },
    scrollView: {
        alignSelf: 'stretch',
    },
    fastest: {
        color: '#4BC05F',
    },
    slowest: {
        color: '#CC3531',
    },
    timerContainer: {
        justifyContent: 'center',
    }
})