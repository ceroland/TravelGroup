import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Button, Platform,
  TouchableOpacity,
  FlatList
} from "react-native"
import { androidClientId } from "./superSecretKey"
import Expo from "expo"
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: ""
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
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.signedIn ? (

          <LoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} />

        ) : (
            <View style={styles.containerLogin}>
              <LoginPage signIn={this.signIn} />
            </View>
          )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Login</Text>
      <Button title="Logar com o Google" onPress={() => props.signIn()} />
    </View>
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
        <FlatList
          // data={data.items}
          // renderItem={(video)=><VideoItem video={video.item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: '#E5E5E5' }} />}

        />
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={25} />
          <Text style={styles.tabTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="navigation" size={25} />
          <Text style={styles.tabTitle}>Viagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
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
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }

})
