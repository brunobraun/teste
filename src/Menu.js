import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { FooterTab, Button, Icon, Text, Badge, StyleProvider, Thumbnail, Footer } from 'native-base';
import { Actions } from 'react-native-router-flux';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import MeuId from './MeuId';

var me_menu = '';

var imgMenuUsuario = require('./images/logo_menu.png');

var {height, width} = Dimensions.get('window');

/*
    Quando é chamada:
    1) Login
    2) Splash
    3) Voltar do chat
    4) Receber uma mensagem
*/
export class MenuAtualizacoes {
    static atualizaNotificacoes(meuId) {
        if(me_menu != '' && me_menu != undefined) {
            setTimeout(() => {
            fetch(url + '/Mensagem/TotalMensagensNaoLidasUsuario?idUsuario=' + meuId)
              .then((response) => response.json())
              .then((responseJson) => {

                if(responseJson.sucesso) {
                  me_menu.setState({
                    numeroNotificacoes: responseJson.total
                  });
                }

              })
              .catch((error) => {
                console.warn(error);
              });

        }, 500);
        }
    }
}

export default class Menu extends Component {
    constructor(props) {
        super(props);

        /*
            selecionado =
            0 - Feed
            1 - Mensagens
            2 - Eyhee
            3 - Histórias
            4 - Perfil
        */

        this.state = {
            selecionado: 1,
            numeroNotificacoes: 0,
            visivel: false
        }


        this.renderTela = this.renderTela.bind(this);

        me_menu = this;
    }


    clicouMensagens = () => {
        this.setState({numeroNotificacoes: 0});
    }

     


    static atualizaSelecionado(idCena) {
        if(idCena == -1) me_menu.setState({visivel: false});
        else me_menu.setState({selecionado: idCena, visivel: true});

    }

    renderTela(idMenu) {
        this.setState({selecionado: idMenu});

        switch(idMenu) {
            case 0:
                Actions.Feed();
                break;
            case 1:
                Actions.Mensagens();
                break;
            case 2:
                Actions.Pessoas();
                break;
            case 3:
                Actions.Historias();
                break;
            case 4:
                Actions.PerfilUsuario();
                break;
        }
    }

    renderIcone = () => {
        return(
            <Thumbnail style={{zIndex: 999, position: 'absolute'}} source={imgMenuUsuario}  />
        )
    }

    renderButtonMensagens = () => {
        if(this.state.numeroNotificacoes != 0) {
            return(
                <Button badge onPress={() => this.renderTela(1)} style={{}}>
                    <Badge><Text>{this.state.numeroNotificacoes}</Text></Badge>
                    <Icon style={{color: this.state.selecionado == 1 ? styles.corTextoSelecionado : styles.corIcone}} name="chatboxes" />
                    <Text style={{fontSize: 8, color: this.state.selecionado == 1 ? styles.corTextoSelecionado : styles.corTexto}} >Conversas</Text>
                </Button>               
            )
        } else {
            return (
                <Button onPress={() => this.renderTela(1)}>
                    <Icon style={{color: this.state.selecionado == 1 ? styles.corTextoSelecionado : styles.corIcone}} name="chatboxes" />
                    <Text style={{fontSize: 8, color: this.state.selecionado == 1 ? styles.corTextoSelecionado : styles.corTexto}} >Conversas</Text>
                </Button> 
            )
        }        
    }

    render() {
        return (
            <Footer style={{height: this.state.visivel ? 55 : 0, backgroundColor: 'white'}}>            
            <StyleProvider style={getTheme(material)}>
                <FooterTab style={{borderTopWidth:0.4, borderTopColor:'#555555'}}>
                    <Button onPress={() => this.renderTela(0)}>
                        <Icon style={{color: this.state.selecionado == 0 ? styles.corTextoSelecionado : styles.corIcone}} name="paper" />
                        <Text style={{fontSize: 8, color: this.state.selecionado == 0 ? styles.corTextoSelecionado : styles.corTexto}}>Feed</Text>
                    </Button>

                    {this.renderButtonMensagens()}
                    
                    <Button style={{zIndex: 99, alignItems: 'center'}}  onPress={() => this.renderTela(2)}>
                        {this.renderIcone()}
                        
                    </Button>
                    <Button onPress={() => this.renderTela(3)}>
                        <Icon style={{color: this.state.selecionado == 3 ? styles.corTextoSelecionado : styles.corIcone}}  name="book" />
                        <Text style={{fontSize: 8, color: this.state.selecionado == 3 ? styles.corTextoSelecionado : styles.corTexto}}>Histórias</Text>
                    </Button>
                    <Button onPress={() => this.renderTela(4)}>
                        <Icon style={{color: this.state.selecionado == 4 ? styles.corTextoSelecionado : styles.corIcone}} name="person" />
                        <Text style={{fontSize: 8, color: this.state.selecionado == 4 ? styles.corTextoSelecionado : styles.corTexto}}>Perfil</Text>
                    </Button>
                </FooterTab>
            </StyleProvider>
            </Footer>
        );
    }
}

const styles = {
    txtMenu: {
        fontSize: 8,
    },
    corTextoSelecionado: '#4DD3E3',
    corIcone: '#555555',
    corTexto: '#555555'
}