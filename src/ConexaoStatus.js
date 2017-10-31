const estaConectado = false;
const conectadoSignalR = false;

import {InputToolbar, Composer} from 'react-native-gifted-chat';

export default class ConexaoStatus {
  	static refreshGiftedChat() {
  	  var status = false;
  	  if(estaConectado && conectadoSignalR) status = true;

  	  InputToolbar.alteraStatusConexao(status);
      Composer.alteraStatusConexao(status); 
  	}

    static setConexaoStatus(status) {
      estaConectado = status;
      ConexaoStatus.refreshGiftedChat();
    }

    static getConexaoStatus() {
      return estaConectado;
    }

    static setConexaoSignalR(status) {
    	conectadoSignalR = status;
    }

    static getConexaoSignalR() {
    	return conectadoSignalR;
    }
}