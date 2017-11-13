import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Header, Icon, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';

import f from 'tcomb-form-native';

var Form = f.form.Form;

var H = f.struct({
    titulo: f.String,
    texto: f.String
});

const options = {
    fields: {
        titulo: {
            label: 'Título da sua História',
            error: 'Sua história dever conter um título.',
            maxLength: 100
        },
        texto: {
            label: 'Conte sua história de vida aqui',
            error: 'Escreva uma história inspiradora.',
            multiline: true,
            stylesheet: {
                ...Form.stylesheet,
                textbox: {
                    ...Form.stylesheet.textbox,
                    normal: {
                        ...Form.stylesheet.textbox.normal,
                        height: 300
                    },
                    error: {
                        ...Form.stylesheet.textbox.error,
                        height: 300
                    }
                }
            }
        }
    }
}

export default class NovaHistoria extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: {
                titulo: this.props.h == undefined ? '' : this.props.h.titulo,
                texto: this.props.h == undefined ? '' : this.props.h.historia
            },
            mostraExcluir: this.props.h == undefined ? false : true
        }

        this.excluir = this.excluir.bind(this);
        this.salvar = this.salvar.bind(this);
    }

    // FUNÇÕES

    salvar() {
        var v = this.refs.form.getValue();
        if (!v) return;

        if (this.props.h == undefined)
        {
            fetch(url + '/historia/novahistoria', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: this.props.id,
                    titulo: v.titulo,
                    historia: v.texto
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.sucesso) {
                        this.voltar();
                        Alert.alert('Sucesso', 'História criada com sucesso!');
                    } else {
                        Alert.alert('Falha', responseJson.erro);
                    }    
                }).catch((error) => {console.warn(error); });
        } else {
            fetch(url + '/historia/editahistoria', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: this.props.id,
                    idHistoria: this.props.h.idHistoria,
                    titulo: v.titulo,
                    texto: v.texto
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.sucesso) {
                        this.voltar();
                        Alert.alert('Sucesso', 'História alterada com sucesso!');
                    } else {
                        Alert.alert('Falha', responseJson.erro);
                    }    
                }).catch((error) => {console.warn(error); });
        }
    }

    excluir() {
        Alert.alert(
            'Atenção!',
            'Você deseja excluir essa História?',
            [
                {text: 'Não'},
                {text: 'Sim', onPress: () => {
                    fetch(url + '/historia/excluir', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            idUsuario: this.props.id,
                            idHistoria: this.props.h.idHistoria,
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.sucesso) {
                                this.voltar();
                                Alert.alert('Sucesso', 'História excluída com sucesso!');
                            } else {
                                Alert.alert('Falha', responseJson.erro);
                            }    
                        }).catch((error) => {console.warn(error); });
                }}
            ]);
    }

    voltar() {
        Actions.replace('PerfilUsuario', { atualizar: true });
    }

    // RENDER

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Icon name="arrow-back" style={{padding:10}} onPress={this.voltar} />
                    <Right>
                        {this.state.mostraExcluir && <TouchableOpacity onPress={this.excluir}><Text style={{color:'red',paddingRight:30}}>Excluir</Text></TouchableOpacity>}
                    </Right>
                </Header>
                <Content style={{padding:15}}>
                    {this.renderForm()}
                    {this.renderAcoes()}
                </Content>
            </Container>
        );
    }

    renderForm() {
        return (
            <View>
                <Form
                    ref="form"
                    type={H}
                    options={options}
                    value={this.state.value}
                />
            </View>
        );
    }

    renderAcoes() {
        return (
            <View>
                <TouchableOpacity activeOpacity={.5} onPress={this.salvar}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </View>
                </TouchableOpacity>
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
    button: {
        backgroundColor: "#4FD3E2",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
    },
}