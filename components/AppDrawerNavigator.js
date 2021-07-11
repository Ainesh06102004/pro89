import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer'; 
import {AppTabNavigator} from './AppTabNavigator.js'; 
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyBartersScreen from '../screens/MyBartersScreen';
import NotificationScreen from '../screens/NotificationScreen'
import MyReceivedItemScreen from '../screens/MyReceivedItemScreen'
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator,
        navigationOptions:{
            drawerIcon : <Icon name="home" type ="fontawesome5"/>
        }
    },
    MyBarters:{
        screen:MyBartersScreen,
        navigationOptions:{
            drawerIcon : <Icon name="gift" type ="font-awesome" />,
            drawerLabel : "My Barters"
          }
    },
    Notifications:{
        screen:NotificationScreen,
        navigationOptions:{
            drawerIcon : <Icon name="bell" type ="font-awesome" />,
            drawerLabel : "Notifications"
          }
    },
    MyReceivedBooks:{
        screen:MyReceivedItemScreen,
        navigationOptions:{
            drawerIcon : <Icon name="gift" type ="font-awesome" />,
            drawerLabel : "My Received Items"
          }
    },
    Setting:{
        screen:SettingScreen,
        navigationOptions:{
            drawerIcon : <Icon name="settings" type ="fontawesome5" />,
            drawerLabel : "Settings"
          }
    },
},
    {
        contentComponent:CustomSideBarMenu
    },
    {
        initialRouteName:"Home"
    }
);