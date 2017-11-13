import React, { Component } from 'react';
import { View, Dimensions, ScrollView, TouchableOpacity, Alert, TextInput, AsyncStorage, Modal, Switch } from 'react-native';
import { Button, Container, Content, Text, Icon, Thumbnail, CardItem, Card,
    Body, Badge, Header, List, ListItem, Left, Right, ActionSheet } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { SignalR } from './SignalR';

import Stars from 'react-native-stars';
import Overlay from './Overlay';

import url from './URL';
import MeuId from './MeuId';

import f from 'tcomb-form-native';
var Form = f.form.Form;
var tags = f.struct({
    tag: f.list(f.String),
});

const janela = Dimensions.get('window');
let id = 0;

export default class PerfilUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perfil: [],
            tags: [],
            editarTags: [],
            denuncia: '',
            problema: '',
            modalDenuncia: false,
            modalProblema: false,
            modalTags: false,
            historias: [],
            mostraItens: false,
            status: false,
        }

        this.conversar = this.conversar.bind(this);
        this.criaConexao = this.criaConexao.bind(this);
        this.voltarTagsEdicao = this.voltarTagsEdicao.bind(this);
        this.editarTags = this.editarTags.bind(this);
        this.modalEditarTags = this.modalEditarTags.bind(this);
        this.novahistoria = this.novahistoria.bind(this);
        this.editarperfil = this.editarperfil.bind(this);
        this.reportarModalProblema = this.reportarModalProblema.bind(this);
        this.reportarModalDenuncia = this.reportarModalDenuncia.bind(this);
        this.trocarPerfil = this.trocarPerfil.bind(this);
        this.conversar = this.conversar.bind(this);
        this.receberNotificacoes = this.receberNotificacoes.bind(this);
    }

    // NATIVO

    componentWillMount() {
        this.carregaPerfil();
    }

    componentWillReceiveProps(props_recebidas) {
        if (props_recebidas.atualizar)
            this.carregaPerfil();
    }

    // FUNÇÕES

    carregaPerfil() {
        this.meu_id = parseInt(MeuId.getId());
        id = this.props.id == undefined ? this.meu_id : this.props.id;
        this.setState({mostraItens: this.props.id == undefined ? true : false});
        this.dadosPerfil(id);
        this.tags(id);
        this.historias(id);
    }

    historia(h) {
        Actions.Historia({historia: h});
    }

    async historias(id) {
        fetch(url + '/historia/historiasusuario?idUsuario='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({historias: responseJson.historias});
        }}).catch((error) => {console.warn('historias: ' + error);});
    }

    async dadosPerfil(id) {
        fetch(url + '/usuario/getperfilcompleto?idusuario='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({perfil: responseJson.perfil});
            }    
        }).catch((error) => { console.warn('dadosPerfil: ' + error); });
    }

    async tags(id) {
        fetch(url + '/usuario/tags?idusuario='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({tags: responseJson.tags});
            }
        }).catch((error) => {console.warn('tags: ' + error); });
    }

    editarhistoria(h) {
        Actions.NovaHistoria({id: id, h: h});
    }

    voltar() {
        Actions.pop();
    }

    editarperfil() {
        Actions.PerfilUsuarioEditar({perfil: this.state.perfil})
    }

    novahistoria() {
        Actions.NovaHistoria({id: id})
    }

    conversar() {
        fetch(url + '/chatconexao/checaconexao?idUsuario1='+this.meu_id+'&idUsuario2='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if (!responseJson.sucesso)
                this.criaConexao();
            else
                Actions.Chat({
                    id_usuario: this.state.perfil.idUsuario,
                    nome_usuario: this.state.perfil.apelido,
                    foto: this.state.perfil.foto,
                    idChatConexao: responseJson.idConexao});
        }).catch((error) => {console.warn('conversar: ' + error);});
    }

    criaConexao() {
        fetch(url + '/ChatConexao/CriaConexao', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario1: this.meu_id,
                idUsuario2: this.state.perfil.idUsuario,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    Actions.Chat({id_usuario: this.state.perfil.idUsuario, nome_usuario: this.state.perfil.apelido, foto: this.state.perfil.foto, idChatConexao: responseJson.idConexao});
                } else
                    Alert.alert('Não foi possível abrir a conversa. Por favor, entre em contato com nossos administradores.', responseJson.erro);
            }).catch((error) => { console.warn('criaConexao: ' + error); });
    }

    reportarModalDenuncia() {
        this.setState({modalDenuncia: true})
    }

    denunciar(usr) {
        fetch(url + '/denuncia/denunciar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idUsuario: this.meu_id,
            idUsuarioDenunciado: usr.idUsuario,
            denuncia: this.state.denuncia
        })}).then((response) => response.json()).then((responseJson) => {
            if (responseJson.sucesso) {
                this.setState({modalDenuncia: false, denuncia: ''});
                Alert.alert(' ', 'Denúncia enviada com sucesso!');
            } else { Alert.alert('A Denúncia não pôde ser enviada.', responseJson.erro); }
        }).catch((error) => {console.warn(error);});
    }

    reportarModalProblema() {
        this.setState({modalProblema: true})
    }

    reportar() {
        fetch(url + '/usuario/reportarproblema', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: this.meu_id,
                problema: this.state.problema
            })}).then((response) => response.json()).then((responseJson) => {
                if (responseJson.sucesso) {
                    this.setState({modalProblema: false, problema: ''});
                    Alert.alert('Obrigado!', 'Sua observação foi enviada.');
                } else { Alert.alert('Sua observação não pôde ser enviada.', responseJson.erro); }
            }).catch((error) => {console.warn('reportar: '+error);});
    }

    receberNotificacoes(valor) {
        this.state.perfil.notificar = valor;
        this.forceUpdate();

        fetch(url + '/Login/AtualizaPrivacidade', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: this.meu_id,
                naoQuerNotificacoes: valor
            })}).then((response) => response.json()).then((responseJson) => {
                if (responseJson.sucesso)
                    console.warn('salvou');
            }).catch((error) => { console.warn('receberNotificacoes: '+ error); });
    }

    trocarPerfil() {
        Alert.alert(
            'Atenção!',
            'Você não receberá notificações depois de sair. Deseja sair?',
            [
                {text: 'Não'},
                {text: 'Sim', onPress: () => {
                    fetch(url + '/login/limpaToken', {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                        idUsuario: MeuId.getId()
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            AsyncStorage.clear();
                            SignalR.desconectar();
                            Actions.Login();
                        }).catch((error) => { console.warn('erro'); });
                }}
            ]);
    }

    voltarTagsEdicao() {
        this.setState({modalTags: false});
        this.tags(id);
    }

    clicaTag = (index,item) => {
        this.state.editarTags[index].selecionado = !item.selecionado;
        this.setState({editarTags: this.state.editarTags});
    }

    modalEditarTags() {
        this.setState({modalTags: true});
    
        fetch(url + '/usuario/TagsRestantes', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tags: this.state.tags
          })
          }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    this.setState({editarTags: responseJson.tags});
                }
            }).catch((error) => { console.warn('modaleditartags: ' + error); });
    }

    editarTags() {
        var idTags = [];
        var tags = this.state.editarTags;
        for (var i = 0; i < tags.length; i++)
            if (tags[i].selecionado) idTags.push(tags[i].idTag);
    
        fetch(url + '/usuario/EditarTags', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: this.meu_id,
                tags: idTags
            })
        }).then((response) => response.json())
            .then((responseJson) => {    
                if (responseJson.sucesso) {
                    this.voltarTagsEdicao();
                    //Alert.alert('Sucesso', 'Assuntos alterados com sucesso!');
                } else {
                    Alert.alert('erro: ' + responseJson.erro);
                }    
            }).catch((error) => { console.warn('editarTags: ' + error); });
    }

    /* onoff() {
        this.setState({status: !this.state.status});

        fetch(url + '/usuario/alterarstatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: this.state.perfil
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    console.warn('OK');
                }
            }).catch((error) => {console.warn('onoff: '+error); });
    } */

    // RENDER

    render() {
        return (
            <Container style={{backgroundColor:'white'}}>                
                {this.renderHeader()}
                <Content>
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        {this.renderID()}
                        {this.renderBiografia()}
                        {this.renderTags()}
                        {this.renderHistorias()}
                        {this.renderConfiguracoes()}
                    </ScrollView>
                </Content>
                {this.renderModalDenuncia()}
                {this.renderModalTags()}                
                {this.renderModalProblema()}
            </Container>
        );
    }

    renderHeader() {
        return (
            <Header style={styles.header}>
                <Icon name="arrow-back" style={{padding:10}} onPress={() => this.voltar()} />
            </Header>
        )
    }

    /* <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:10,color:'#2F7E87'}}>Offline</Text>
                        <Switch value={this.state.status} onValueChange={this.onoff} tintColor="red" onTintColor="green" />
                        <Text style={{fontSize:10,color:'#2F7E87'}}>Online</Text>
                    </View> */

    renderID() {
        return (
            <View style={{flexDirection:'row'}}>
                <Left style={{flexDirection:'row',alignItems:'center',paddingTop:10,paddingLeft:10}}>
                    <Thumbnail
                        style={styles.avatar}
                        source={{uri: this.state.perfil.foto == null ? url + '/imagens/perfil/nao_existe.png' : url + this.state.perfil.foto}}
                    />
                    <View style={{flexDirection: 'column',alignItems:'flex-start',paddingLeft:10}}>
                        <Text style={styles.apelido}>{this.state.perfil.apelido}</Text>
                        {this.state.perfil.idade > 0 && <Text style={styles.informacoes}>{this.state.perfil.idade} Anos</Text>}
                        <Text style={styles.informacoes}>{this.state.perfil.sexoExtenso}</Text>
                        <Stars
                            value={parseFloat(this.state.perfil.avaliacao)}
                            spacing={0}
                            count={5}
                            starSize={10}
                            backingColor='white'
                            fullStar= {require('./images/starFilled.png')}
                            emptyStar= {require('./images/starEmpty.png')}/>
                    </View>
                </Left>
            </View>
        )
    }

    renderBiografia() {
        if (this.state.perfil.quem != null)
        {
            if (this.state.mostraItens)
            {
                return (
                    <View style={{padding:10}}>
                        <Card>
                            <TouchableOpacity onPress={this.editarperfil}>
                                <View style={styles.secao}><Text style={styles.titulo}>SOBRE</Text></View>
                            </TouchableOpacity>
                            <Text style={styles.texto}>{this.state.perfil.quem}</Text>
                        </Card>
                    </View>
                )
            } else {
                return (
                    <View style={{padding:10}}>
                        <Card>
                            <View style={styles.secao}><Text style={styles.titulo}>SOBRE</Text></View>
                            <Text style={styles.texto}>{this.state.perfil.quem}</Text>
                        </Card>
                    </View>
                )
            }
        } else {
            if (this.state.mostraItens)
            {
                return (
                    <View style={{padding:10}}>
                        <Card>
                            <TouchableOpacity onPress={this.editarperfil}>
                                <View style={styles.secao}><Text style={styles.titulo}>SOBRE</Text></View>
                            </TouchableOpacity>
                            <Text style={styles.vazio}>Você não possui uma biografia</Text>
                        </Card>
                    </View>
                )
            } else {
                return (
                    <View style={{padding:10}}>
                        <Card>
                            <View style={styles.secao}><Text style={styles.titulo}>SOBRE</Text></View>
                            <Text style={styles.vazio}>{this.state.perfil.quem} não possui uma biografia</Text>
                        </Card>
                    </View>
                )
            }
        }
    }

    renderTags() {
        if (this.state.tags.length > 0) {
            return (
                <View style={{padding:10,paddingTop:-5}}>
                    <Card>
                        {this.state.mostraItens == true ? <TouchableOpacity onPress={this.modalEditarTags}>
                            <View style={styles.secao}><Text style={styles.titulo}>ASSUNTOS DE INTERESSE</Text></View>
                        </TouchableOpacity> : <View style={styles.secao}><Text style={styles.titulo}>ASSUNTOS DE INTERESSE</Text></View>}
                        <View style={styles.tagsPerfil}>
                            {this.state.tags.map((item, index) => {
                                if (this.state.tags.length > 0) {
                                    return (
                                        <View key={index} style={styles.tag}>
                                            <Icon name="radio-button-off" style={{fontSize:15,color:item.cor}} />
                                            <Text style={{fontSize:12,color:'#2F7E87'}}>{item.nome}</Text>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    </Card>
                </View>
            )
        }  else {
            return (
                <View style={{padding:10,paddingTop:-5}}>
                    <Card>
                        {this.state.mostraItens == true ? <TouchableOpacity onPress={this.modalEditarTags}>
                            <View style={styles.secao}><Text style={styles.titulo}>ASSUNTOS DE INTERESSE</Text></View>
                        </TouchableOpacity> : <View style={styles.secao}><Text style={styles.titulo}>ASSUNTOS DE INTERESSE</Text></View>}
                        <Text style={styles.vazio}>{this.state.mostraItens == true ? 'Você' : this.state.perfil.apelido} não escolheu assuntos</Text>
                    </Card>
                </View>
            )
        }
    }

    renderHistorias() {
        if (this.state.perfil.totalHistorias > 0)
        {
            return (
                <View style={{padding:10,paddingTop:-5}}>
                    <Card>
                        {this.state.mostraItens == true ? <TouchableOpacity onPress={this.novahistoria}>
                            <View style={styles.secao}><Text style={styles.titulo}>HISTÓRIAS DE VIDA</Text></View>
                        </TouchableOpacity> : <View style={styles.secao}><Text style={styles.titulo}>HISTÓRIAS DE VIDA</Text></View>}
                        <List
                            dataArray={this.state.historias}
                            renderRow={(item) =>
                                <ListItem style={{height:30}} onPress={() => this.state.mostraItens ? this.editarhistoria(item) : this.historia(item)}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize:12,color:'#2F7E87'}}>{item.titulo}</Text>
                                    </View>
                                </ListItem>
                        }/>
                    </Card>
                </View>
            );
        } else {
            return (
                <View style={{padding:10,paddingTop:-5}}>
                    <Card>
                        {this.state.mostraItens == true ? <TouchableOpacity onPress={this.novahistoria}>
                            <View style={styles.secao}><Text style={styles.titulo}>HISTÓRIAS DE VIDA</Text></View>
                        </TouchableOpacity> : <View style={styles.secao}><Text style={styles.titulo}>HISTÓRIAS DE VIDA</Text></View>}
                        <Text style={styles.vazio}>{this.state.mostraItens == true ? 'Você' : this.state.perfil.apelido} não criou histórias</Text>
                    </Card>
                </View>
            )
        }
    }

    renderConfiguracoes() {
        if (this.state.mostraItens) {
            return (
                <View style={{padding:10}}>
                    <Card>
                        <View style={styles.secao}><Text style={styles.titulo}>OPÇÕES</Text></View>
                        <List>
                            <ListItem icon onPress={this.reportarModalProblema}>
                                <Left><Icon name="warning" style={{fontSize:20,color:'orange'}} /></Left>
                                <Body><Text note>Reportar um Problema</Text></Body>
                                <Right><Icon name="arrow-up" /></Right>
                            </ListItem>
                            <ListItem icon onPress={this.receberNotificacoes}>
                                <Left><Icon name="notifications" style={{fontSize:20,color:'green'}} /></Left>
                                <Body><Text note>Receber Notificações</Text></Body>
                                <Right><Switch value={this.state.perfil.notificar} onValueChange={(valor) => this.receberNotificacoes(valor)} /></Right>
                            </ListItem>
                            <ListItem icon onPress={this.trocarPerfil}>
                                <Left><Icon name="bicycle" style={{fontSize:20,color:'purple'}} /></Left>
                                <Body><Text note style={{color:'red',fontWeight:'bold'}}>Sair</Text></Body>
                                <Right><Icon name="exit" /></Right>
                            </ListItem>
                        </List>
                    </Card>
                </View>
            )
        } else {
            return (
                <View style={{padding:10,paddingTop:-5}}>
                    <Card>
                        <View style={styles.secao}><Text style={styles.titulo}>OPÇÕES</Text></View>
                        <List>
                            <ListItem icon onPress={this.conversar}>
                                <Left><Icon name="chatboxes" style={{fontSize:20,color:'green'}} /></Left>
                                <Body><Text note>Enviar Mensagem</Text></Body>
                                <Right><Icon name="arrow-forward" /></Right>
                            </ListItem>
                            <ListItem icon onPress={this.reportarModalDenuncia}>
                                <Left><Icon name="megaphone" style={{fontSize:20,color:'red'}} /></Left>
                                <Body><Text note>Denunciar</Text></Body>
                                <Right><Icon name="arrow-up" /></Right>
                            </ListItem>
                        </List>
                    </Card>
                </View>
            )
        }
    }

    // MODAL

    renderModalDenuncia() {
        if (this.state.modalDenuncia) {
            return (
            <Overlay visible={this.state.modalDenuncia}
                closeOnTouchOutside animationType="fade"
                containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}>
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
                    <TouchableOpacity onPress={() => {this.denunciar(this.state.perfil)}}>
                    <Text>Enviar Denúncia</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
            )
        }
        else { return null; }
    }

    renderModalProblema() {
        if (this.state.modalProblema) {
            return (
            <Overlay visible={this.state.modalProblema}
                closeOnTouchOutside animationType="fade"
                containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}>
                <View>
                    <TextInput
                        style={{width: 250, height: 100, borderColor: 'gray', borderWidth: 1}}
                        multiline={true}
                        onChangeText={(text) => this.setState({problema: text})}
                        value={this.state.problema}
                        editable = {true}
                    />
                </View>
                <View style={styles.enviar}>
                    <TouchableOpacity onPress={() => {this.reportar()}}>
                    <Text>Enviar Problema</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
            )
        }
        else { return null; }
    }

    renderModalTags() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalTags}
                onRequestClose={this.voltarTagsEdicao} 
           >
                <View style={{alignItems:'flex-start', justifyContent:'center', paddingLeft:20, paddingBottom:5, marginTop:20}} >
                    <TouchableOpacity onPress={this.voltarTagsEdicao}>
                        <Icon name='arrow-back' style={{color: '#2F7E87'}}/>
                    </TouchableOpacity>
                </View>
                <Text style={{color:'#2F7E87', fontSize:13,  marginLeft:15, marginTop:10}}> 
                    Selecione os assuntos do seu interesse:
                </Text>
                <Card style={styles.cardTags}>
                    <ScrollView style={{margin:20}}>
                        <Body style={styles.tags}>
                        {
                            this.state.editarTags.map((item, index) => {
                                if (this.state.editarTags.length > 0) {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => this.clicaTag(index,item)} >
                                            <Badge key={index} style={item.selecionado ? styles.tagM : styles.tagNaoSelecionada}><Text>{item.nome}</Text></Badge>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                        </Body>
                    </ScrollView>
                </Card>

                <TouchableOpacity activeOpacity={.5} onPress={this.editarTags}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
       )
    }
}

