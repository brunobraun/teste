import React, { Component } from 'react';
import {  
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import { Container, Button} from 'native-base';
import { Actions } from 'react-native-router-flux';

import MeuId from './MeuId';

import url from './URL';

import { SignalR } from './SignalR';


export default class Login extends Component {
  constructor(props) {
    super(props);
  }


  trocarPerfil = () => {
  	fetch(url + '/login/limpaToken', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: MeuId.getId()
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        AsyncStorage.clear();
        SignalR.desconectar();
        Actions.Login();

      })
      .catch((error) => {
         Alert.alert('Erro de internet', responseJson.erro);

    });
  }

  render() {
	return (
		<Container>
			<Button onPress={() => {this.trocarPerfil()}}>
				<Text>
					Deslogar
				</Text>

			</Button>
		</Container>
	);
  }
}