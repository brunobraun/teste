import React, { Component } from 'react';
import {  
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { Container,Footer, Content, Icon, CheckBox, Button, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';

import MeuId from './MeuId';

import Spinner from 'react-native-loading-spinner-overlay';

import f from 'tcomb-form-native';

const { width, height } = Dimensions.get("window");

var eyhee = require('./images/eyhee.png');


var Form = f.form.Form;

var Nome = f.struct({
  nomeOuApelido: f.String
});

export default class IntroducaoNome extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      modalImagens: false,
      carregando: false,
      anonimo: false,
      notificacoes: true,
      options: {
        auto: 'placeholders',
        fields: {
          nomeOuApelido: {

             error: 'Esse campo não pode ser vazio',
             placeholder: 'Informe seu nome'
          }
        }
      },
      value: {
        nomeOuApelido: ''
      }
    }

    this.foto = null;

  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };

  clicouAnonimo = () => {
    var estadoAtualAnonimo = this.state.anonimo;


    var informe = 'Informe um apelido';
    if(estadoAtualAnonimo == true) {
      informe = 'Informe seu nome'
    }

    var options = f.update(this.state.options, {
      fields: {
        nomeOuApelido: {
          placeholder: {'$set': informe},
           
        }
      }
    });

    this.setState({
      anonimo: !estadoAtualAnonimo,
      options: options,
      value: null

    });
  }

  clicouNotificacoes = () => {
    var estadoAtualNotificacoes = this.state.notificacoes;

    var anonimo = this.state.anonimo;
    var options = this.state.options;
    var value = this.state.value;


    var value = this.refs.form.getValue();

    this.setState({
      notificacoes: !estadoAtualNotificacoes, 
      anonimo: anonimo,
      value: value
    })

  }

  salvarEContinuar = () => {
    var value = this.refs.form.getValue();
    if (!value) { // if validation fails, value will be null
      return;
    } 

    console.warn(this.state.notificacoes);

    this.carregando(true);

    console.warn(this.foto);
    var foto = this.foto == null ? null : url + this.foto;

    fetch(url + '/Login/AtualizaNome', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: MeuId.getId(),
      nome: value.nomeOuApelido,
      anonimo: this.state.anonimo,
      naoQuerNotificacoes: !this.state.notificacoes,
      foto: foto
    })
    }).then((response) => response.json())
        .then((responseJson) => {
          this.carregando(false);
          if(responseJson.sucesso){
            Actions.IntroducaoAssuntos();
          } else {
            Alert.alert(' ', responseJson.erro);
          }

        })
        .catch((error) => {
          this.carregando(false);
          console.warn(error);
      });
    
  }

escolheFoto = (item) => {
        this.foto = item;
        var estadoAtualNotificacoes = this.state.notificacoes;

        var anonimo = this.state.anonimo;
        var options = this.state.options;
        var value = this.state.value;


        var value = this.refs.form.getValue();

        this.setState({modalImagens: false,
          notificacoes: estadoAtualNotificacoes, 
          anonimo: anonimo,
          value: value});
    }

  handlerModal = (valor) => {
      var estadoAtualNotificacoes = this.state.notificacoes;

        var anonimo = this.state.anonimo;
        var options = this.state.options;
        var value = this.state.value;


        var value = this.refs.form.getValue();

        this.setState({modalImagens: valor,
          notificacoes: estadoAtualNotificacoes, 
          anonimo: anonimo,
          value: value});
  }

  render() {
    return (
      <Container style={styles.container}>

     

      <Spinner visible={this.state.carregando} textStyle={{color: '#FFF'}} />
        <Content contentContainerStyle={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          
        <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.modalImagens}
              onRequestClose={() => {this.handlerModal(false)}}
          >
              <View style={{marginTop: 20, justifyContent:'center' }}>
                  <View style={{alignItems: 'flex-start', paddingLeft: 20}} >
                      <TouchableOpacity onPress={() => {this.handlerModal(false)}}>
                          <Icon name='arrow-back' style={{color: 'black'}}/>
                      </TouchableOpacity>
                  </View>
                  <ScrollView>
                      <View style={styles.imagens}>
                      {
                          imagens.map((item, index) => {
                          return (
                              <TouchableOpacity key={index} onPress={ () => {this.escolheFoto(item)} }>
                                  <Thumbnail key={index} large source={{uri: url + item }} />
                              </TouchableOpacity>
                          )
                          })
                      }
                      </View>
                  </ScrollView>
              </View>
          </Modal>

          <View style={{alignItems: 'stretch', marginLeft: height * 0.043, marginRight: height * 0.043}}>

            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#F5A44D', fontSize: 18, textAlign: 'center'}}>Como você gostaria de ser chamado?</Text>
               <Text style={{color: '#757575', fontSize: 13, marginBottom: 30,textAlign: 'center'}}>Você pode optar por ser anônimo e seus dados pessoais estarão preservados.</Text>
            </View>



            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <CheckBox checked={this.state.anonimo} onPress={() => {this.clicouAnonimo()}} />
              <TouchableOpacity style={{marginLeft: 20}} onPress={() => {this.clicouAnonimo()}}>
                <Text style={{color: '#757575', fontSize: 16}}>Quero ser anônimo</Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 30, marginBottom: 30}}>
              <Form
                ref="form"
                type={Nome}
                options={this.state.options}
                value={this.state.value}
              />
              <TouchableOpacity onPress={() => {this.handlerModal(true)}} style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10,justifyContent: 'center',alignItems: 'center'}}><Icon name='ios-camera-outline' /><Text> Escolha uma imagem de perfil</Text></TouchableOpacity>
            </View>

            

          </View>
          <View style={{alignItems: 'stretch', marginLeft: height * 0.043, marginRight: height * 0.043, marginTop: height * 0.043}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#F5A44D', fontSize: 18, textAlign: 'center'}}>Deseja receber notificações?</Text>
               <Text style={{color: '#757575', fontSize: 13, marginBottom: 30, textAlign: 'center'}}>Caso desmarque esta opção, você não receberá notificações de conversas.</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <CheckBox checked={this.state.notificacoes} onPress={() => {this.clicouNotificacoes()}} />
              <TouchableOpacity style={{marginLeft: 20}} onPress={() => {this.clicouNotificacoes()}}>
                <Text style={{color: '#757575', fontSize: 16}}>Quero receber notificações.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      {/*
        <Button block style={{marginLeft: height * 0.043, marginRight: height * 0.043, backgroundColor: '#F5A44D' }} onPress={() => {this.salvarEContinuar()}}>
          <Text style={{color: 'white'}}>Salvar</Text>
        </Button>
      */}
        <Footer style={styles.footer}>
            <TouchableOpacity onPress={() => {this.salvarEContinuar()}}>
              <Icon name='arrow-forward' style={{margin: 15}}/>
            </TouchableOpacity>
          {/*<TouchableOpacity onPress={() => {this.proxima()}}><Icon name='arrow-forward' /></TouchableOpacity>*/}
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F8', 
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
  },
  imagens: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 25,
    },
});
