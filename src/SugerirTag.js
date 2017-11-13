import React, { Component } from 'react';
import {  Modal, Alert, BackHandler, View, TouchableHighlight, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Button, StyleProvider, Container, Form, Input, Label, Item, Text, Segment, Header, Icon, Thumbnail, Badge, Card, CardItem, Content, Body, Separator, Spinner } from 'native-base';

import Overlay from './Overlay';

import url from './URL';

import MeuId from './MeuId';

export default class SugerirTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalSugerirTag: props.modalSugerirTag,
      tagSugerida: 'Digite seu assunto...',
    }
  }

   postSugerirTag = () => {
    console.warn(MeuId.getId());
    console.warn(this.state.tagSugerida);

    fetch(url + '/TagSugestao/criar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: MeuId.getId(),
      tag: this.state.tagSugerida
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.sucesso){
          this.props.fecharSugerirTag();
          Alert.alert('Sucesso!','Enviado com sucesso. Agradecemos por você ajudar a melhorar nosso app!');
        } else {
          this.props.fecharSugerirTag();
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        this.props.fecharSugerirTag();
        console.warn(error);
    });
  }

  render() {
    return (
      <Overlay visible={this.props.modalSugerirTag}
          closeOnTouchOutside animationType="fade"
          containerStyle={{backgroundColor: 'rgba(117,117,117,0.70)'}}
          onClose={() => {this.props.fecharSugerirTag()}}
          childrenWrapperStyle={{backgroundColor: 'white'}} >

            <Item rounded style={{backgroundColor: '#8FC73E', opacity: 0.7}} >
              <Input autoFocus={true} placeholder='Sugira um assunto...' onChangeText={(text) => this.setState({tagSugerida: text})}/>
            </Item>
            <View style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
              <Button  small onPress={() => { this.postSugerirTag() } }>
                <Text>
                  Enviar
                </Text>
              </Button>
            </View>
      </Overlay>
    )
  }
}