const styles = {
    vazio: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 12
    },
    topo: {
        alignItems:'center',
        paddingTop: 5
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40
    },
    button: {
        backgroundColor: "#4FD3E2",
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
    },
    header: {
        backgroundColor: '#FAFAFA',
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40
    },
    titulo: {
        color: '#4FD3E2',
        fontSize: 15,
        fontWeight: 'bold',
    },
    apelido: {
        fontWeight: 'bold',
        fontSize: 15,
        color:'#2F7E87'
    },
    informacoes: {
        fontSize: 11,
        color:'#2F7E87'
    },
    texto: {
        fontSize: 12,
        padding: 5,
        alignItems: 'center',
        fontFamily: 'serif',
        textAlign: 'center',
        color: '#2F7E87',
    },
    identificador: {
        //backgroundColor: '#f0ffdb',
        alignItems: 'center',
        padding: 5
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:20,
        //backgroundColor: '#f0ffdb',
        //borderWidth:1
    },
    cardTags: {
        //marginRight:10,
        //marginTop: 10, 
        //marginBottom: 10,
        //marginLeft: 10, 
        flexDirection: 'column', 
        justifyContent: 'space-between'
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //justifyContent: 'center',
        //alignItems:'center',
        //padding:5
    },
    tagsPerfil: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems:'center',
        padding:5,
    },
    tag: {
        alignItems:'center',
        paddingRight:15,
        marginRight: 5,
        marginBottom: 5,
    },
    tagM: {
        alignItems:'center',
        paddingRight:15,
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: '#4FD3E2'
    },
    tagNaoSelecionada: {
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: '#C8C8C8'
        //backgroundColor: '#99D299'
        //opacity: 0.75
    },
    secao: {
        //borderBottomWidth: 1,
        //borderBottomColor: '#2F7E87',
        //width:janela.width-50,
        alignItems: 'center',
        alignSelf:'center',
        paddingTop: 10,
    }
}