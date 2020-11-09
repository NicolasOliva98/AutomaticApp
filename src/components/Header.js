import React from "react"
import { Text, TouchableOpacity,StyleSheet,View } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const Header = ({ title, onPress, iconName, children}) => (
    <View style={styles.header}>
       <TouchableOpacity onPress={onPress} style={styles.icon}>
        <Icon name={iconName} size={35} color='white' />
       </TouchableOpacity>
        <Text style={styles.text}>{title.toUpperCase()}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:60,
        flexDirection:'row',
        backgroundColor:'#409b74',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon:{
        position:'absolute',
        top:15,
        left:10
    },
    text:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
    }
})


export default Header;
