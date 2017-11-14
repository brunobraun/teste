import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, ScrollView, Dimensions,
         Alert, TextInput, TouchableHighlight, KeyboardAvoidingView, Text, Keyboard } from 'react-native';
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
            pesquisa: ''
        }

        this.pesquisar = this.pesquisar.bind(this);
    }

    // NATIVE

    componentWillMount() {
        this.meu_id = parseInt(MeuId.getId());
        this.historias();
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
                tipoConexao: 1
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    Actions.Chat({id_usuario: item.idUsuario, nome_usuario: item.nome, foto: item.foto, idChatConexao: responseJson.idConexao});
                } else
                    Alert.alert('Não foi possível abrir a conversa. Por favor, entre em contato com nossos administradores.', responseJson.erro);
            }).catch((error) => { console.warn('criaConexao: ' + error); });
    }

    pesquisar() {
        if (this.state.pesquisa != '') {
            fetch(url + '/historia/pesquisar?id='+this.meu_id+'&palavra='+this.state.pesquisa)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    this.setState({historias: responseJson.historias, pesquisa: ''});
                } else {
                    Alert.alert('Oops!', 'Nenhuma História encontrada com ' + this.state.pesquisa);
                    this.setState({pesquisa: ''});
                }
        }).catch((error) => {console.warn('pesquisar: ' + error);});
        }
    }

    // RENDER

    render() {
        if (this.state.historias.length > 0) {
            return (
                <Container style={styles.tela}>
                    {this.renderPesquisa()}
                    <DeckSwiper
                        dataSource={this.state.historias}
                        renderItem={item =>
                            <Card style={{elevation:3}}>
                                <View style={{height:janela.height-160}}>
                                    {this.renderHistoria(item)}
                                </View>
                            </Card>}
                    />
                </Container>
            );
        } else { return ( <Spinner animating={true} color={'#4FD3E2'} /> ) }
    }

    renderPesquisa() {
        return (
            <Header style={styles.header}>
                <TextInput 
                    style={{flex:1}}
                    placeholder="Pesquise por uma palavra..."
                    onChangeText={(text) => this.setState({pesquisa: text})}
                    value={this.state.pesquisa}
                    maxLength={30}
                />
                <Button
                    small
                    style={{backgroundColor:'#4FD3E2'}}
                    onPressOut={Keyboard.dismiss}
                    onPress={this.pesquisar}
                >
                    <Icon name="search" />
                </Button>
            </Header>
        )
    }

    renderHistoria(item) {
        return (
            <Container>
                <Content>
                    <View style={styles.info}>
                        <Text style={styles.titulo}>{item.titulo}</Text>
                        <Text note style={styles.data}>Criada dia {moment(item.datahora).format('LL')}</Text>
                        <Text note style={styles.nome}>por {item.nome}</Text>
                        <Thumbnail
                            style={styles.avatar}
                            source={{uri: item.foto == null ? url + '/imagens/perfil/nao_existe.png' : url + item.foto}}
                        />
                    </View>
                    <View style={styles.scroll}>
                        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            <CardItem>
                                <Text style={styles.texto}>{item.historia}</Text>
                            </CardItem>
                        </ScrollView>                            
                    </View>
                </Content>

                <Footer style={{backgroundColor:'#fff',elevation:0,borderTopWidth:0.5,borderColor:'#4FD3E2'}}>
                    <FooterTab style={{backgroundColor:'#fff',elevation:0}}>
                        <Body>{this.renderAcoes(item)}</Body>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

    renderAcoes(item) {
        return (
            <View style={styles.acoes}>
                <Left>
                    <Button style={{backgroundColor:'#4FD3E2',borderRadius:5,}} small iconLeft onPress={() => this.perfil(item.idUsuario)}>
                        <Icon name="person" style={{fontSize:20}} />
                        <Text style={{color:'#fff',fontWeight:'bold',padding:10}}>Ver Perfil</Text>
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
    info: {
        flexDirection:'column',
        alignItems:'center',
        padding: 10,
    },
    header: {
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40
    },
    titulo: {
      fontSize: 16,
      fontWeight:'bold',
      color:'#2F7E87',
    },
    texto: {
        fontSize: 13,
        fontFamily: 'serif',
        lineHeight: 20
    },
    data: {
        fontSize: 10
    },
    nome: {
        fontSize: 11
    },
    avatar: {
        height: 24,
        width: 24,
        borderRadius: 12
    },
    tela: {
      flex: 1,
      backgroundColor: '#4F4F4F',
      padding: 20
    },
    acoes: {
        flexDirection:'row',
        paddingLeft:janela.width*0.03,
        paddingRight:janela.width*0.03
    },
    scroll: {
        height: 250,
    }
  }