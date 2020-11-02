import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const data = [
  {
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: 'https://automatic-us-east-1.s3.amazonaws.com/ilustraciones/watering_plants.png',
    bg: '#febe29',
  },
  {
    title: 'Title 2',
    text: 'Other cool stuff',
    image: 'https://automatic-us-east-1.s3.amazonaws.com/ilustraciones/reminder_note.png',
    bg: '#59b2ab',
  },
  {
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: 'https://automatic-us-east-1.s3.amazonaws.com/ilustraciones/landing_page.png',
    bg: '#22bcb5',
  },
]

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 330,
    height: 330,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
  },
});

export default ({ navigation}) => {
 const _renderItem = ({item}) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

 const _keyExtractor = (item) => item.title;

 const _renderPagination = (activeIndex) => {
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {data.length > 1 &&
              data.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? {backgroundColor: 'white'}
                      : {backgroundColor: 'rgba(0, 0, 0, .2)'},
                  ]}
                  onPress={() => slider?.goToSlide(i, true)}
                />
              ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}
              style={[styles.button, {backgroundColor: '#023e3f'}]}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          renderPagination={_renderPagination}
          data={data}
        
        />
      </View>
    )
  
}