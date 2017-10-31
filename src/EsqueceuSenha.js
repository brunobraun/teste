import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  AsyncStorage,
  Alert,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Container, Header, Left, Right, Body, Button, InputGroup, Input, Item, Icon, Label, Content } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';

import url from './URL';

import f from 'tcomb-form-native';



var Form = f.form.Form;

var Email = f.struct({
  email: f.String  // an optional string
});

var options = {};

export default class EsqueceuSenha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carregando: false
    }


    this.recuperarSenha = this.recuperarSenha.bind(this); 

  }

  recuperarSenha() {
    Keyboard.dismiss();
    this.setState({carregando: true});

    var value = this.refs.form.getValue();
    if (!value) { // if validation fails, value will be null
      return;
    }

    fetch(url + '/login/RecuperarSenha', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: value.email
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({carregando: false});
        if(responseJson.sucesso){
          Alert.alert('Sucesso!', 'Um código para redefinir sua senha foi enviado para o e-mail informado.')
          Actions.RedefineSenha();
        } else {
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        this.setState({carregando: false});
        console.warn(error);
    });
    
  }

  voltar() {
    Actions.pop();
  }

  render() {
    return (
      <Container style={{backgroundColor: '#F5F6F8'}}>
      <Spinner visible={this.state.carregando} textStyle={{color: '#FFF'}} />
      <Header style={styles.header}>
          <TouchableOpacity onPress={() => {this.voltar()}}>
              <Icon name='arrow-back' style={{color: '#555555', margin: 5}}/>
          </TouchableOpacity>
      </Header>
      <Content style={styles.content}>

      <Form
        ref="form"
        type={Email}
        options={options}
      />

      <View>
        <Text>Informe seu e-mail para receber o código para redefinição de senha. </Text>
      </View>

      

      <View style={{marginTop: 10}}>
        <TouchableOpacity activeOpacity={.5} onPress = {this.recuperarSenha}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Enviar código</Text>
          </View>
        </TouchableOpacity>
          </View>
      </Content>
      </Container>
    );
  }
}


const styles = {
  content: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    padding: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    elevation: 1,
    height: 60
  },
  arrow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  button: {
    height: 36,
    backgroundColor: '#ffffff',
    borderColor: '#F3F7F6',
    borderWidth: 1,
    borderRadius: 2,
    height: 45,
    elevation: 2,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#51D9E7',
    alignSelf: 'center'
  },
};

