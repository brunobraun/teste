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
import {Footer, Container, Button, CheckBox, Header, Input, Content, Item, Form, Label, FooterTab, Icon} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { SignalR } from './SignalR';

import MeuId from './MeuId';

import url from './URL';

import Geral from './Geral';

import Hr from './Hr';

import {MenuAtualizacoes} from './Menu';

import FBSDK, { LoginButton, AccessToken, GraphRequestManager, GraphRequest, LoginManager, AppEventsLogger } from 'react-native-fbsdk';

const { width, height } = Dimensions.get("window");

const background = require("./images/paisagem.png");
const logo = require("./images/logo_menu.png");
const eyhee = require("./images/eyhee.png");
const lockIcon = require("./images/login1_lock.png");
const personIcon = require("./images/login1_person.png");

var me_login = '';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      senha: '',
      apelido: '',
      carregando: false
    };

    this.postLogin = this.postLogin.bind(this);
    this.postLoginFacebook = this.postLoginFacebook.bind(this);


    me_login = this;

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


  sucessoLogin = (responseJson, primeiroAcesso) => {
    this.setId(responseJson.idUsuario.toString()).done();
          
    Geral.salvarToken(responseJson.idUsuario);
    this.carregando(false);

    MenuAtualizacoes.atualizaNotificacoes(responseJson.idUsuario.toString());
    
    console.warn(responseJson.primeiroAcesso);

    if (responseJson.primeiroAcesso == true) Actions.IntroducaoAssuntos();
    else Actions.Mensagens();
  }

  postLoginFacebook(result) {
    this.carregando(true);

    var fbId = result.id.toString();
 
    //var foto = result.picture.data.url;


    fetch(url + '/Login/LogarFacebook', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      facebookId: fbId,
      dataNasc: result.birthday,
      email: result.email,
      nome: result.name,
      sexo: result.gender
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        
        if(responseJson.success) {
          this.sucessoLogin(responseJson);
        } else {
          this.carregando(false);
          Alert.alert('Erro', responseJson.erro);
        }

      })
      .catch((error) => {
        this.carregando(false);
        console.warn(error);
        Alert.alert('Erro.', 'Erro de conexão com a internet. Por favor verifique sua conexão e tente novamente.');
    });
  }

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
          this.sucessoLogin(responseJson);
        } else {
          this.carregando(false);
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        this.carregando(false);
        Alert.alert('Erro.', 'Erro de conexão com a internet. Por favor verifique sua conexão e tente novamente.');
    });
  }

  esqueceusenha() {
    Actions.EsqueceuSenha();
  }

  cadastro() {
    Actions.Cadastro();
  }

  deslogar = () => {
   
   LoginManager.logOut();
  }

  _fbAuth() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_birthday']).then(
      function(result) {
        if (result.isCancelled) {
          console.warn('Login cancelled');
        } 
        else {

//          console.warn('Login success with permissions: '+result.grantedPermissions.toString());

        
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              let accessToken = data.accessToken;
              //alert(accessToken.toString());

              const responseInfoCallback = (error, result) => {
                if (error) {
                  console.warn(error);
                  alert('Error fetching data: ' + error.toString());
                } else {
                  
                  me_login.postLoginFacebook(result);
                  
                }
              }

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name,picture,gender,birthday'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start();

            })

        }
      },
      function(error) {
        console.warn('Login fail with error: ' + error);
      }
    );
  }

  render() {
    return (

      <Container style={styles.container}>
        <Spinner visible={this.state.carregando} textStyle={{color: '#FFF'}} />
        <Content>
          <View style={{alignItems: 'center', marginTop: height * 0.06, marginBottom: height * 0.09}}>
            <Image source={logo} style={styles.logo} style={{width: 112, height: 112}} />
          </View>

          <View style={{marginLeft: 30, marginRight: 30}}>
            <Item>
              <Icon active name='ios-person-outline' />
              <Input 
                placeholder="Nome de usuário ou e-mail" 
                style={{fontSize: 15}}
                returnKeyType="next"                  
                autoCorrect={false}
                onChangeText={(texto) => this.setState({apelido: texto})}
                onSubmitEditing={(event) => {this.FirstInput._root.focus(); }}
              />
            </Item>
            <Item>
              <Icon active name='ios-lock-outline' />
              <Input 
                ref={(ref) => { this.FirstInput = ref; }}
                placeholder="Senha"
                style={{fontSize: 15}}
                returnKeyType="go"
                secureTextEntry
                onChangeText={(texto) => this.setState({senha: texto})}
                onSubmitEditing={(text) => this.postLogin()}
              />
            </Item>

            <TouchableOpacity activeOpacity={.5} onPress={this.esqueceusenha}>
              <View>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </View>
            </TouchableOpacity>

            <Button block style={styles.button} onPress = {this.postLogin}>
              <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>
                ENTRAR
              </Text>
            </Button>
{/*
            <LoginButton
            publishPermissions={["publish_actions"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.warn("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.warn("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      let accessToken = data.accessToken;
                      alert(accessToken.toString());

                      const responseInfoCallback = (error, result) => {
                        if (error) {
                          console.warn(error)
                          console.warn('Error fetching data: ' + error.toString());
                        } else {
                          console.warn(result)
                          console.warn('Success fetching data: ' + result.toString());
                        }
                      }

                      const infoRequest = new GraphRequest(
                        '/me',
                        {
                          accessToken: accessToken,
                          parameters: {
                            fields: {
                              string: 'email,name,first_name,middle_name,last_name'
                            }
                          }
                        },
                        responseInfoCallback
                      );

                      // Start the graph request.
                      new GraphRequestManager().addRequest(infoRequest).start();

                    })
                }
              }
            }
            onLogoutFinished={() => alert("logout.")} />
*/}
      

            <Hr text="ou" margin={0} />

            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: height * 0.018}} onPress={() => this._fbAuth()}>
               <Icon name='logo-facebook' style={{color: '#3b5998', marginRight: 10}}/><Text style={{color: '#3b5998', fontWeight: 'bold'}}>Entrar com Facebook</Text>
            </TouchableOpacity>
{/*
            <TouchableOpacity onPress={() => this.deslogar()}>
               <Text style={{color: '#3b5998', fontWeight: 'bold'}}>sair</Text>
            </TouchableOpacity>
*/}
          
        </View>
        </Content>

        
          
       
        <View style={{marginBottom: height * 0.02, marginLeft: height * 0.043, marginRight: height * 0.043, marginTop: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
          
          <Text style={{color: '#555555'}}>Não possui uma conta? </Text>
          <TouchableOpacity onPress={this.cadastro}>
            <Text style={{color: '#555555', fontWeight: 'bold'}}> Cadastre-se aqui</Text>
          </TouchableOpacity>
        </View>

      </Container>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between'
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
  button: {
    height: 36,
    backgroundColor: '#51D9E7',
    borderColor: '#F3F7F6',
    borderWidth: 1,
    borderRadius: 2,
    height: 45,
    elevation: 1,
    marginBottom: height * 0.04,
    marginTop: height * 0.06,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  forgotPasswordText: {
    paddingTop: height * 0.014,
    backgroundColor: "transparent",
    textAlign: "right",
    fontSize: 13
  }
});
