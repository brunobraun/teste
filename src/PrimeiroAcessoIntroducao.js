import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';

import { Button } from 'native-base';

import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get("window");

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 50,
    marginRight: 50,
     textAlign: 'center',
  },
  textMenor: {
     textAlign: 'center',
    color: '#fff',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 50,
    marginTop: 30,
    lineHeight: 30
  },
  textItem: {
     textAlign: 'center',
    color: '#fff',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#51D9E7',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#ffffff',
    borderColor: '#F3F7F6',
    borderWidth: 1,
    borderRadius: 2,
    height: 45,
    elevation: 2,
    marginBottom: 10,
    marginTop: 60,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})

export default class PrimeiroAcessoIntroducao extends Component {
  render() {
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false}>        
        
        <View style={styles.slide1}>
            <Image resizeMode='cover' style={styles.image} source={require('./images/backgroung2.png')} >
            
              <Text style={styles.text}>Todos precisam</Text>
              <View>
                <Text style={styles.textMenor}>As pessoas precisam superar desafios ao longo de suas vidas, sejam eles bons ou ruins. Alguns desafios abalam emocionalmente e travam a ação para a superação.</Text>
              </View>
            <TouchableOpacity style={{padding: 10}} onPress={() => {Actions.Login()}}>
              <Text>PULAR</Text>
            </TouchableOpacity>
            </Image>

        </View>

        <View style={styles.slide1}>
          <Image resizeMode='cover' style={styles.image} source={require('./images/backgroung2.png')} >
            <Text style={styles.text}>Todos podem</Text>
            <View>
              <Text style={styles.textMenor}>Qualquer pessoa que tenha boa vontade e disposição pode ajudar a transformar a vida de alguém. Se você tem alguma experiência de vida que pode servir de inspiração ou exemplo compartilhe aqui. </Text>
            </View>
          </Image>
        </View>

        <View style={styles.slide1}>
          <Image resizeMode='cover' style={styles.image} source={require('./images/backgroung2.png')} >
          <Text style={styles.text}>Cadastre-se e preencha seu perfil</Text>
          <View>
            <Text style={styles.textMenor}>É importante que você escolha seus "Assuntos de Interesse" e compartilhe pelo menos uma história de suas experiências de vida. Só assim você poderá ser encontrado.</Text>
          </View>
          </Image>
        </View>


        <View style={styles.slide1}>
          <Image resizeMode='cover' style={styles.image} source={require('./images/backgroung2.png')} >
            <Text style={styles.text}>Conteúdos</Text>
            <View>
              <Text style={styles.textMenor}>Tenha acesso à um Feed de conteúdos exclusivos, super positivos, que inspiram melhorias de bem-estar e transformação da sua vida.</Text>
            </View>
          </Image>
        </View>

        <View style={styles.slide1}>
          <Image resizeMode='cover' style={styles.image} source={require('./images/backgroung2.png')} >
            <Text style={styles.text}>Você ainda pode...</Text>
              <View style={{marginTop: 30}}>
                <Text style={styles.textItem}>Ficar anônimo ou não</Text>
                <Text style={styles.textItem}>Avaliar suas conversas</Text>
                <Text style={styles.textItem}>Organizar seu conteúdo</Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => {Actions.Login()}} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>COMEÇAR</Text>
              </TouchableOpacity>
          </Image>
        </View>
        
      </Swiper>
    )
  }
}