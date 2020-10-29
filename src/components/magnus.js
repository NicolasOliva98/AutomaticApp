import React from 'react'
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Div, ThemeProvider, Text, Button, Input, Icon, Image } from 'react-native-magnus';

const LOGO_URL = `https://automatic-us-east-1.s3.amazonaws.com/Copia+de+Automatic.png`;
export default ({navigation}) => {
  return (
    <ThemeProvider>
    <SafeAreaView style={{backgroundColor:'#fff', flex: 1}}>
        <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <Div bg="white" px="md" mx="md" mt="3xl">
        <Image mt="xl" resizeMode="contain" w="100%" h={80} justifyContent="center" source={{ uri: LOGO_URL }} />
        <Div mt="md" pt="2xl">
          <Text fontSize="md" mb="sm">Email</Text>
          <Input 
            rounded="sm"
            bg="gray100"
            borderWidth={0}
          />
        </Div>
        <Div mt="xl">
          <Text fontSize="md" mb="sm">Contraseña</Text>
           <Input
            bg="gray100"
            secureTextEntry
            rounded="sm"
            borderWidth={0}
          />
        </Div>
        <Div justifyContent="flex-end" flexDir="row">
          <Button mt="md" bg="white" color="gray800" fontSize="md" px={0}>Olvidé la contraseña</Button>
        </Div>
        <Button block bg="green700" py="lg" mt="md" onPress={() => navigation.navigate('Home')} >Ingresar</Button>

        <Div justifyContent="center" alignItems="center" flexDir="row" mt="lg">
          <Text fontSize="md">¿Aún no tienes cuenta?</Text>
          <Button bg="white" fontSize="md" color="blue700" fontWeight="bold">Registrate aquí</Button>
        </Div>
      </Div>
    </SafeAreaView>
  </ThemeProvider>
  );
}

