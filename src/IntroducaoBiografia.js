import React, { Component } from 'react';
import {  
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Container,Footer, Content, Icon, CheckBox, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

import Spinner from 'react-native-loading-spinner-overlay';

import MeuId from './MeuId';

import f from 'tcomb-form-native';


const { width, height } = Dimensions.get("window");

var eyhee = require('./images/eyhee.png');

var Form = f.form.Form;

var Pessoa = f.struct({
  quem: f.String
});


export default class IntroducaoBiografia extends Component {
  constructor(props) {
    super(props); 


    this.state = {
      options: {
        auto: 'none',
        fields: {
          quem: {
            placeholder: 'Conte mais sobre você e quais são seus objetivos no aplicativo...',
            error: 'Este campo deve ser preenchido.',
            multiline: true,
            maxLength: 200,
            stylesheet: {
                ...Form.stylesheet,
                textbox: {
                  ...Form.stylesheet.textbox,
                  normal: {
                    ...Form.stylesheet.textbox.normal,
                    height: height * 0.292
                  },
                  error: {
                    ...Form.stylesheet.textbox.error,
                    height: height * 0.292
                }
              }
            }
          }
        }
      }
    }
  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };

  salvarEContinuar = () => {
    var value = this.refs.form.getValue();

    if (!value) { // if validation fails, value will be null
      return;
    }
    
    var quem = value.quem == null ? " " : value.quem;


    this.carregando(true);

    fetch(url + '/Login/AtualizaBiografia', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: MeuId.getId(),
      quem: quem
    })
    }).then((response) => response.json())
        .then((responseJson) => {
          this.carregando(false);
          if(responseJson.sucesso){
            Actions.IntroducaoFinal();
          } else {
            Alert.alert(' ', responseJson.erro);
          }

        })
        .catch((error) => {
          this.carregando(false);
          console.warn(error);
    });

  }

  proxima = () => {
    Actions.IntroducaoFinal();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Spinner visible={this.state.carregando} textStyle={{color: '#FFF'}} />
        <Content contentContainerStyle={{marginLeft: height * 0.043, marginRight: height * 0.043,  justifyContent: 'center', flex: 1}}>
            <View style={{alignItems: 'center', marginTop: height * 0.029 }}>
              <Text style={{color: '#F5A44D', fontSize: 18, textAlign: 'center'}}>Um pouco mais sobre você...</Text>
              <Text style={{color: '#F5A44D', fontSize: 13, marginBottom: height * 0.043, textAlign: 'center'}}>(Se preferir você pode fazer isso depois)</Text>
            </View>

            <View style={{justifyContent: 'center'}}>
              <Form
                ref="form"
                type={Pessoa}
                options={this.state.options}
                value={this.state.value}
              />
              <Text style={{fontSize: 13}}>Exemplo 1: Convivi por anos com um familiar que sofreu de câncer. Nesse período, tive muitas experiências e estou aqui para compartilhar e confortar pessoas que estão passando por isso...</Text>
              <Text style={{fontSize: 13, marginTop: 10}}>Exemplo 2: Me sinto muito carente e não tenho uma boa relação com meus familiares. Procuro conversar com alguém que já tenha passado por uma experiência parecida sobre esse tipo de relacionamento...</Text>
            </View>
        </Content>
        {/*
        <Button block style={{marginLeft: height * 0.043, marginRight: height * 0.043, backgroundColor: '#F5A44D' }} onPress={() => {this.salvarEContinuar()}}>
          <Text style={{color: 'white'}}>Começar!</Text>
        </Button>
        */}
        <Footer style={styles.footer}>
      {/*
            <TouchableOpacity onPress={() => {this.proxima()}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', margin: 15}}>
              PULAR
            </Text>
          </TouchableOpacity>
      */}
            <TouchableOpacity onPress={() => {this.salvarEContinuar()}}>
              <Icon name='arrow-forward' style={{margin: 15}}/>
            </TouchableOpacity>
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
  }
});
