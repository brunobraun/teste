import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Container, Content, Card, CardItem, Header, Icon, Label } from 'native-base';
import { Actions } from 'react-native-router-flux';

export default class Historia extends Component {
    constructor(props) {
        super(props);
    }

    voltar() {
        Actions.pop();
    }

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Icon name="arrow-back" style={{padding:10}} onPress={() => this.voltar()} />
                </Header>
                <Content>
                    {this.renderHistoria()}
                </Content>
            </Container>
        );
    }

    renderHistoria() {
        return (
            <View>
                <Card>
                    <CardItem style={{justifyContent:'center'}}>
                        <Label style={styles.titulo}>{this.props.historia.titulo}</Label>
                    </CardItem>
                    <CardItem>
                        <Text style={styles.texto}>{this.props.historia.historia}</Text>
                    </CardItem>
                </Card>
            </View>
        );
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
    header: {
        backgroundColor: '#FAFAFA',
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40
    },
}