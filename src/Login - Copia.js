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
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {Footer, Container, Button, CheckBox} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { SignalR } from './SignalR';

import MeuId from './MeuId';

import url from './URL';


import Geral from './Geral';

import {MenuAtualizacoes} from './Menu';


const { width, height } = Dimensions.get("window");

const background = require("./images/paisagem.png");
const logo = require("./images/logo.png");
const eyhee = require("./images/eyhee.png");
const lockIcon = require("./images/login1_lock.png");
const personIcon = require("./images/login1_person.png");

export default class LoginBackup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      senha: '',
      apelido: '',
      carregando: false
    };

    this.postLogin = this.postLogin.bind(this);
  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };

  setId = async (id) => {
    try {
      MeuId.setId(parseInt(id));
      SignalR.conectarSignalR();
      await AsyncStorage.setItem('meu_id', id);

      
    } catch (error) {
      console.warn(error.message);
    }

  };



  postLogin() {
    Keyboard.dismiss();
    this.carregando(true);
    fetch(url + '/login/logar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario: this.state.apelido,
      senha: this.state.senha
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        
        if(responseJson.success){
          
          this.setId(responseJson.idUsuario.toString()).done();
          
          Geral.salvarToken(responseJson.idUsuario); 
          this.carregando(false);

          MenuAtualizacoes.atualizaNotificacoes(responseJson.idUsuario.toString());
          Actions.Mensagens();
        } else {
          this.carregando(false);
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        this.carregando(false);
        Alert.alert('Erro.' + error);
    });
  }

  esqueceusenha() {
    Actions.EsqueceuSenha();
  }

  cadastro() {
    Actions.Cadastro();
  }

  render() {
    return (

      <View style={styles.container}>
        <Spinner visible={this.state.carregando} textStyle={{color: '#FFF'}} />
        <Image source={background} style={styles.background} resizeMode="cover">
          <View style={styles.markWrap}>
            
            <Image source={logo} style={styles.logo} style={{width: 150, height: 150}} />
          </View>

          <KeyboardAvoidingView>
          <View style={styles.wrapper}>
            <View style={styles.fundoLogin}>
              <View style={styles.inputWrap}>
                <View style={styles.iconWrap}>
                  <Image source={personIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <TextInput 
                  placeholder="Usuário" 
                  placeholderTextColor="#FFF"
                  returnKeyType="next"                  
                  style={styles.input} 
                  autoCorrect={false}
                  onChangeText={(texto) => this.setState({apelido: texto})}
                  onSubmitEditing={(text) => this.refs.senhaInput.focus()}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.iconWrap}>
                  <Image source={lockIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <TextInput 
                  ref="senhaInput"
                  placeholderTextColor="#FFF"
                  placeholder="Senha" 
                  returnKeyType="go"
                  style={styles.input} 
                  secureTextEntry
                  onChangeText={(texto) => this.setState({senha: texto})}
                  onSubmitEditing={(text) => this.postLogin()}
                />
              </View>

            </View>
            <TouchableOpacity activeOpacity={.5} onPress={this.esqueceusenha}>
              <View>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </View>
            </TouchableOpacity>
          {/*
            <TouchableOpacity activeOpacity={.5} onPress = {this.postLogin}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
              </View>
            </TouchableOpacity>  
            */}
            <View style={{margin: 15}}>

            </View>
            <Button block style={{backgroundColor: "#91C744", margin: 10}} onPress = {this.postLogin}>
              <Text style={{color: 'white'}}>
                ENTRAR
              </Text>
            </Button>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
              <Text style={{color: 'white'}}>ou</Text>
            </View>
          </View>
          </KeyboardAvoidingView>

       

          <View style={styles.container}>
            <View style={{margin: 10}}>
              <Button block bordered success onPress={this.cadastro}>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>CRIE UMA CONTA</Text>
              </Button>
            </View>
          </View>
          {/*
            <View style={styles.container}>
              <View style={styles.signupWrap}>
                <Text style={styles.accountText}>Não tem uma conta?</Text>
                <TouchableOpacity activeOpacity={.5} onPress = {this.cadastro}>
                  <View>
                    <Text style={styles.signupLinkText}>Cadastre-se</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
*/}
        </Image>
      </View>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markWrap: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: null,
    height: null,
    flex: 1,
  },
  background: {
    width,
    height,
  },
  wrapper: {
    paddingVertical: 10,
  },
  fundoLogin: {
    //backgroundColor: '#3C768C'
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    margin: 10,
    backgroundColor: '#3C768C'

  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 20,
    width: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#91C744",
    paddingVertical: 20,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  forgotPasswordText: {
    color: "#FFF",
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 15,
    fontSize: 13
  },
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#D8D8D8"
  },
  signupLinkText: {
    color: "#FFF",
    marginLeft: 5,
  }
});

//AppRegistry.registerComponent('ombroamigo', () => ombroamigo);