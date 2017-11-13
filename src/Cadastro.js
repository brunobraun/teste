import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  AsyncStorage,
  Alert,
  Keyboard,
  Image,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Container, CheckBox, Content, Header, Left, Right, Body, Button, InputGroup, Input, Item, Icon, Label, Thumbnail, Picker } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import Spinner from 'react-native-loading-spinner-overlay';

import url from './URL';

import MeuId from './MeuId';

import Geral from './Geral';

import { SignalR } from './SignalR';

import moment from 'moment';

import f from 'tcomb-form-native';

var textboxSenha = require('./textboxSenha');

function validaEmail(email)  {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };



var Form = f.form.Form;

var Genero = f.enums({
  M: 'Masculino',
  F: 'Feminino',
  N: 'Prefiro não informar'
});

var tipoNomeUsuario = f.refinement(f.String, function (n) { 
  if(/[^a-zA-Z0-9]/.test(n)) return false;
  else return true;
});

var tipoEmail = f.refinement(f.String, function (n) { 
  if (!validaEmail(n)) return false;
  else return true;

});

var tipoDataNascimento = f.refinement(f.Date, function(n) {
   var data = moment(n).format('YYYY/MM/DD').toString();

    if(data ===  moment(new Date).format('YYYY/MM/DD').toString())  return false;
    else return true;
      
});

// here we are: define your domain model
var Person = f.struct({
  nomeDeUsuario: tipoNomeUsuario,              // a required string
  senha: f.String,
  email: tipoEmail,  // an optional string
  dataNascimento: tipoDataNascimento,               // a required number
  sexo: Genero

});


var {height, width} = Dimensions.get('window');


export default class Cadastro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checado: false,
      carregando: false,
      options: {
        fields: {
          dataNascimento: {
            error: 'Data de nascimento inválida.'
          },
          nomeDeUsuario: {
            error: 'Nome de usuário não pode ser vazio ou conter espaços / caracteres especiais.'
          },
          email: {
            help: 'Seu email nunca será publicado',
            error: 'Endereço de e-mail inválido.'
          },
          senha:
          {
            secureTextEntry: true,
            password: true,
            error: 'Digite uma senha.',
            template: textboxSenha,
            config: {
              senhaEscondida: true,
              onShowPasswordClicked: this.onPasswordShowClicked.bind(this)
            }
          }
        },
        config: {
          format: (date) => {
            return moment(date).format('DD/MM/YYYY');
          }

        }
      },
      value: {
        sexo: 'N',
        dataNascimento: new Date()
      }
    }



    this.novoCadastro = this.novoCadastro.bind(this); 

  }

  onPasswordShowClicked(senhaEscondida) {

    var options = f.update(this.state.options, {
      fields: {
        senha: {
          secureTextEntry: {'$set': senhaEscondida},
          password: {'$set': senhaEscondida},
          config: {
            senhaEscondida: {'$set': senhaEscondida}
          }
        }
      }
    });
    var value = this.state.value;

    this.setState({options: options, value: value});
  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };


  setId = async (id) => {
    try {
      MeuId.setId(parseInt(id));
      await AsyncStorage.setItem('meu_id', id);
      Geral.salvarToken(id); 
      SignalR.conectarSignalR();
      
      Actions.Introducao();
    } catch (error) {
      console.warn(error.message);
    }
  };


  voltar() {
    Actions.pop();
    
  }

  

  abretermos() {
    Linking.canOpenURL("http://www.eyhee.com.br/termosdeusuario.html").then(supported => {
      if (!supported) {
        Alert.alert('Termos de privacidade', 'Não foi possível abrir termos de usuário. Por favor acesse: http://www.eyhee.com.br/termosdeusuario.html');
      } else {
        return Linking.openURL('http://www.eyhee.com.br/termosdeusuario.html');
      }
    }).catch(err => console.warn('An error occurred', err));
  }

  novoCadastro() {
    var value = this.refs.form.getValue();
    if (!value) { // if validation fails, value will be null
      return;
    }
    
    /*
    if(/[^a-zA-Z0-9]/.test(value.nomeDeUsuario)) {
      Alert.alert('Atenção!', 'Nome de usuário não pode conter espaços ou caracteres especiais.');
      return;
    }
    */

/*
    if (!this.validaEmail(value.email)) {
      Alert.alert('Atenção!', 'Endereço de e-mail inválido.');
      return;
    }
*/


    var data = moment(value.dataNascimento).format('YYYY/MM/DD').toString();
/*
    if(data ===  moment(new Date).format('YYYY/MM/DD').toString()) {
      Alert.alert('Atenção!', 'Data de nascimento inválida.');
      return;
    }
*/

    if(!this.state.checado) {
      Alert.alert('Atenção!', 'Termos de usuário precisam ser aceitos.');
      return;
    }


    var sex = 3;
    if(value.sexo == 'M') sex = 0;
    else if(value.sexo == 'F') sex = 1;
    else if(value.sexo == 'L') sexo = 2;


    this.carregando(true);
    this.setState({
      value: {
        nomeDeUsuario: value.nomeDeUsuario,
        senha: value.senha,
        email: value.email,
        dataNascimento: value.dataNascimento,
        sexo: value.sexo
      }
    });


    fetch(url + '/Login/Cadastro', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: value.nomeDeUsuario,
      senha: value.senha,
      email: value.email,
      sexo: sex.toString(),
      dataNasc: data
    })
    }).then((response) => response.json())
        .then((responseJson) => {
          this.carregando(false);
          if(responseJson.sucesso){
            this.setId(responseJson.idUsuario.toString()).done();
          } else {
            Alert.alert('Erro', responseJson.erro);
          }

        })
        .catch((error) => {
          this.carregando(false);
          Alert.alert('Erro.', 'Erro de conexão com a internet. Por favor verifique sua conexão e tente novamente.');
      });

        
  }

  onChange = (value) => {
    this.setState({value: value});

  }

  aceitaTermos = () => {
    var checado = this.state.checado;

    this.setState({
      checado: !checado
    });
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

       <Content style={{backgroundColor: '#F5F6F8'}}>
       <View style={styles.container}>
       <Form
          ref="form"
          type={Person}
          options={this.state.options}
          value={this.state.value}
          onChange={(value) => {this.onChange(value)}}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 10}}>
          <CheckBox color={'#51D9E7'} checked={this.state.checado} onPress={() => {this.aceitaTermos()}}  />
          <TouchableOpacity style={{marginLeft: 20}} onPress={() => {this.aceitaTermos()}}>
            <Text style={{color: '#757575' }}>Eu aceito os </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.abretermos()}}>
          <Text style={{color: '#51D9E7'}}>Termos de usuário</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.novoCadastro} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
        
       </View>
      </Content>
      </Container>

    );
  }
}



const styles = {
  container: {
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#F5F6F8',
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
  buttonText: {
    fontSize: 18,
    color: '#51D9E7',
    alignSelf: 'center'
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
  }
};

