import * as React from 'react';
import {Text,View,TouchableOpacity, StyleSheet, Alert} from 'react-native';
import SignUpAndLoginScreen from './screens/SignUpAndLoginScreen.js';
import {AppTabNavigator} from './components/AppTabNavigator';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    );
  }
}

const switchNavigator = createSwitchNavigator({
  SignUpAndLoginScreen:{screen:SignUpAndLoginScreen},
  Drawer:{screen:AppDrawerNavigator},
})

const AppContainer = createAppContainer(switchNavigator);