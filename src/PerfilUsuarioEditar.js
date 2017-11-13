import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Dimensions, TextInput,
  AsyncStorage, Alert, Keyboard, Picker, Modal,
  TouchableHighlight, TouchableOpacity, ScrollView
} from 'react-native';
import { Container, Header, Left, Right, Body, Button, InputGroup,
    Input, Item, Icon, Label, Separator, Content, Thumbnail } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';

import imagens from './Avatar';

import url from './URL';

const janela = Dimensions.get('window');

import moment from 'moment';
import f from 'tcomb-form-native';

var Form = f.form.Form;

var Sexo = f.enums({
    0: 'Masculino',
    1: 'Feminino',
    3: 'Prefiro não informar'
});

var P = f.struct({
    nome: f.String,
    quem: f.maybe(f.String),
    datanasc: f.Date,
    sexo: Sexo
});

var galeriaOpcoes = {
    mediaType: 'photo',
    //maxWidth: 100,
    //maxHeight: 100,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class EditarPerfil extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perfil: this.props.perfil,
            modalImagens: false,
            avatar: url + '/imagens/perfil/nao_existe.png',

            options: {
                fields: {
                    nome: {
                        error: 'Escreva o nome que irá aparecer para os outros.',
                        maxLength: 50,
                    },
                    quem: {
                        label: 'Quem sou',
                        multiline: true,
                        maxLength: 200,
                        stylesheet: {
                            ...Form.stylesheet,
                            textbox: {
                                ...Form.stylesheet.textbox,
                                normal: {
                                    ...Form.stylesheet.textbox.normal,
                                    height: 100
                                },
                                error: {
                                    ...Form.stylesheet.textbox.error,
                                    height: 100
                                }
                            }
                        }
                    },
                    datanasc: {
                        label: 'Data de nascimento',
                        error: 'Selecione sua data de nascimento.'
                    }
                },
                config: {
                    format: (date) => {
                        return moment(date).format('DD/MM/YYYY');
                    }
                }
            },
            value: {
                nome: this.props.perfil.apelido,
                quem: this.props.perfil.quem,
                datanasc: new Date(this.props.perfil.dataNasc),
                sexo: this.props.perfil.sexo
            }
        }

        this.editar = this.editar.bind(this);
        this.escolherAvatar = this.escolherAvatar.bind(this);
        //this.salvarAvatar = this.salvarAvatar.bind(this);
    }

    // FUNÇÕES

    escolherAvatar() {
        let source = '';
        let dados = '';
        let nome = '';
        let path = '';

        ImagePicker.launchImageLibrary(galeriaOpcoes, (response) => {
            if (response.error) {
              console.warn('ImagePicker Error: ', response.error);
            }
            else {
              source = response.uri;
              nome = response.fileName;
              path = response.path;
              dados = 'data:image/jpeg;base64,' + response.data;
              this.setState({ avatar: source });
              this.salvarAvatar(dados, nome, path);
            }
        });
    }

    salvarAvatar(dados, nome, path) {
        fetch(url + '/usuario/SalvarAvatar', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dados: dados,
                nome: nome,
                path: path,
                id: this.state.perfil.idUsuario
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    Alert.alert('Sucesso', 'Avatar alterado!');
                } else {
                    Alert.alert('Falha!', responseJson.erro);
                }
            }).catch((error) => {console.warn('salvarAvatar: ' + error); });
    }

    editar() {
        var value = this.refs.form.getValue();
        if (!value)
            return;

        var data = moment(value.datanasc).format('YYYY/MM/DD').toString();
        if (data === moment(new Date).format('YYYY/MM/DD').toString()) {
            Alert.alert('Atenção!', 'Data de nascimento inválida!');
            return;
        }

        var perf = {
            idUsuario: this.state.perfil.idUsuario,
            nome: value.nome,
            dataNasc: data,
            quem: value.quem,
            sexo: value.sexo,
            foto: this.state.perfil.foto
        };
        
        fetch(url + '/usuario/editarperfil', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: perf
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.sucesso) {
                    this.voltar();
                    //Alert.alert(' ', 'Editado com sucesso!');
                } else {
                    Alert.alert(' ', responseJson.erro);
                }    
            }).catch((error) => {console.warn(error); });
    }

    escolheFoto = (item) => {
        this.state.perfil.foto = item;
        this.setState({perfil: this.state.perfil});
        this.setState({modalImagens: false});
    }

    voltar() {
        Actions.replace('PerfilUsuario', { atualizar: true });
    }

    // RENDER

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Icon name="arrow-back" style={{padding:10}} onPress={() => this.voltar()} />
                </Header>
                <Content style={{padding:15}}>
                    <TouchableOpacity onPress={this.escolherAvatar}>
                        <Image source={{uri: this.state.avatar}} style={styles.avatar} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({modalImagens: true})}}>
                        <Thumbnail 
                            large 
                            style={{paddingBottom:10,alignSelf:'center'}} 
                            source={{
                                uri: this.state.perfil.foto == null ? 
                                url + '/imagens/perfil/nao_existe.png' : 
                                url + this.state.perfil.foto}}
                    />
                    </TouchableOpacity>
                        <Form
                            ref="form"
                            type={P}
                            options={this.state.options}
                            value={this.state.value}
                    />
                    {this.renderAcoes()}
                </Content>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalImagens}
                    onRequestClose={() => {this.setState({modalImagens: false})}}
                >
                    <View style={{marginTop: 20, justifyContent:'center' }}>
                        <View style={{alignItems: 'flex-start', paddingLeft: 20}} >
                            <TouchableOpacity onPress={() => {this.setState({modalImagens: false})}}>
                                <Icon name='arrow-back' style={{color: 'black'}}/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <View style={styles.imagens}>
                            {
                                imagens.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={ () => {this.escolheFoto(item)} }>
                                        <Thumbnail key={index} large source={{uri: url + item }} />
                                    </TouchableOpacity>
                                )
                                })
                            }
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </Container>
        );
    }

    renderAcoes() {
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this.editar}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    avatar: {
        height: 100,
        width: 100,
    },
    header: {
        backgroundColor: '#FAFAFA',
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40
    },
    button: {
        backgroundColor: "#4FD3E2",
        //paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
    },
    imagens: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 25,
    },
}