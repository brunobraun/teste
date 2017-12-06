import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, ScrollView, Dimensions, Separator,
         Alert, TextInput, TouchableHighlight, KeyboardAvoidingView, Image, Keyboard } from 'react-native';
import { Container, Icon, View, Item, Input,
         DeckSwiper, Card, CardItem, Thumbnail, 
         Text, Body, Button, StyleProvider, Content, Right,
         Segment, Fab, Left, Header, Badge, Spinner, Footer, FooterTab } from 'native-base';
import Stars from 'react-native-stars';
import { Actions } from 'react-native-router-flux';
import Overlay from './Overlay';

import MeuId from './MeuId';
import url from './URL';
import Estilos from './Estilos';

const janela = Dimensions.get('window');

export default class Pessoas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            denuncia: '',
            modalDenuncia: false,
            pessoas: [],
            pesquisa: '',
        }

        this.pesquisar = this.pesquisar.bind(this);
    }

    // NATIVE

    componentWillMount() {
        this.meu_id = parseInt(MeuId.getId());
        this.getPessoas();
    }

    // FUNÇÕES

    getPessoas() {
        fetch(url + '/usuario/getpessoas?idUsuario='+this.meu_id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({pessoas: responseJson.pessoas});
        }}).catch((error) => {console.warn('getPessoas: ' + error);});
    }

    perfil(id) {
        Actions.PerfilUsuario({id: id});
    }

    conversar(item) {
        fetch(url + '/chatconexao/checaconexao?idUsuario1='+this.meu_id+'&idUsuario2='+item.usuario.idUsuario)
        .then((response) => response.json())
        .then((responseJson) => {
            if (!responseJson.sucesso)
                this.criaConexao(item);
            else
                Actions.Chat({
                    id_usuario: item.usuario.idUsuario,
                    nome_usuario: item.usuario.apelido,
                    foto: item.usuario.foto,
                    idChatConexao: responseJson.idConexao});
        }).catch((error) => {console.warn('conversar: ' + error);});
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
                idUsuario2: item.usuario.idUsuario,
                tipoConexao: 0
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    Actions.Chat({id_usuario: item.usuario.idUsuario, nome_usuario: item.usuario.apelido, foto: item.usuario.foto, idChatConexao: responseJson.idConexao});
                } else
                    Alert.alert('Não foi possível abrir a conversa. Por favor, entre em contato com nossos administradores.', responseJson.erro);
            }).catch((error) => { console.warn('criaConexao: ' + error); });
    }

    pesquisar() {
        if (this.state.pesquisa != '') {
            fetch(url + '/usuario/pesquisar?id='+this.meu_id+'&palavra='+this.state.pesquisa)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    this.setState({pessoas: responseJson.pessoas, pesquisa: ''});
                } else {
                    Alert.alert('Oops!', 'Ninguém foi encontrado com ' + this.state.pesquisa);
                    this.setState({pesquisa: ''});
                }
        }).catch((error) => {console.warn('pesquisar: ' + error);});
        }
    }

    // RENDER

    render() {
        if (this.state.pessoas.length > 0) {
            return (
                <Container style={styles.tela}>
                    {this.renderPesquisa()}
                    <DeckSwiper
                        dataSource={this.state.pessoas}
                        renderItem={item =>
                            <Card style={{elevation:3}}>
                                <View style={{height:janela.height-130}}>
                                    {this.renderDadosPerfil(item)}
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
                <Button small style={{backgroundColor:'#4FD3E2'}} onPressOut={Keyboard.dismiss} onPress={this.pesquisar}><Icon name="search" /></Button>
            </Header>
        )
    }

    renderDadosPerfil(item) {
        return (
            <Container>
                <Content>
                    {this.renderID(item)}
                    {this.renderBiografia(item)}
                    {this.renderTags(item)}
                </Content>

                <Footer style={{backgroundColor:'#fff',elevation:0,borderTopWidth:0.5,borderColor:'#4FD3E2'}}>
                    <FooterTab style={{backgroundColor:'#fff',elevation:0}}>
                        <Body>{this.renderAcoes(item)}</Body>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

    renderID(item) {
        return (
            <View>
                <View style={styles.topo}>
                    <Thumbnail
                        style={styles.avatar}
                        source={{uri: item.usuario.foto == null ? url + '/imagens/perfil/nao_existe.png' :  item.usuario.foto}}
                    />
                </View>
                <View style={{flexDirection:'row'}}>
                    <Left style={{alignItems:'center'}}>
                        <Text style={{fontSize:12,color:'#2F7E87'}}>Histórias</Text>
                        <Text style={{fontSize:13,color:'#4FD3E2'}}>{item.usuario.historias}</Text>
                    </Left>
                    <View style={{flexDirection:'column',alignItems:'center',paddingTop:10}}>
                        <Text style={styles.apelido}>{item.usuario.apelido}</Text>
                        {/*<Text style={styles.informacoes}>{item.usuario.idade} Anos</Text>
                        <Text style={styles.informacoes}>{item.usuario.sexoExtenso}</Text>                    
                        <Text style={{fontSize:13,color: item.usuario.status == true ? 'green' : 'red'}}>{item.usuario.status == true ? 'Online' : 'Offline'}</Text>*/}
                    </View>
                    <Right style={{alignItems:'center'}}>
                        <Text style={{fontSize:12,color:'#2F7E87'}}>Conversas</Text>
                        <Text style={{fontSize:13,color:'#4FD3E2'}}>{item.usuario.conversas}</Text>
                    </Right>
                </View>
            </View>
        )
    }

    renderBiografia(item) {
        return (
            <View style={styles.biografia}>
                <Text style={styles.texto}>{item.usuario.quem}</Text>
            </View>
        )
    }

    renderTags(usr) {
        if (usr.usuario.tags.length > 0) {
            return (
                <View style={styles.tags}>
                    {usr.usuario.tags.map((item, index) => {
                        if (usr.usuario.tags.length > 0) {
                            return (
                                <View key={index} style={styles.tag}>
                                    <Icon name="radio-button-off" style={{fontSize:15,color:item.cor}} />
                                    <Text style={{fontSize:12,color:'#4FD3E2'}}>{item.nome}</Text>
                                </View>
                            );
                        }
                    })}
                </View>
            )
        } else {
            return (
                <View style={styles.tag}>
                    <Icon name="radio-button-off" style={{fontSize:15,color:'gray'}} />
                    <Text style={{fontSize:12,color:'#4FD3E2'}}>Geral</Text>
                </View>
            )
        }
    }

    renderAcoes(item) {
        return (
            <View style={styles.acoes}>
                <Left>
                    <Button style={{backgroundColor:'#4FD3E2',borderRadius:5}} small iconLeft onPress={() => this.perfil(item.usuario.idUsuario)}>
                        <Icon name="person" style={{fontSize:20}} />
                        <Text uppercase={false}>Ver Perfil</Text>
                    </Button>
                </Left>
                <Right>                
                    <Button style={{backgroundColor:'#4FD3E2',borderRadius:5}} small iconRight onPress={() => this.conversar(item)}>
                        <Text uppercase={false}>Conversar</Text>
                        <Icon name="chatboxes" style={{fontSize:20}} />
                    </Button>
                </Right>
            </View>
        )
    }
}

const styles = {
    header: {
        backgroundColor: '#FAFAFA',
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40
    },
    acoes: {
        flexDirection:'row',
        paddingLeft:janela.width*0.03,
        paddingRight:janela.width*0.03
    },
    topo: {
        alignItems:'center',
        paddingTop:10,
        //backgroundColor: '#4FD3E2',
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65
    },
    titulo: {
        color: '#4FD3E2',
        fontSize: 12,
        fontWeight: 'bold',
    },
    biografia: {
        height: janela.height-450,
        padding: 15,
        paddingTop: 25
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //paddingTop: 5
    },
    coluna: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    apelido: {
        fontWeight: 'bold',
        fontSize: 15,
        color:'#4FD3E2'
    },
    informacoes: {
        fontSize: 11
    },
    texto: {
        fontSize: 12,
        marginTop: 5,
        alignItems: 'center',
        fontFamily: 'serif',
        textAlign: 'center',
        color: '#2F7E87',
    },
    identificador: {
        alignItems: 'center',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems:'center',
    },
    tag: {
        alignItems:'center',
        paddingRight:7,
        paddingLeft:7
    },
    tela: {
        flex: 1,
        backgroundColor: '#4F4F4F',
        paddingLeft: 20,
        paddingRight: 20,
    },
}