import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, ScrollView, Dimensions,
         Alert, TextInput, TouchableHighlight, KeyboardAvoidingView, Text } from 'react-native';
import { Container, Icon, View, Footer, Label,
         DeckSwiper, Card, CardItem, Thumbnail, 
         Body, Button, StyleProvider, Content,
         Segment, Fab, Left, Header, Badge, Spinner, Right, FooterTab } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { Actions } from 'react-native-router-flux';
import Overlay from './Overlay';

import url from './URL';
import MeuId from './MeuId';

const janela = Dimensions.get('window');

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');

export default class Historias extends Component {
    constructor(props) {
        super(props);

        this.state = {
            historias: [],
            historiaAtual: [],
            tags: [],
        }

        this.esquerda = this.esquerda.bind(this);
        this.direita = this.direita.bind(this);
    }

    // NATIVE

    componentWillMount() {
        this.meu_id = parseInt(MeuId.getId());
        this.historias();

        //moment.locale('pt-BR');
    }

    componentWillReceiveProps(props_recebidas) {
        if (props_recebidas.atualizar)
            this.historias();
    }

    // FUNÇÕES

    historias() {
        fetch(url + '/historia/historias?idUsuario='+this.meu_id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({historias: responseJson.historias});
        }}).catch((error) => {console.warn('historias: ' + error);});
    }

    historia(id) {
        Actions.Historia({id: id});
    }

    perfil(id) {
        Actions.PerfilUsuario({id: id});
    }

    conversar(item) {
        fetch(url + '/chatconexao/checaconexao?idUsuario1='+this.meu_id+'&idUsuario2='+item.idUsuario)
        .then((response) => response.json())
        .then((responseJson) => {
            if (!responseJson.sucesso)
                this.criaConexao(item);
            else
                Actions.Chat({
                    id_usuario: item.idUsuario,
                    nome_usuario: item.nome,
                    foto: item.foto,
                    idChatConexao: responseJson.idConexao});
        }).catch((error) => {console.warn('checaConexao: ' + error);});
    }

    criaConexao = (item) => {
        fetch(url + '/ChatConexao/CriaConexao', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario1: this.meu_id,
                idUsuario2: item.idUsuario,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    Actions.Chat({id_usuario: item.idUsuario, nome_usuario: item.nome, foto: item.foto, idChatConexao: responseJson.idConexao});
                } else
                    Alert.alert('Não foi possível abrir a conversa. Por favor, entre em contato com nossos administradores.', responseJson.erro);
            }).catch((error) => { console.warn('criaConexao: ' + error); });
    }

    esquerda(item) {
        console.warn('esquerda: ' + item.titulo);
    }

    direita() {
        console.warn('direita');
    }

    // RENDER

    render() {
        return (
            <Container style={styles.tela}>
                {this.renderHistorias()}
            </Container>
        );
    }

    renderHistorias() {
        if (this.state.historias.length > 0) {
            return (
                <DeckSwiper
                    //onSwipeLeft={this.esquerda}
                    //onSwipeRight={this.direita}
                    dataSource={this.state.historias}
                    renderItem={item =>
                    <Card style={{elevation:3}}>
                        <CardItem>
                            <Left style={{flexDirection:'column',marginBottom:-10}}>
                                <Text style={styles.titulo}>{item.titulo}</Text>
                                <Text note style={styles.data}>{moment(item.datahora).format('LL')}</Text>
                            </Left>
                        </CardItem>
                        <View style={styles.scroll}>
                            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                <CardItem>
                                    <Text style={styles.texto}>{item.historia}</Text>
                                </CardItem>
                            </ScrollView>
                            <CardItem>
                                <Body style={styles.botoes}>
                                    {this.renderAcoes(item)}
                                </Body>
                            </CardItem>
                        </View>
                    </Card>}
                />
            );
        } else { return ( <Spinner animating={true} color={'#4FD3E2'} /> ) }
    }

    renderAcoes(item) {
        return (
            <View style={styles.botoes}>
                <Left>
                    <Button style={{backgroundColor:'#4FD3E2',borderRadius:5,}} small iconLeft onPress={() => this.perfil(item.idUsuario)}>
                        <Icon name="person" style={{fontSize:20}} />
                        <Text style={{color:'#fff',fontWeight:'bold',padding:10}}>Conhecer</Text>
                    </Button>
                </Left>
                <Right>                
                    <Button style={{backgroundColor:'#4FD3E2',borderRadius:5}} small iconRight onPress={() => this.conversar(item)}>
                        <Text style={{color:'#fff',fontWeight:'bold',padding:10}}>Conversar</Text>
                        <Icon name="chatboxes" style={{fontSize:20}} />
                    </Button>
                </Right>
            </View>
        )
    }
}

const styles = {
    titulo: {
      fontSize: 16,
      fontWeight:'bold',
      color:'#2F7E87'
    },
    texto: {
        fontSize: 12,
        fontFamily: 'serif'
    },
    data: {
        fontSize: 10
    },
    tela: {
      flex: 1,
      backgroundColor: '#4F4F4F',
      padding: 20
    },
    botoes: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        //paddingLeft:janela.width*0.02,
        //paddingRight:janela.width*0.02,
    },
    scroll: {
        height: janela.height-185,
    }
  }