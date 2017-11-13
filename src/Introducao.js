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
import { Container,Footer, Content, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

import MeuId from './MeuId';

const { width, height } = Dimensions.get("window");

var eyhee = require('./images/eyhee.png');

export default class Introducao extends Component {
  constructor(props) {
    super(props); 

  }

  
  render() {
    return (
      <Container style={styles.container}>

          <View style={{marginTop: height * 0.073, alignItems: 'center'}}>
            <Image style={{width: 100, height: 50}} source={eyhee} />        
          </View>
          <View style={{alignItems: 'center', marginLeft: height * 0.058, marginRight: height * 0.058}}>
            <Text style={{color: '#F5A44D', fontSize: 18}}>Bem Vindo!</Text>
            <Text style={{color: '#757575', fontSize: 15, marginTop: height * 0.043, alignItems: 'center', justifyContent: 'center'}}>Conte-nos um pouco mais sobre você e vamos encontrar pessoas com as quais você mais se parece de acordo com seus assuntos de interesse!</Text>
          </View>
          <Footer style={styles.footer}>
            <TouchableHighlight onPress={() => {Actions.IntroducaoNome()}}>
              <Icon name='arrow-forward' style={{margin: 15}} />
            </TouchableHighlight>
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
