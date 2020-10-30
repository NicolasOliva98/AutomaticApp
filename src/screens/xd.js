import React, {useState} from "react";
import { Image, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Ion from 'react-native-vector-icons/Ionicons'

const slides = [
  {
    key: "one",
    title: "JUST TRAVEL",
    text:
      "Lorem ipsum dolor sit amet consecte tuer adipsing elit sed diam monum my nibh eusimod eltor",
    image: 'https://raw.githubusercontent.com/Minte-grace/React-Native-Onboarding/master/images/1.png',
    
  },
  {
    key: "two",
    title: "TAKE A BREAK",
    text:
      "Lorem ipsum dolor sit amet consecte tuer adipsing elit sed diam monum my nibh eusimod eltor",
    image: 'https://raw.githubusercontent.com/Minte-grace/React-Native-Onboarding/master/images/2.png',
  },
  {
    key: "three",
    title: "ENJOY YOUR JOURNEY",
    text:
      "Lorem ipsum dolor sit amet consecte tuer adipsing elit sed diam monum my nibh eusimod eltor",
    image: 'https://raw.githubusercontent.com/Minte-grace/React-Native-Onboarding/master/images/3.png',
  },
]

export default ({ navigation}) => {

    const[showRealApp, setShowRealApp] = useState(false)

  const _renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{uri: item.image}}
          style={{
            resizeMode: "cover",
            height: "73%",
            width: "100%",
          }}
        />
        <Text
          style={{
            paddingTop: 25,
            paddingBottom: 10,
            fontSize: 23,
            fontWeight: "bold",
            color: "#21465b",
            alignSelf: "center",
          }}
        >
          {item.title}
        </Text>

        <Text style={{
          textAlign:"center",
          color:"#b5b5b5",
          fontSize:15,
          paddingHorizontal:30
        }}>
          {item.text}
        </Text>
      </View>
    )}

   const _renderNextButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Ion
              name="arrow-forward"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </View>
        );
      };
    const _renderDoneButton = () => {
        return (
          <TouchableOpacity style={styles.buttonCircle} onPress={() =>  navigation.navigate('Login')} >
            <Ion
              name="checkmark"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </TouchableOpacity>
        );
      };
    return (
    <AppIntroSlider
      renderItem={_renderItem} 
      data={slides} 
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
      activeDotStyle={{
        backgroundColor:"#21465b",
        width:35
      }}
     />
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
