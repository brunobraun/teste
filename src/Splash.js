import React, { Component } from 'react';
import {  
  StyleSheet,
  View,
  AsyncStorage,
  Image,
  Dimensions
} from 'react-native';
import { Container } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { SignalR } from './SignalR';

import MeuId from './MeuId';

import Geral from './Geral';

import {MenuAtualizacoes} from './Menu';

const { width, height } = Dimensions.get("window");

export default class Splash extends Component {
  constructor(props) {
    super(props);

    this.getId = this.getId.bind(this);
  }


  componentDidMount() {

    this.getId().done();
  }



  async getId() {
    
    try {
        let value = await AsyncStorage.getItem('meu_id');
        if (value != null && value != undefined) {
          
          MeuId.setId(value);

          SignalR.conectarSignalR();
          
          Geral.salvarToken(value);  

          MenuAtualizacoes.atualizaNotificacoes(value);
          

          setTimeout(() => {Actions.Mensagens()}, 200);
          
        }
        else {
          setTimeout(() => {Actions.PrimeiroAcessoIntroducao()}, 200);
        }
        return true;
    }
    catch(e) {
        console.warn('Erro get id splash: ', e);
        return false;
        // Handle exceptions
    }
  }

  // TODO marginTop substituir por % relativa da tela
  render() {

    return (
      <Container>
        <Image source={require('./images/backgroung2.png')} style={styles.background} resizeMode="cover">
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Image style={{height: 216, width: 160}} source={require('./images/logoeyhee.png')} />
        </View>

        </Image>
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  background: {
    width,
    height,
  }
});