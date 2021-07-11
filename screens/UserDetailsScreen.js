import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class UserDetailsScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username        : firebase.auth().currentUser.email,
      receiverId      : this.props.navigation.getParam('details')["user_name"],
      exchangeId       : this.props.navigation.getParam('details')["exchange_id"],
      itemName        : this.props.navigation.getParam('details')["item_name"],
      description  : this.props.navigation.getParam('details')["description"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : '',
      userName : '',
    }
  }

getRecieverDetails(){
  db.collection('users').where('user_name','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().first_name,
        recieverContact : doc.data().contact,
        recieverAddress : doc.data().address,
      })
    })
  });

  db.collection('exchange_requests').where('exchangeId','==',this.state.exchangeId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateBarterStatus=()=>{
  db.collection('all_Barters').add({
    item_name           : this.state.itemName,
    exchange_id          : this.state.exchangeId,
    requested_by        : this.state.recieverName,
    donor_id            : this.state.username,
    request_status      :  "Person Interested"
  })
}

getUserDetails=(username)=>{
  db.collection("users").where('user_name','==', username).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      console.log(doc.data().first_name);
      this.setState({
        userName  :doc.data().first_name + " " + doc.data().last_name
      })
    })
  })
}



componentDidMount(){
  this.getRecieverDetails()
  this.getUserDetails(this.state.username)
}

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
        <Header
            leftComponent={<Icon name="arrow-left" type="feather"
            color="black" onPress={()=>this.props.navigation.goBack()}/>}
            centerComponent={{text:"Exchange",
            style:{color:"black", fontSize:23,fontWeight:'bold'}}}
            backgroundColor={"#d61a3c"}
        />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Descripition : {this.state.description}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.receiverId !== this.state.username
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBarterStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyBarters')
                  }}>
                <Text style={{fontSize:20, fontWeight:'500'}}>I Want To Exchange</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:"28%",
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 20,
    backgroundColor: '#d61a3c',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})