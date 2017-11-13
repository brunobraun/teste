import React, { Component } from 'react';
import {  
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert
} from 'react-native';
import { Container,Footer, Content, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

import MeuId from './MeuId';

const { width, height } = Dimensions.get("window");

var eyhee = require('./images/eyhee.png');

var swipe = require('./images/swipe.png');

export default class IntroducaoFinal extends Component {
  constructor(props) {
    super(props); 

  }

  comecar = () => {
    Actions.Pessoas();
  }
  
  render() {
    return (
      <Container style={styles.container}>

          <Content contentContainerStyle={{marginLeft: height * 0.043, marginRight: height * 0.043,  justifyContent: 'center', flex: 1}}>
            <View style={{alignItems: 'center', marginTop: height * 0.029 }}>
              <Text style={{color: '#F5A44D', fontSize: 15, marginBottom: height * 0.043, textAlign: 'center'}}>
                Pronto! Agora vamos mostrar as pessoas que mais se encaixam com o seu perfil para que possam compartilhar experiências de vida.
              </Text>
            {/*
              <Text>
                Visualize o perfil completo de alguém clicando em: Conhecer
              </Text>
              <Text>
                Se quiser iniciar uma conversa, clique em: Conversar
              </Text>
            */}
              <Text style={{color: '#555555', textAlign: 'center', marginBottom: height * 0.043}}>
                Você pode navegar pelas pessoas encontradas deslizando sua tela para o lado:
              </Text>
              <Image style={{width: 100, height: 100}} source={swipe} /> 
            </View>

            
        </Content>
        
        <Button block style={{marginLeft: height * 0.043, marginRight: height * 0.043, backgroundColor: '#F5A44D' }} onPress={() => {this.comecar()}}>
          <Text style={{color: 'white'}}>Começar!</Text>
        </Button>
        <Footer style={styles.footer}>
        </Footer>
        
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F8', 
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  footer: {
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    marginLeft: height * 0.021, 
    marginRight: height * 0.021
  },
  logo: {
    width: null,
    height: null,
    flex: 1
  }
});
