import React, { Component } from 'react';
import { Image, View, Alert, TouchableOpacity, WebView, Dimensions, Text } from 'react-native';
import { Container, Content, 
         Card, CardItem, Thumbnail,
         Button, Icon, Left, Right,
         Body, StyleProvider, Spinner,
         Tab, Tabs, TabHeading, Header, Segment } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { Actions } from 'react-native-router-flux';

import url from './URL';

import MeuId from './MeuId';

import Estilos from './Estilos';

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');

const janela = Dimensions.get('window');

export class Publicacao extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pub: props.pub
    }

    this.meu_id = parseInt(MeuId.getId());
  }

  postCurtir(item) {
    fetch(url + '/publicacao/curtir', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idPublicacao: item.idPublicacao,
      curt: item.curtida
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson.sucesso) {
          console.warn('Erro postCurtirJson: ' + responseJson.erro)
        } 
        else {
          item.curtida = !item.curtida;
          this.setState({pub: this.state.pub});
        }
      })
      .catch((error) => {
        console.warn('Erro postCurtir: ' + error);
    });
  }

  postFavoritar(item) {
    fetch(url + '/publicacao/favoritar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idPublicacao: item.idPublicacao,
      fav: item.favoritou
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson.sucesso) {
          console.warn('Erro postFavoritarJson: ' + responseJson.erro);
        } 
        else {
          item.favoritou = !item.favoritou;
          this.setState({pub: this.state.pub});
        }
      })
      .catch((error) => {
        console.warn('Erro postFavoritar: ' + error);
    });
  }

  Voltar() {
      const props = { atualizar: true };
      Actions.pop({refresh: {...props}});
  }

  render() {
    return (
      <Container>
        <Content>
          <Header style={styles.headerPublicacao}>
            <Icon name="arrow-back" style={{color: '#757575',padding:10}} onPress={() => this.Voltar()} />
          </Header>
          <Card>
            <CardItem>                        
              <Left>                          
                <Body>                            
                  <Text style={styles.titulo}>{this.state.pub.titulo}</Text>
                  <Text note style={styles.data}>{moment(this.state.pub.data).format('LL')}</Text>                            
                </Body>                          
              </Left>                        
            </CardItem>
            <CardItem cardBody>
              <Corpo tipo={this.state.pub.youtubeId != null ? 'Video' : 'Imagem'} imagem={this.state.pub.imagem} youtube={this.state.pub.youtubeId} />
            </CardItem>
            <CardItem>
              <Text style={styles.texto}>{this.state.pub.conteudo}</Text>
            </CardItem>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/*<Button transparent onPress={() => {this.postCurtir(this.state.pub)}}>
                <Icon active name='thumbs-up' style={{color: this.state.pub.curtida ? 'green' : 'blue'}} />
                <Text style={styles.opcoes}>Curtir</Text>
              </Button>*/}
              <Button transparent onPress={() => {this.postFavoritar(this.state.pub)}}>
                {/*<Text style={styles.opcoes}>Favorito</Text>*/}
                <Icon active name='heart' style={{color: this.state.pub.favoritou ? 'red' : '#757575'}} />
              </Button>
            </View>
          </Card>
        </Content>
      </Container>
    );
  }
}

