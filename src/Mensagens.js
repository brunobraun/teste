import React, { Component } from 'react';
import {
  Alert,
  Modal,
  TouchableOpacity,
  View,
  NetInfo
} from 'react-native';
import { Container, Spinner, StyleProvider, Content, List, ListItem, Thumbnail, Text, Body, Left, Right, Header, Button, Icon, Title, Segment, Badge } from 'native-base';


import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';

import ConexaoStatus from './ConexaoStatus';

import url from './URL';

import MeuId from './MeuId';

const me_mensagens = '';

export default class Mensagens extends Component {
  constructor(props) {
    super(props);


    this.state = {
      mensagens: [],
      carregando: true,

      notificacoes: [],
      totalNotificacoes: 0,
      modalNotificacoes: false
    };


    this.carregaDados = this.carregaDados.bind(this);
    this.getMensagens = this.getMensagens.bind(this);
    
    me_mensagens = this;

  }

  carregando = (carregando) => {
    this.setState({
      carregando: carregando
    });
  };


  static refresh() {
    if(me_mensagens != undefined && me_mensagens != '') {
      me_mensagens.carregaDados();
      Mensagens.carregaNotificacoes();
    }
  }

  componentDidMount() {
    
    setTimeout(() => {
      Mensagens.refresh();
    }, 800);
    
  }

  componentWillUnmount() {
    me = '';    
  }

  componentWillReceiveProps(props_recebidas) {

    if(props_recebidas.atualizar) {

        Mensagens.refresh();
    }
  }
  

  async getMensagens() {
    this.carregando(true);

    var url_final = url + '/mensagem/Conversas?idUsuario='+MeuId.getId();
    
    fetch(url_final)
    .then((response) => response.json())
    .then((responseJson) => {

      if(responseJson.sucesso) {
        this.setState({
          mensagens: responseJson.mensagens,
          carregando: false
        });
      } else {
        Alert.alert('Erro', responseJson.erro);
      }

    })
    .catch((error) => {
      console.warn(error);
      this.carregando(false);
    });
  }



  static carregaNotificacoes() {
    
    if(me_mensagens != undefined && me_mensagens != '') {
      fetch(url + '/notificacao/notificacoes?idUsuario=' + MeuId.getId())
      .then((response) => response.json())
      .then((responseJson) => {

        if(responseJson.sucesso) {
          me_mensagens.setState({
            notificacoes: responseJson.notificacoes,
            totalNotificacoes: responseJson.total
          });
        }

      })
      .catch((error) => {
        console.warn(error);
      });
    } else {
      console.warn('me mensagens nao está montado');
    }
    
  }

  async carregaDados() {
    this.getMensagens();
  }

  renderChat = (id, nome, foto, idChatConexao) => {
    Actions.Chat({id_usuario: id, nome_usuario: nome, foto: foto, idChatConexao: idChatConexao});
  }

  voltarMensagens = () => {
    this.setState({modalNotificacoes: false});
    this.getMensagens();

  }

/*
  aceitarAmizade = (id_amigo, idNotificacao, apelido) => {
    fetch(url + '/ChatConexoes/AceitarAmizade', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: this.meu_id,
        idUsuarioAmigo: id_amigo,
        idNotificacao: idNotificacao
      })
    }).then((response) => response.json())
        .then((responseJson) => {

          if(responseJson.sucesso){
            Alert.alert('Nova amizade', 'Você e ' + apelido + ' agora são amigos! Vá à aba AMIGOS e acesse seu perfil para conhecê-lo!')
            Mensagens.carregaNotificacoes();
          } else {
            Alert.alert('Erro', responseJson.erro);
          }

        })
        .catch((error) => {
          console.warn(error);
    });
  }
*/
  excluirNotificacao = (idNotificacao) => {
    fetch(url + '/Notificacao/Excluir', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idNotificacao: idNotificacao
      })
    }).then((response) => response.json())
        .then((responseJson) => {

          if(responseJson.sucesso){
            Mensagens.carregaNotificacoes();
          } else {
            Alert.alert('Erro', responseJson.erro);
          }

        })
        .catch((error) => {
          console.warn(error);
    });
  }

  renderAcoesNotificacao = (item) => {
    if(item.tipo == 0) {
      return (
        <Right>
          <TouchableOpacity onPress={ () => { this.excluirNotificacao(item.idNotificacao) } }>
            <Icon name='close' />
          </TouchableOpacity>
          <Button small success onPress={ () => { this.aceitarAmizade(item.idUsuarioEnviou, item.idNotificacao, item.apelido) } }>
            <Text>Aceitar</Text>
          </Button>
        </Right>
      )
    } else {
      return (
        <Right>
          <TouchableOpacity onPress={ () => { this.excluirNotificacao(item.idNotificacao) } }>
            <Icon name='close' />
          </TouchableOpacity>
        </Right>
      )
    }
  }



  renderMensagens = () => {
    if(!this.state.carregando) {
        if(this.state.mensagens.length > 0) {
          return(
           <Content>
            <List dataArray={this.state.mensagens}
                renderRow={(item) =>
                    <ListItem onPress={() => {this.renderChat(item.id, item.nome, item.foto, item.idChatConexao)}} avatar >
                    <Left>
                        <Thumbnail  source={{uri: item.foto == null ? url + '/imagens/perfil/nao_existe.png' : url + item.foto }} />
                    </Left>
                    <Body>
                        <Text>{item.nome}</Text>
                        <Text note>{item.ultima_msg}</Text>
                    </Body>                    
                    <Right>
                        <Text note style={{marginBottom: 5, marginTop: -5}}>{item.datahoraExtenso}</Text>
                        <IconBadge
                            MainElement={
                              <View >
                                <Icon name='notifications' transparent style={{color: 'rgba(0,0,0,0)'}} />
                              </View>
                            }
                            BadgeElement={
                              <Text style={{ color: item.totalMensagensNaoLidas == 0 ? 'rgba(0,0,0,0)' : '#FFFFFF'}}>{item.totalMensagensNaoLidas}</Text>
                            }
                            IconBadgeStyle={{backgroundColor: item.totalMensagensNaoLidas == 0 ? 'rgba(0,0,0,0)' : 'red'}}                            
                        />
                    </Right>
                  </ListItem>
                }>
            </List>
           </Content>
        
        )
      } else {
        return (
          <Content contentContainerStyle={{alignItems:'center', justifyContent: 'center', flexDirection: 'column', flex: 1}}>
             <Thumbnail large source={require('./images/logo_menu.png')} />
             <Text style={{marginTop: 20, fontSize: 12, color: '#555555'}}>{ConexaoStatus.getConexaoStatus() ? 'Você ainda não possui conexões.' : 'Você não está conectado na internet.'}</Text>
          </Content>
        )
      }
      
    } else {
      return (
        <Content contentContainerStyle={{alignItems:'center', justifyContent: 'center', flexDirection: 'column', flex: 1}}>
          <View>
             <Spinner color='#51D9E7' />
          </View>
        </Content>
      )
    }
  }


  render() {
    return (

      <Container style={{backgroundColor: '#FFFFFF'}}>
          <Header style={styles.header}>
            <Text>Conversas</Text>            
          </Header>
         

          
          {this.renderMensagens()}
              
          
      </Container>

    );
  }

}

const styles = {

  header: {
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },

};