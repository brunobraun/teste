import React, { Component } from 'react';
import { AppRegistry, AppState, NetInfo, AsyncStorage, BackHandler, Platform } from 'react-native';
import { Container, Toast, Root } from 'native-base';
import { Actions, Router, Scene, Reducer } from 'react-native-router-flux';


import { SignalR } from './SignalR';


/* Estados (TODO REDUX) */
import Cena from './Cena';
import MeuId from './MeuId';
import ConexaoStatus from './ConexaoStatus';
/* FIM Estados */

import Menu, {MenuAtualizacoes} from './Menu';

import Splash from './Splash';

import Introducao from './Introducao';
import IntroducaoNome from './IntroducaoNome';
import IntroducaoAssuntos from './IntroducaoAssuntos';
import IntroducaoBiografia from './IntroducaoBiografia';
import IntroducaoFinal from './IntroducaoFinal';

/* Login */
import Login from './Login';
import EsqueceuSenha from './EsqueceuSenha';
import RedefineSenha from './RedefineSenha';
import Cadastro from './Cadastro';
/* FIM Login */

/* Conversas */
import Mensagens from './Mensagens';
import Chat from './Chat';
/* FIM Conversas */

/* Feed */
import Feed, { Publicacao } from './Feed';
/* FIM Feed */

import Perfil from './Perfil';

import Pessoas from './Pessoas';
import PerfilUsuario from './PerfilUsuario';
import PerfilUsuarioEditar from './PerfilUsuarioEditar';

import Historias from './Historias';
import Historia from './Historia';
import NovaHistoria from './NovaHistoria';

import PrimeiroAcessoIntroducao from './PrimeiroAcessoIntroducao';

/*
import EsqueceuSenha from './EsqueceuSenha';
import RedefineSenha from './RedefineSenha';

import Intro from './Intro';

import Feed, { Publicacao } from './Feed';
import Eyhee from './Eyhee';
import Historias, { NovaHistoria } from './Historias';
import Mensagens from './Mensagens';
import Chat from './Chat';
import Perfil from './Perfil';
import EditarPerfil from './EditarPerfil';
import Configuracoes from './Configuracoes';
import AlterarSenha from './AlterarSenha';

import Orientacao, {
       OrientacaoFase1, QuestoesFase1,
       OrientacaoFase2, QuestoesFase2,
       OrientacaoFase3, QuestoesFase3,
       OrientacaoFinal } from './Orientacao';
import Pessoa from './Pessoa';
*/

const me_home = '';
const cena = '';

export default class ReactEyhee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      escondeMenu: false
    };

    me_home = this;
    
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
  }

  onBackPress () {
    if (Actions.state.index === 0) {
      return false;
    }


    Actions.pop();
    if(Actions.currentScene === 'Mensagens') {
      MenuAtualizacoes.atualizaNotificacoes(MeuId.getId());
      Mensagens.refresh();
    }

    
    return true;
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);


  }


   handleFirstConnectivityChange(isConnected) {

    ConexaoStatus.setConexaoStatus(isConnected);
    /*
    if(cena == "Chat" && isConnected) {
      Chat.recarregaMensagens();
    }
    */
    if(MeuId.getId() != 0 && isConnected) {
      
      setTimeout(() => {SignalR.conectarSignalR()}, 1000);

      if(Cena.getCena() === 'Chat') {
        Chat.recarregaMensagens();
      } else if(Cena.getCena() === 'Mensagens') {
        Mensagens.refresh();
      }
    } else if(!isConnected) {
      
    }
    //console.warn(isConnected ? 'online' : 'offline');
    
  }

  escondeMenu = (esconde)  => {
    me_home.setState({escondeMenu: esconde})
  }

  componentWillMount() {
    //AsyncStorage.clear();

    // TODO tirar daqui? colocar no splash para quem está logado

    //SignalR.conectarSignalR();


    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    AppState.addEventListener('change', this._handleAppStateChange);    

  }


  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleFirstConnectivityChange);
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  _handleAppStateChange = (nextAppState) => {

     if(nextAppState === 'active') {
      if(MeuId.getId() != 0) {
        setTimeout(() => {SignalR.conectarSignalR()}, 1000);
      }
      
      if(Cena.getCena() === 'Chat') {
        Chat.recarregaMensagens();
      } else if(Cena.getCena() === 'Mensagens') {
        Mensagens.refresh();
      }

    } else if(nextAppState === 'background') {

      SignalR.desconectar();

    }
  }


  /*
      selecionado =
      0 - Feed
      1 - Mensagens
      2 - Eyhee
      3 - Histórias
      4 - Perfil
  */

  
  entrouCena = () => {

    var cena = Actions.currentScene;
    
    //console.warn('entrou cena: ' + cena);
    var idMenu = -1;
    switch(cena) {
          case 'Feed':
              idMenu = 0;
              break;
          case 'Mensagens':
              idMenu = 1;
              break;
          case 'Pessoas':
              idMenu = 2;
              break;
          case 'Historias':
              idMenu = 3;
              break;
          case 'PerfilUsuario':
              idMenu = 4;
              break;
     
      }
    Menu.atualizaSelecionado(idMenu);
    Cena.setCena(cena);
  }


  render() {
    return (
      <Root>
      <Container>
        <Router>
            <Scene key="home">

              <Scene 
                key="Splash"
                component={Splash}
                title="Splash"
                hideNavBar={true}
                initial={true}
                onEnter={() => {this.entrouCena()}}
              />              

              <Scene 
                key="Mensagens"
                component={Mensagens}
                title="Mensagens"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Chat"
                component={Chat}
                title="Chat"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Perfil"
                component={Perfil}
                title="Perfil"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Introducao"
                component={Introducao}
                title="Introducao"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="IntroducaoBiografia"
                component={IntroducaoBiografia}
                title="IntroducaoBiografia"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="IntroducaoNome"
                component={IntroducaoNome}
                title="IntroducaoNome"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="IntroducaoAssuntos"
                component={IntroducaoAssuntos}
                title="IntroducaoAssuntos"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="IntroducaoFinal"
                component={IntroducaoFinal}
                title="IntroducaoFinal"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="PrimeiroAcessoIntroducao"
                component={PrimeiroAcessoIntroducao}
                title="PrimeiroAcessoIntroducao"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Login"
                component={Login}
                title="Login"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="EsqueceuSenha"
                component={EsqueceuSenha}
                title="EsqueceuSenha"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="RedefineSenha"
                component={RedefineSenha}
                title="RedefineSenha"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Cadastro"
                component={Cadastro}
                title="Cadastro"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Feed"
                component={Feed}
                title="Feed"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Publicacao"
                component={Publicacao}
                title="Publicacao"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="Pessoas"
                component={Pessoas}
                title="Pessoas"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene 
                key="PerfilUsuario"
                component={PerfilUsuario}
                title="PerfilUsuario"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene
                key="PerfilUsuarioEditar"
                component={PerfilUsuarioEditar}
                title="PerfilUsuarioEditar"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene
                key="Historias"
                component={Historias}
                title="Historias"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene
                key="Historia"
                component={Historia}
                title="Historia"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
              <Scene
                key="NovaHistoria"
                component={NovaHistoria}
                title="NovaHistoria"
                hideNavBar={true}
                onEnter={() => {this.entrouCena()}}
              />
            </Scene>

            
        </Router>

        <Menu />
        
      </Container>
      </Root>
    );
  }
}

AppRegistry.registerComponent('ReactEyhee', () => ReactEyhee);