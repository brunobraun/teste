import { Router, Scene, Reducer, Actions } from 'react-native-router-flux';

import signalr from 'react-native-signalr';
import url from './URL';
import MeuId from './MeuId';
import Chat from './Chat';
import Mensagens from './Mensagens';

import Cena from './Cena';

import ConexaoStatus from './ConexaoStatus';

import {MenuAtualizacoes} from './Menu';

const proxy_signalr = '';
const conexao = '';
const deslogou = false;


export class SignalR {
  static MensagemLida(idChat) {
    proxy_signalr.invoke('receive', idChat.toString()).done((directResponse) => {
      //console.warn('aeaeae!');

    }).fail(() => {
      console.warn('Erro de conexão com signalR ao receber mensagem.')
    });
  }

  static conectarSignalR() {
    const connection = signalr.hubConnection(url);
    connection.logging = true;
 
    conexao = connection;

    const proxy = connection.createHubProxy('chatHub');



    proxy.on('msgRecebida', (id_enviou, id_recebeu, mensagem, data, nome_enviou, idChat) => {
      // TODO nao precisa verificar meu_id diferente. Resolver no c#
/*
      if( cena == 'Chat' && id_enviou != MeuId.getId()) {
        Chat.enviaMensagem(id_enviou, id_recebeu, mensagem, data, idChat);
        SignalR.MensagemRecebida(idChat);
      } else {
        Chat.enviaMensagem(id_enviou, id_recebeu, mensagem, data, idChat);
      }
*/      

      if( Cena.getCena() === "Chat"  ) {
        Chat.enviaMensagem(id_enviou, id_recebeu, mensagem, data, idChat);
        if(Chat.retornaEnviou() == id_enviou) SignalR.MensagemLida(idChat);
      } 
      else if( Cena.getCena() === "Mensagens" ) { Mensagens.refresh(); MenuAtualizacoes.atualizaNotificacoes(MeuId.getId()); } 
      else MenuAtualizacoes.atualizaNotificacoes(MeuId.getId());
      //else if(cena != 'Chat') ToastAndroid.showWithGravity(nome_enviou + ': ' + mensagem, ToastAndroid.SHORT, ToastAndroid.TOP);
      //console.warn('msg recebido');
      
      //ChatSignalR.recebido('509');
    });

    proxy.on('notificacao', (mensagem) => {
      //if( cena == 'Chat') Alert.alert('Notificação', mensagem);
      //else Alert.alert('Notificação', mensagem);
      //Mensagens.carregaNotificacoes();
      //Alert.alert('Notificação', mensagem);
      
    });

    proxy_signalr = proxy;


    // atempt connection, and handle errors 
    connection.start().done(() => {
      //console.warn('Now connected, connection ID=' + connection.id);

      // TODO mudar id
      proxy.invoke('connect', MeuId.getId())
        .done((directResponse) => {

          //console.warn('Conectado signalr!');
          ConexaoStatus.setConexaoSignalR(true);

          //Eyhee.verificaConexaoAberta();
          //Menu.atualizaNotificacoes(this.meu_id);
        }).fail(() => {
          console.warn('Something went wrong when calling server, it might not be up and running?');
          ConexaoStatus.setConexaoSignalR(false);
      });

    }).fail(() => {
      console.warn('Failed');
      ConexaoStatus.setConexaoSignalR(false);
    });
 
    //connection-handling 
    connection.connectionSlow(() => {
      console.warn('A conexão está mais lenta que o normal.')
    });  
  
    connection.disconnected(() => {
      //if(!deslogou) setTimeout(() => {this.conectarSignalR()}, 1000);
      console.warn('desconectou signalr');
       
    });

    connection.error((error) => {
      //connection.stop();
      const errorMessage = error.message;
      let detailedError = '';
      if (error.source && error.source._response) {
        detailedError = error.source._response;
      }
      if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
        console.warn('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
      }
      console.warn('SignalR error: ' + errorMessage);
      ConexaoStatus.setConexaoSignalR(false);
      //console.warn('reconectando');
      // Caso erro, espera 2 segundos e tentar reconectar novamente

      //setTimeout(() => {this.conectarSignalR()}, 2000);
      
    });
  }

  static enviarMensagem(meu_id, id_enviado, mensagem, idChatConexao) {
    proxy_signalr.invoke('send', meu_id, id_enviado, mensagem, idChatConexao)
      .done((directResponse) => {
        
        /*
        if(directResponse == 0) 
          Toast.show({
            text: 'A mensagem: ' + mensagem + ' não pode ser enviada.',
            position: 'bottom',
            buttonText: 'Ok',
            type: 'danger'
          });
        */

        /* NAO ESTOU UTILIZANDO ISSO
          this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, messages),
          };
         });
          FIM NAO ESTOU UTILIZANDO */
                 
      }).fail(() => {
        console.warn('Não foi possível enviar mensagem.')
      });
  }


  static desconectar() {
    if(conexao != '')
    conexao.stop();
  }

/*
  static deslogar() {
      deslogou = true;
      conexao.stop();
      BackHandler.exitApp();
    }
*/
}