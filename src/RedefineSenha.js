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

var Dados = f.struct({
  email: f.String,
  codigo: f.String,
  novaSenha: f.String,
  confirmacaoSenha: f.String 
});

var options = {
  fields: {
    novaSenha:
    {
      secureTextEntry: true,
      password: true
    },
    confirmacaoSenha:
    {
      secureTextEntry: true,
      password: true
    }

  }
};

export default class EsqueceuSenha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      codigo: '',
      senha: '',
      confirma_senha: '',
      carregando: false
    }

    this.redefinirSenha = this.redefinirSenha.bind(this); 

  }

  redefinirSenha() {
    Keyboard.dismiss();
    
    var value = this.refs.form.getValue();
    if (!value) { // if validation fails, value will be null
      return;
    }



    if(value.novaSenha === value.confirmacaoSenha) {
      this.setState({carregando: true});
      fetch(url + '/login/RedefinirSenha', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: value.email,
        codigo: value.codigo,
        senha: value.novaSenha
      })
    }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({carregando: false});
          if(responseJson.sucesso){

            Alert.alert('OK!', responseJson.msg);
            Actions.Login();
          } else {
            Alert.alert('Erro.', responseJson.erro);
          }


        })
        .catch((error) => {
          this.setState({carregando: false});
          console.warn(error);
      });
      } else {
        Alert.alert('Erro.', 'As senhas não conferem.')
      }
    
    
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
          type={Dados}
          options={options}
        />

        <View style={{marginTop: 10}}>
          <TouchableOpacity activeOpacity={.5} onPress = {this.redefinirSenha}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Redefinir Senha</Text>
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
    elevation: 2,
    borderWidth: 1,
    borderRadius: 2,
    height: 45,
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

