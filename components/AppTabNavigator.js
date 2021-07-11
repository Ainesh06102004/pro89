import * as React from "react";
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import ExchangeScreen from '../screens/ExchangeScreen';
import { AppStackNavigator } from './AppStackNavigator'

export const AppTabNavigator = createBottomTabNavigator({
    Exchange :{
        screen:AppStackNavigator,
        navigationOptions:{
            tabBarLabel:'Exchange Item'
        }
    },
    AddItem:{
        screen:ExchangeScreen,
        navigationOptions:{
            tabBarLabel:'Add Item'
        }
    },    
})