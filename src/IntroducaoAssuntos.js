import React, { Component } from 'react';
import {  
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Container,Footer, Content, Icon, CheckBox, Button, Card, CardItem, Body, Badge, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

//import Spinner from 'react-native-loading-spinner-overlay';

import MeuId from './MeuId';

import SugerirTag from './SugerirTag';

const { width, height } = Dimensions.get("window");

var eyhee = require('./images/eyhee.png');


export default class IntroducaoAssuntos extends Component {
  constructor(props) {
    super(props); 

    this.state = {
       editarTags: [],
       carregando: false,
       modalSugerirTag: false

    }

  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };

  carregaTags = () => {
    var url_final = url + '/tag/todas';
    
    this.carregando(true);

    fetch(url_final)
    .then((response) => response.json())
    .then((responseJson) => {

      if(responseJson.sucesso) {
        this.setState({
          editarTags: responseJson.tags,
          carregando: false
        });
      } else {
        this.carregando(false);
        Alert.alert('Erro', responseJson.erro);
      }

    })
    .catch((error) => {
      console.warn(error);
      this.carregando(false);
    });
  }

  editarTags = () => {
    var idTags = [];
    var tags = this.state.editarTags;
    for(var i = 0; i < tags.length; i++) {
      if(tags[i].selecionado) idTags.push(tags[i].idTag);
    }

    // TODO login tem que virar usuario

    fetch(url + '/login/EditarTags', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: MeuId.getId(),
        tags: idTags        
      })
    }).then((response) => response.json())
        .then((responseJson) => {

          if(responseJson.sucesso){

          } else {
            Alert.alert('erro: ' + responseJson.erro);
          }

        })
        .catch((error) => {
          console.warn(error);
    });
  }

  componentDidMount() {
    this.carregaTags();
  }

  proxima = () => {
    this.editarTags();
    Actions.IntroducaoBiografia();
  }

  clicaTag = (index,item) => {
    this.state.editarTags[index].selecionado = !item.selecionado;
    this.setState({editarTags: this.state.editarTags});
  }

  renderTags = () => {
    if(this.state.carregando == false) {
      return(
        <Body style={{flexWrap: 'wrap', flexDirection: 'row'}}>
         {
          this.state.editarTags.map((item, index) => {
              return(
                <TouchableOpacity key={index} onPress={() => {this.clicaTag(index,item)}} >
                  <Badge key={index} style={ item.selecionado ? styles.tag : styles.tagNaoSelecionada}><Text>{item.nome}</Text></Badge>
                </TouchableOpacity>
              )      
          })
        }

        </Body> 
      )
    } else {
      return (<Spinner />)
    }
    
  }

  fecharSugerirTag = () => {
    this.setState({modalSugerirTag: false});
  }

  renderSugerirTag = () => {
    return (
      <SugerirTag fecharSugerirTag={this.fecharSugerirTag.bind(this)} modalSugerirTag={this.state.modalSugerirTag} />
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        {this.renderSugerirTag()}

        <Content contentContainerStyle={{alignItems: 'center', marginTop: 20, justifyContent: 'flex-start', flex: 1, marginLeft: height * 0.043, marginRight: height * 0.043}}>
          <View style={{alignItems: 'stretch'}}>  

            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#F5A44D', fontSize: 18, marginBottom: 30, textAlign: 'center'}}>Selecione os assuntos que deseja trocar experiências</Text>
            </View>

         
                <Card>
                <ScrollView style={styles.tags}>

                      {this.renderTags()}               

                </ScrollView>
                <Footer style={{height: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>

                    <Text>
                      Não encontrou? 
                    </Text>
                    <TouchableOpacity onPress={() => { this.setState({modalSugerirTag: true})} }>
                      <Text style={{color: '#555555', fontWeight: 'bold'}}> Sugira aqui</Text>
                    </TouchableOpacity>
                </Footer>
                </Card>


          </View>
          
        </Content>
        {/*
        <Button block style={{marginLeft: height * 0.043, marginRight: height * 0.043 }} onPress={() => {this.salvarEContinuar()}}>
          <Text style={{color: 'white'}}>Começar!</Text>
        </Button>
        */}
        <Footer style={styles.footer}>
          <TouchableOpacity onPress={() => {this.proxima()}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', margin: 15}}>
              PULAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.proxima()}}><Icon name='arrow-forward' style={{margin: 15}} /></TouchableOpacity>
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
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    marginLeft: height * 0.021, 
    marginRight: height * 0.021
  },

  tag: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#51D9E7'
  },
  tagNaoSelecionada: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#C8C8C8'
    //backgroundColor: '#99D299'
    //opacity: 0.75
  },
  tags: {
    margin: 20

  },
});
