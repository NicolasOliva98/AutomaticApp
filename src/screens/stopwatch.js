import React, { Component } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity
} from 'react-native'
import moment from 'moment'



function Timer({ interval, style }) {
    const pad = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)
    const hours = duration.hours() / 10
    return (
        <View style={styles.timerContainer}>
             <Text style={style}>{pad(duration.minutes())}:{pad(duration.seconds())},{pad(centiseconds)}</Text>
        </View>
    )

}

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            now: 0,
            laps: [],
        }
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
        }, 100)

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

    render() {
        const { now, start, laps } = this.state
        const timer = now - start
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
        paddingTop: 130,
        paddingHorizontal: 20,
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