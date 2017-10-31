import FCM from "react-native-fcm";


// nenhuma das 3
import { AsyncStorage } from 'react-native';
import MeuId from './MeuId';
import { SignalR } from './SignalR';

export default class Geral {
	static salvarToken(idUsuario) {
		FCM.requestPermissions();
        FCM.getFCMToken().then(token => {
          Geral.salvaToken(token,idUsuario);
        });
	}

	static salvaToken(token, idUsuario) {
	    fetch(url + '/Login/SalvaToken', {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({
	        idUsuario: idUsuario,
	        token: token
	      })
	    }).then((response) => response.json())
	        .then((responseJson) => {

	          if(responseJson.sucesso){
	          	//console.warn('token salva no servidor');
	          } else {
	            Alert.alert('Erro', responseJson.erro);
	          }

	        })
	        .catch((error) => {
	          console.warn('erro ao salvar token:' + error);
	    	});
  	}

}