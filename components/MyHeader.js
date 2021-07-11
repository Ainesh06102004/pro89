import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert, SnapshotViewIOS} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class MyHeader extends React.Component{

  constructor(props){
    super(props)
    this.state={
      value : '',
    }
  }
  
  getNumberOfUnreadNotifications=()=>{
    db.collection("all_notifications")
    .where('notification_status','==', "unread")
    .where("targeted_user_id", "==", firebase.auth().currentUser.email)
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map(doc => doc.data())
      this.setState({
        value:unreadNotifications.length
      })
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='bell' type="font-awesome" color="black" size={25} 
          onPress={()=>{
            this.props.navigation.navigate('Notifications')
          }}/>
        <Badge 
          value={this.state.value}
          containerStyle={{position:'absolute', top: -4, right: -4}}
          />
      </View>
    );
  }

  render(){
    return(
      <Header
        leftComponent={<Icon name="bars" type='font-awesome' color='black'
          onPress={()=>{
            this.props.navigation.toggleDrawer()
          }}/>}
        centerComponent={{ text: this.props.title, 
          style: { color: 'black', fontSize:23,fontWeight:"bold", } }}
        rightComponent={<this.BellIconWithBadge {...this.props}/>}
        backgroundColor = "#d61a3c"
    />
    );
  }
}