export class Corpo extends Component {
  render() {
    switch (this.props.tipo) {
      case 'Imagem':
        return (
          <Image style={styles.imagem} source={{uri: url + '/Imagens/Feed/' + this.props.imagem}} />
        );
      case 'Video':
        return (
          <View style={styles.corpo}>
            <WebView
              source={{uri: 'https://www.youtube.com/embed/' + this.props.youtube}}
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true} />
              <Text />{/*MAIOR GAMBIARRA DE TODOS OS TEMPOS!!! Sem isso não carrega o video AHAHAHAHAHAHAHAHAHAHA*/}
          </View>
        );
    }
  }
}

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pubs: [],
      ativo: 'Feed',
    }

    this.getPublicacoes = this.getPublicacoes.bind(this);

  }



  getPublicacoes(ehFavorito) {
    this.setState({ativo: ehFavorito ? 'Favoritos' : 'Feed'});
    return fetch(url + '/publicacao/publicacoes?idUsuario='+this.meu_id+'&ehFavorito=' + ehFavorito)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if(responseJson.sucesso) {
          var publicacoes = responseJson.publicacoes;

          this.setState({
            pubs: publicacoes
          });
        }   
        
      })
      .catch((error) => {
        console.warn('Erro getPublicacoes: ' + error);
      });
  }

  postCurtir(item) {
    fetch( url + '/publicacao/curtir', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idPublicacao: item.idPublicacao,
      curt: item.curtida
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson.sucesso) {
          console.warn('Erro postCurtirJson: ' + responseJson.erro)
        } 
        else {
          item.curtida = !item.curtida;
          this.setState({pubs: this.state.pubs});
        }
      })
      .catch((error) => {
        console.warn('Erro postCurtir: ' + error);
    });
  }

  postFavoritar(item, index) {
    fetch(url + '/publicacao/favoritar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idUsuario: this.meu_id,
      idPublicacao: item.idPublicacao,
      fav: item.favoritou
    })
  }).then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson.sucesso) {
          console.warn('Erro postFavoritarJson: ' + responseJson.erro);
        } 
        else {
          // Atribuido novo array para usar Splice
          var novaPub = this.state.pubs;
          novaPub[index].favoritou = !novaPub[index].favoritou;
          // Exclui o favorito da lista se ele estiver na aba Favoritos
          if ((novaPub[index].favoritou == false) && (this.state.ativo == 'Favoritos'))
          {
            novaPub.splice(index, 1);
          }
          this.setState({pubs: novaPub});
        }
      })
      .catch((error) => {
        console.warn('Erro postFavoritar: ' + error);
    });
  }

  componentWillMount() {
    this.meu_id = parseInt(MeuId.getId());

    setTimeout(() => {
      this.getPublicacoes(false);
    }, 800);
    
  }

  componentWillReceiveProps(props_recebidas) {
    if (props_recebidas.atualizar)
    {
      var favoritos = false;
      if(this.state.ativo == 'Favoritos') favoritos = true;
      this.getPublicacoes(favoritos);
    }
  }

  abrePublicacao = (pub) => {
    Actions.Publicacao({id: this.meu_id, pub: pub});
  }

  renderPublicacoes = () => {
    if(this.state.pubs.length == 0) {
      return (<Spinner color='#51D9E7' />)
    } else {
      return (
          <View>
            {

                this.state.pubs.map((item, index) => {

                return (
                  <Card key={index}>
                    <TouchableOpacity onPress={() => this.abrePublicacao(item)}>
                      <CardItem>                        
                        <Left>                          
                          <Body>                            
                            <Text style={styles.titulo}>{item.titulo}</Text>
                            <Text note style={styles.data}>{moment(item.data).format('LL')}</Text>                            
                          </Body>
                        </Left>
                        <Right>
                          <Button transparent onPress={() => {this.postFavoritar(item, index)}}>
                            <Icon active name='heart' style={{color: item.favoritou ? 'red' : '#757575'}} />
                          </Button>
                        </Right>                        
                      </CardItem>
                    </TouchableOpacity>
                    <CardItem cardBody>
                      <Corpo tipo={item.youtubeId != null ? 'Video' : 'Imagem'} imagem={item.imagem} youtube={item.youtubeId} />
                    </CardItem>
                    <TouchableOpacity onPress={() => this.abrePublicacao(item)}>
                      <CardItem>
                        <Text style={styles.texto}>{item.resumo}</Text>
                      </CardItem>
                    </TouchableOpacity>
                    {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      {/*<Button transparent onPress={() => {this.postCurtir(item)}}>
                        <Icon active name='thumbs-up' style={{color: item.curtida ? 'green' : 'blue'}} />
                        <Text style={styles.opcoes}>Curtir</Text>
                      </Button>
                      <Button transparent onPress={() => {this.postFavoritar(item, index)}}>
                        <Icon active name='heart' style={{color: item.favoritou ? 'red' : 'blue'}} />
                        <Text style={styles.opcoes}>Salvar</Text>
                      </Button>
                    </View>*/}
                  </Card>
                )
              })
            }
          </View>
      )
    }
    
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <View style={styles.header}>
            <Segment style={{backgroundColor: 'blue'}}>
              <Button first active={this.state.ativo == 'Feed' ? true : false} onPress={() => this.getPublicacoes(false)}><Text>Feed</Text></Button>
              <Button last active={this.state.ativo == 'Favoritos' ? true : false} onPress={() => this.getPublicacoes(true)}><Text>Favoritos</Text></Button>
            </Segment>
          </View>
          <Content>
            {this.renderPublicacoes()}
          </Content>
        </Container>
      </StyleProvider>
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
  headerPublicacao: {
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  titulo: {
    fontSize: 16
  },
  data: {
    fontSize: 12
  },
  texto: {
    fontSize: 14
  },
  opcoes: {
    fontSize: 12
  },

  info: {
    fontSize: 12,
    paddingTop: 15,
  },
  video: {
      maxHeight: 200,
      width: 320,
      flex: 1,
  },
  corpo: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    height:200
  },
  imagem: {
    width:janela.width-.2*100,
    height:janela.height/2-(.2*janela.height),
    alignItems: 'center',
    flex:1,
    flexDirection:'row',
  }
}