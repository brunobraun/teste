import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Modal,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Container, Header, Left, Right, Icon, Body, Button, Thumbnail, ActionSheet, Root, Spinner } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import Overlay from './Overlay';

import Stars from 'react-native-stars';

import url from './URL';

import MeuId from './MeuId';

import ConexaoStatus from './ConexaoStatus';

import { SignalR } from './SignalR';

import {MenuAtualizacoes} from './Menu';

var me = '';


export default class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      messages: [],
      nomes: [],
      envia_id: props.id_usuario,
      carregando: false,
      modalDenuncia: false,
      denuncia: '',
      avaliacao: ''
    };

    this.BUTTONS = [
      'Encerrar Conversa',
      'Denunciar',
      'Cancelar',
    ];

    this.CANCEL_INDEX = 2;

    this.onSend = this.onSend.bind(this);
    this.msgEnviada = this.msgEnviada.bind(this);
    this.adicionaMsgRecebida = this.adicionaMsgRecebida.bind(this);
    this.adicionaMsgEnviada = this.adicionaMsgEnviada.bind(this);

    this.getMensagens = this.getMensagens.bind(this);
 
    this.desfazercombinacao = this.desfazercombinacao.bind(this);
    this.denunciar = this.denunciar.bind(this);

    /* Avaliação */
    this.avaliar = this.avaliar.bind(this);
    this.avaliacao = this.avaliacao.bind(this);
    /* Avaliação */

    this.funcoesMenu = this.funcoesMenu.bind(this);

    this.proxy_signalr = '';

    me = this;
  };




  static enviaMensagem(id_enviou, id_recebeu, mensagem, data, idChat) {

      if(me != null && me != undefined && me != '') {
        if(id_enviou == me.state.envia_id) {
          me.adicionaMsgRecebida(id_enviou, mensagem, data, idChat);
        } else if(id_recebeu == me.state.envia_id) {
          me.adicionaMsgEnviada(me.meu_id, mensagem, data, idChat);
        }
      }     
    
  }

  static retornaEnviou() {
    if(me != '' && me != undefined) return me.props.id_usuario;
    else return null;
  }

  msgEnviada(messages) {
  	this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  onSend(messages = []) {
    //Chat.enviaMensagem(this.meu_id, this.state.envia_id,messages[messages.length-1].text, null );
    
    if(!ConexaoStatus.getConexaoSignalR()) {
      ConexaoStatus.refreshGiftedChat();
      ToastAndroid.showWithGravity('Não foi possível enviar mensagem. Está desconectado.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      //alert('nao foi possível enviar mensagem: está desconectado');
      SignalR.conectarSignalR();
    } else {
      SignalR.enviarMensagem(this.meu_id, this.state.envia_id, messages[messages.length-1].text, this.props.idChatConexao);

    }    

    // Se enviou msg por pessoas ou histórias, cria conexao entre os dois ids
    /*if ((this.props.tipoConexao == 1) || (this.props.tipoConexao == 2)) {
      this.conectaPessoas();
    }*/
  }

  adicionaMsgRecebida(id_enviou, text, data, idChat) {
  	if(id_enviou != this.meu_id) {
      var d = new Date();
      if(data != null) {
        var milli = data.replace(/\/Date\((-?\d+)\)\//, '$1');
        d  = new Date(parseInt(milli));
      }

  	this.setState((previousState) => {
  	  return {
  	    messages: GiftedChat.append(previousState.messages, {
  	      _id: idChat,
  	      text: text,
  	      createdAt: d,
  	      user: {
  	        _id: id_enviou,
  	        name: 'EE EE'
  	      },
  	    }),
  	  };
  	});
  	}
  }

  adicionaMsgEnviada(id_enviou, text, data, idChat) {
  
    var d = new Date();
    if(data != null) {
      var milli = data.replace(/\/Date\((-?\d+)\)\//, '$1');
      d  = new Date(parseInt(milli));
    }


  	this.setState((previousState) => {


	  return {
	    messages: GiftedChat.append(previousState.messages, {
	      _id: idChat,
	      text: text,
	      createdAt: d,
	      user: {
	        _id: id_enviou
	      },
  	    }),
  	  };
  	 });
  }


  componentWillMount() {
    
    this.meu_id = parseInt(MeuId.getId());
    this.avaliacao();
    this.setState(() => {
      return {
        messages: [],
      };
    });

    if(!ConexaoStatus.getConexaoSignalR()) {
      ConexaoStatus.refreshGiftedChat();
      SignalR.conectarSignalR();
    }
  }

  conectaPessoas() {
    fetch(url + '/ChatConexoes/ConectaPessoas', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: this.meu_id,
        outroId: this.state.envia_id,
        tipoCon: this.props.tipoConexao
      })
    }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.sucesso) { }
        }).catch((error) => { console.warn(error);
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getMensagens(this.props.id_usuario);
    }, 800);
  }


  componentWillUnmount() {
    me = '';    
  }

  static recarregaMensagens() {
    me.getMensagens();
  }

  async getMensagens() {
     id = this.props.id_usuario;

  	 this.setState({
      envia_id: id,
      carregando: true
     });

  	 fetch(url + '/chat/historico?meu_id='+this.meu_id+'&id=' + id+'&idChatConexao='+this.props.idChatConexao)
  	  .then((response) => response.json())
  	  .then((responseJson) => {


  	    if(responseJson.sucesso) {
          

  	    	var messages = [];
          this.setState({
            messages: []
          })
  	      var historico = responseJson.historico;
  	      for(var i =0; i<historico.length; i++) {

  	      	if(historico[i].id_enviou == this.meu_id) {
  	      		this.adicionaMsgEnviada(historico[i].id_enviou, historico[i].mensagem, historico[i].datahora, historico[i].idChat);
  	      	} else {
  	      		this.adicionaMsgRecebida(historico[i].id_enviou, historico[i].mensagem, historico[i].datahora, historico[i].idChat);
  	      	}
  	      }
          this.setState({
            carregando: false

          });
  	    }

        
  	  })
  	  .catch((error) => {
  	    console.warn(error);
  	  });
  }

  funcoesMenu(indexMenu) {

    /*
      'Desfazer Combinação',
      'Denunciar',
      'Cancelar',
    */

    var idMenu = parseInt(indexMenu);


    switch(idMenu) {

        case 0:
            this.alertDesfazerCombinacao();
            break;
        case 1:
            this.setState({modalDenuncia: true});
            break;
    }
  }

  alertDesfazerCombinacao = () => {
    Alert.alert(
      'Encerrar conversa',
      'Caso encerre a conversa com essa pessoa, ela não estará mais listada na lista de conversas. Tem certeza que deseja encerrar?',
      [
        {text: 'CANCELAR', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'SIM', onPress: () => {this.desfazercombinacao()}},
      ],
      { cancelable: false }
    )
  }

  desfazercombinacao() {
    fetch(url + '/ChatConexao/Desfazer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: MeuId.getId(),
        idUsuarioExcluido: this.state.envia_id
      })
    }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.sucesso) {
            Alert.alert('Encerrar conversa','Você encerrou a conversa e desfez a combinação com essa pessoa.');           
            this.voltar();
          } else {
            Alert.alert('Erro', responseJson.erro);
          }
        })
        .catch((error) => {
          console.warn(error);
    });
  }

  avaliacao() {
    fetch(url + '/usuarioavaliacao/avaliacao', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuarioAvaliou: this.meu_id,
      idUsuarioAvaliado: this.state.envia_id
    })
  }).then((response) => response.json())
      .then((responseJson) => {

        if(responseJson.sucesso){
          var avaliacao = responseJson.avaliacao;
          
          this.setState({
            avaliacao: avaliacao
          });
          //this.setState({modalAvaliacao: true}); 
        } else {
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        console.warn(error);
    });
  }

  avaliar(avaliacao) {
    this.setState({avaliacao: avaliacao});

    fetch(url + '/usuarioavaliacao/avaliar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idUsuarioAvaliado: this.state.envia_id,
      avaliacao: avaliacao
    })
  }).then((response) => response.json())
      .then((responseJson) => {

        if(responseJson.sucesso){
          this.setState({modalAvaliacao: false});
        
        } else {
          Alert.alert('Erro.', 'Não foi possível enviar avaliação.');
        }

      })
      .catch((error) => {
        console.warn(error);
    });
  }

  denunciar() {
    fetch(url + '/denuncia/denunciar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idUsuarioDenunciado: this.state.envia_id,
      denuncia: this.state.denuncia
    })
  }).then((response) => response.json())
      .then((responseJson) => {

        if(responseJson.sucesso){
          this.setState({modalDenuncia: false, denuncia: ''});
          Alert.alert(' ', 'Denuncia enviada com sucesso!');          
        } else {
          Alert.alert(' ', responseJson.erro);
        }

      })
      .catch((error) => {
        console.warn(error);
    });
  }

  voltar() {
    //const props = { atualizar: true };
    MenuAtualizacoes.atualizaNotificacoes(MeuId.getId());
    Actions.replace('Mensagens', { atualizar: true });

    //setTimeout(()=> Actions.refresh(), 500);
  }

  renderModalDenuncia() {
    if(this.state.modalDenuncia) {
      return(

        <Overlay visible={this.state.modalDenuncia}
            closeOnTouchOutside animationType="fade"
            containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
            childrenWrapperStyle={{backgroundColor: '#eee'}} >
            <View>
              <TextInput
                style={{width: 250, height: 100, borderColor: 'gray', borderWidth: 1}}
                multiline={true}
                onChangeText={(text) => this.setState({denuncia: text})}
                value={this.state.denuncia}
                editable = {true}
              />
            </View>
            
            <View style={styles.enviar}>
              <TouchableOpacity onPress={() => {this.denunciar()}}>
                <Text>Enviar</Text>
              </TouchableOpacity>
            </View>
        </Overlay>

      )
    }
    else {
      return null;
    }
  }

  renderPessoa = () => {
    // TODO render perfil completo
    Actions.PerfilUsuario({id: this.props.id_usuario});
  }

  renderGiftedChat = () => {
    if(this.state.carregando) {
      return (<Spinner color='#51D9E7' />);
    } else {
      return (
          <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}

          user={{
            _id: this.meu_id,
          }}
        />
      );
    }    
  }

  renderAvaliacao = () => {
    if(this.state.avaliacao === '') {
      return null;
    } else {
      return(
        <Stars
            half={false}
            rating={this.state.avaliacao}
            update={(val)=>{this.avaliar(val)}}
            spacing={4}
            starSize={20}
            count={5}
            fullStar={require('./images/starFilled.png')}
            emptyStar={require('./images/starEmpty.png')}
            halfStar={require('./images/starHalf.png')}/>
      )
    }
  }

  render() {
    return (

      <Container style={styles.container}>

        {this.renderModalDenuncia()}


        <Header style={styles.header}>
            <View>
              <TouchableOpacity transparent onPress={() => {this.voltar()}}>
                  <Icon name='arrow-back' style={{color: 'black', margin: 15}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}} onPress={() => {this.renderPessoa()}}>
                  <Thumbnail source={{uri: this.props.foto == null ? url + '/imagens/perfil/nao_existe.png' : this.props.foto}} />
                  <Text style={{fontWeight: 'bold'}}>{this.props.nome_usuario}</Text>
                </TouchableOpacity>
            </View>
            
            <View>
                <Button transparent onPress={() => ActionSheet.show(
                  {
                    options: this.BUTTONS,
                    cancelButtonIndex: this.CANCEL_INDEX,
                    title: "Selecione uma opção..."
                  },
                  buttonIndex => {
                    this.funcoesMenu(buttonIndex);
                  }
                )}>
                    <Icon name='menu' style={{color: 'black'}} />
                </Button>
            </View>

        </Header>
        <Header style={styles.header_avaliacao}>
          <Text style={{fontSize: 12}}>Como você avalia esta conversa? </Text>
          {this.renderAvaliacao()}
        </Header>
        {this.renderGiftedChat()}

      </Container>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header_avaliacao: {
    backgroundColor: '#FFFFFF',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#FFFFFF',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avaliacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5
  },
  body: {
    alignItems: 'center'
  },
  enviar: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingTop: 20
  }
};