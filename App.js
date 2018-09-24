import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Button, Platform, TextInput,
  TouchableOpacity, ImageBackground,
  FlatList, Alert, Linking
} from "react-native"
import { androidClientId } from "./superSecretKey"
import { googleMapsApi } from "./superSecretKey"
import Expo from "expo"
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: {
        signedIn: false,
        name: "",
        photoUrl: ""
      },
      tela: "home",
      habilitaCriarGrupo: false,
      destino: "",
      EtapaCriar: 1,
      arrayMakers: [
        { img: './images/carro_amigo.png', lat: -20.592634, long: -47.386401, titulo: "Thalyta", descricao: "Veiculo da Thalyta" },
        { img: './images/carro_amigo.png', lat: -20.590102, long: -47.384554, titulo: "Fernando", descricao: "Veiculo do Fernando" }
      ],
      cordenadas:
        {
          coords: {
            latitude: -20.593819,
            longitude: -47.399491
          }
        }
    }
  }
  signIn = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: androidClientId,
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          login: {
            signedIn: true,
            name: result.user.name,
            photoUrl: result.user.photoUrl
          }
        })
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  handleClickFooter = async (param) => {
    try {
      this.setState({ tela: param }, () => {
        //Alert.alert(this.state.tela)
      })
    } catch (e) {
      console.log("error", e)
    }
  }

  onPressCreateGrupo = async () => {
    try {
      this.setState({ habilitaCriarGrupo: true }, () => {
        // Alert.alert(this.state.habilitaCriarGrupo)
      })
    } catch (e) {
      console.log("error", e)
    }
  }

  onPressBuscaLongetudeLatidePorNome = async () => {
    try {
      Geocoder.init(googleMapsApi);
      // Geocoder.language = 'portuguese'

      Geocoder.from("Colosseum").then(
        json => {
          let location = json.results[0].geometry.location;
          alert(location.lat + ", " + location.lng);
        },
        error => {
          console.log("error", e)
        }
      );

    } catch (e) {
      console.log("error", e)
    }
  }
  onChangeTextDestino = async (param) => {
    try {
      this.setState({ destino: param }, () => {
        //  Alert.alert(this.state.destino)
      })
    } catch (e) {
      console.log("error", e)
    }
  }
  onPressProximaEtapa = async (param) => {
    try {
      if (param == 1) {
        // var options = {
        //   language : 'ENGLISH' 
        // }
        // Geocoder.init(googleMapsApi, options);

        // Geocoder.from("Coliseu").then(
        //   json => {
        //     let location = json.results[0].geometry.location;
        //     alert(location.lat + ", " + location.lng);
        //   }, 
        //   error => {
        //     console.log("error", e)
        //   }
        // );


        this.setState({ EtapaCriar: 2 }, () => {
          this.setState({
            codigoGrupo: Math.random().toString(36).substring(5).toUpperCase()
          }, () => {
            Alert.alert('Codigo do Grupo : ' + this.state.codigoGrupo + '\nDestino a : ' + this.state.destino)
          })

        })
      } else if (param == 2) {
        var x = navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
            cordenadas: position
          }, () => {
            console.log(this.state.cordenadas)
            this.setState({ EtapaCriar: 3 }, () => {
              Linking.openURL('https://api.whatsapp.com/send?text=' + 'Este é um convite para viajar comigo no aplicativo TravelGroup. Codigo do Grupo : '.replace(/ /g, '%20') + this.state.codigoGrupo)
              
            })
            
          })
        }, (error) => {
          console.log(JSON.stringify(error))
        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
          });

          this.getPosicoes()   
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  getPosicoes = async () => {
    try {
        setInterval(function () {
          var x = navigator.geolocation.getCurrentPosition((position) => {
            console.log('--------------------------------------')
            console.log(position)
            console.log('--------------------------------------')
            this.setState({ cordenadas: position })
          }, (error) => {
            console.log('------------------- error -------------------')
            console.log(JSON.stringify(error))
            console.log('--------------------------------------')
          }, {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 1000
            });
        }, 15000); //15 segundos

    } catch (e) {
      console.log("error", e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.login.signedIn ? (

          <LoggedInPage name={this.state.login.name}
            photoUrl={this.state.login.photoUrl}
            handleClickFooter={this.handleClickFooter}
            tela={this.state.tela}
            onPressCreateGrupo={this.onPressCreateGrupo}
            habilitaCriarGrupo={this.state.habilitaCriarGrupo}
            destino={this.state.destino}
            onChangeTextDestino={this.onChangeTextDestino}
            onPressBuscaLongetudeLatidePorNome={this.onPressBuscaLongetudeLatidePorNome}
            onPressProximaEtapa={this.onPressProximaEtapa}
            EtapaCriar={this.state.EtapaCriar}
            arrayMakers={this.state.arrayMakers}
            cordenadas={this.state.cordenadas} />
        ) : (
            <LoginPage signIn={this.signIn} />
          )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <ImageBackground source={require('./images/logo_tcc.jpg')} style={styles.container}>
      <View style={styles.containerLogin}>
        <Button title="Logar com o Google" onPress={() => props.signIn()} />
      </View>
    </ImageBackground>
  )
}

const Marcadores = properts => {
  return properts.arrayMaker.map((data) => {
    return (
      <View key={data.lat + data.long}>
        <MapView.Marker
          image={require('./images/carro_amigo.png')}
          coordinate={{
            latitude: data.lat,
            longitude: data.long
          }}
          title={data.titulo}
          description={data.descricao}
        />
      </View>
    )
  })
}

const LoggedInPage = props => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* <Image source={require('./images/logo.png')} style={{ width: 98, height: 22 }} /> */}
        <View style={styles.rightNav}>
          <TouchableOpacity>
            <Icon style={styles.navItem} name="search" size={25} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon style={styles.navItem} name="account-circle" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        {props.habilitaCriarGrupo ? (
          <View style={styles.container}>
            {props.EtapaCriar == 1 ? (
              <View style={styles.container}>
                <Text style={styles.headerLabel} >~{"\n"} Informe a cidade de destino da viagem</Text>
                <TextInput value={props.destino} onChangeText={(text) => props.onChangeTextDestino(text)} />
                <Button
                  onPress={() => props.onPressProximaEtapa(1)}
                  title="Proxima etapa >"
                  color="#841584"
                  accessibilityLabel="Proxima Etapa"
                />
              </View>
            ) : props.EtapaCriar == 2 ? (
              <View style={styles.container}>
                <Text style={styles.headerLabel} >~{"\n"} Convidar amigos</Text>
                <Button
                  onPress={() => props.onPressProximaEtapa(2)}
                  title="Convidar Membros da viagem >"
                  color="#841584"
                  accessibilityLabel="Convidar Membros da viagem"
                />
              </View>
            ) : (
                  <MapView
                    style={styles.container}
                    initialRegion={{
                      latitude: props.cordenadas.coords.latitude,
                      longitude: props.cordenadas.coords.longitude,
                      latitudeDelta: 0.0923,
                      longitudeDelta: 0.0422,
                    }}
                  >
                    <MapView.Marker
                      image={require('./images/destino.png')}
                      coordinate={{
                        latitude: -20.553008,
                        longitude: -47.393225
                      }}
                      title={"Destino"}
                      description={"Destino da viagem"}
                    />
                    <MapView.Marker
                      key={-47.387291 + -20.593819 - 10}
                      image={require('./images/carro.png')}
                      coordinate={{
                        latitude: props.cordenadas.coords.latitude,
                        longitude: props.cordenadas.coords.longitude
                      }}

                      title='Você'
                      description='Seu veiculo'
                    />
                    <Marcadores arrayMaker={props.arrayMakers} />
                  </MapView>
                )}
          </View>
        ) : props.tela == 'home' ?
            (
              <View style={styles.container}>
                <Text style={styles.header}>Bem vindo:{props.name}</Text>
                <Image style={styles.image} source={{ uri: props.photoUrl }} />
              </View>
            )
            : props.tela == 'viagem' ?
              (
                <View>
                  <Text style={styles.headerTitle} >Ingressar ao Grupo</Text>
                  <Text style={styles.headerLabel} >~{"\n"} Para pingressar ao grupo existente, use o codigo do grupo fornecido pelo criador do mesmo</Text>
                  <TextInput id="IdGrupo" />
                  <Button
                    onPress={() => props.onPressCreateGrupo()}
                    title="Criar grupo"
                    color="#841584"
                    accessibilityLabel="Entrar no grupo"
                  />
                </View>
              )
              : (
                <View>
                  <Text style={styles.headerTitle} >Criar Grupo</Text>
                  <Button
                    onPress={() => props.onPressCreateGrupo()}
                    title="Criar grupo"
                    color="#841584"
                    accessibilityLabel="Precione para criar um novo grupo"
                  />
                </View>
              )
        }
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => props.handleClickFooter('home')}  >
          <Icon name="home" size={25} />
          <Text style={styles.tabTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => props.handleClickFooter('viagem')}    >
          <Icon name="navigation" size={25} />
          <Text style={styles.tabTitle}>Viagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => props.handleClickFooter('grupo')}    >
          <Icon name="group" size={25} />
          <Text style={styles.tabTitle}>Grupo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerLogin: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  navBar: {
    height: 55,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rightNav: {
    flexDirection: 'row'
  },
  navItem: {
    marginLeft: 25
  },
  body: {
    flex: 1
  },
  tabBar: {
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 0.5,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabTitle: {
    fontSize: 11,
    color: '#3c3c3c',
    paddingTop: 4
  },
  header: {
    fontSize: 25
  },
  headerTitle: {
    fontSize: 17
  },
  headerLabel: {
    fontSize: 15
  },
  ImageBackground: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }

})