import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Button, Platform, TextInput,
  TouchableOpacity,ImageBackground,
  FlatList, Alert,Image 
} from "react-native"
import { androidClientId } from "./superSecretKey"
import { googleMapsApi } from "./superSecretKey"
import Expo from "expo"
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

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
      destino: ""
    }
    // this.handleClickFooter = this.handleClickFooter.bind(this,"");
    // this.teste = this.teste.bind(this);
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
      //Geocoder.init(googleMapsApi);
      Geocoder.fallbackToGoogle(googleMapsApi);

      // Geocoder.from(this.state.destino).then(
      //   json => {
      //     let location = json.results[0].geometry.location;
      //     alert(location.lat + ", " + location.lng);
      //   }, 
      //   error => {
      //     console.log("error", e)
      //   }
      // ); 
      Geocoder.geocodeAddress('New York').then(res => {
        alert(location.lat + ", " + location.lng);
      })
        .catch(err => console.log(err))

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
            onPressBuscaLongetudeLatidePorNome={this.onPressBuscaLongetudeLatidePorNome} />
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
        <Button title="Logar com o Google" onPress={() => props.signIn()} />
      </ImageBackground>
  )
}

const LoggedInPage = props => {
  return (
    // <View style={styles.container}>
    //   <Text style={styles.header}>Bem vindo:{props.name}</Text>
    //   <Image style={styles.image} source={{ uri: props.photoUrl }} />
    // </View>
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
            <Text style={styles.headerTitle} >Informe o Destino</Text>
            <Text style={styles.headerLabel} >~{"\n"} Informe a cidade de destino da viagem</Text>
            <TextInput value={props.destino} onChangeText={(text) => props.onChangeTextDestino(text)} />
            <Button
              onPress={() => props.onPressBuscaLongetudeLatidePorNome()}
              title="Proxima etapa"
              color="#841584"
              accessibilityLabel="Proxima Etapa"
            />
             <GooglePlacesInput signIn={this.signIn} />
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

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={3} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      
      getDefaultValue={() => ''}
      
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyDKaWvJamhgtX7lJ11QwgOAV7RvOavTKj0',
        language: 'pt', // language of the results
        types: '(cities)' // default: 'geocode'
      }}
      
      styles={{
        textInputContainer: {
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        }
      }}
      
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        types: 'food'
      }}

      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={[homePlace, workPlace]}

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
      renderRightButton={() => <Text>Custom text after the input</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerLogin: {
    flex: 1,
    backgroundColor: "#fff",
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