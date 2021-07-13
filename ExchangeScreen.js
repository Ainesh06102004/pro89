import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    Image}
from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";
import{Card,Header,Icon} from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context'


export default class BookRequestScreen extends React.Component{
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            itemName:'',
            description:'',
            IsItemRequestActive:'',
            requestedItemName:'',
            itemStatus:'',
            exchangeId:'',
            userDocId:'',
            docId:'',
            itemValue:"",
            currencyCode:""

        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    addItem = async (itemName,description,itemValue)=>{
        var userId = this.state.userId
        var randomExchangeId = this.createUniqueId();
        
        db.collection('exchange_requests').add({
            'user_name':userId,
            'item_name':itemName,
            'description':description,
            "exchange_id"  : randomExchangeId,
            "item_status" : "requested",
            "item_value"  : itemValue,
            "date"       : firebase.firestore.FieldValue.serverTimestamp()
        })
        await this.getItemRequest()
        db.collection('users').where("user_name","==",userId).get()
        .then()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    IsItemRequestActive: true
                })
            })
        })

        this.setState({
            itemName:'',
            description:'',
            exchangeId:randomExchangeId,
            itemValue : ''
        })

        return Alert.alert(
            'Item Ready To Exchange',
            '',
            [
                {text: 'OK', onPress: () => {
                    this.props.navigation.navigate('BarterList')
                }}
            ]
        );
    }

    receivedItem=(itemName)=>{
        var userId = this.state.userId
        var exchangeId = this.state.exchangeId
        db.collection('received_items').add({
            user_name: userId,
            item_name:itemName,
            exchange_id  : exchangeId,
            item_status  : "received",
    
        })
    }

    getIsItemRequestActive(){
        db.collection('users') 
        .where('user_name','==',this.state.userId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.setState({
              IsItemRequestActive:doc.data().IsItemRequestActive,
              userDocId : doc.id,
              currencyCode: doc.data().currency_code
            })
          })
        })
      }
    
    getItemRequest =()=>{
        var exchangeRequest =  db.collection('exchange_requests')
        .where('user_name','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().item_status !== "received"){
                    this.setState({
                        exchangeId : doc.data().exchange_id,
                        requestedItemName: doc.data().item_name,
                        itemStatus:doc.data().item_status,
                        docId     : doc.id,
                        itemValue : doc.data().item_value,
                    })
                }
          })
        })
    }
    
    sendNotification=()=>{
        db.collection('users').where('user_name','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().first_name
                var lastName = doc.data().last_name
                db.collection('all_notifications').where('exchange_Id','==',this.state.exchangeId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc) => {
                        var donorId  = doc.data().donor_id
                        var itemName =  doc.data().item_name
                        db.collection('all_notifications').add({
                            targeted_user_id : donorId,
                            message : name +" " + lastName +" " + " received the item " + itemName ,
                            notification_status : "unread",
                            item_name : itemName
                        })
                    })
                })
            })
        })
    }


    getData(){
        fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
        .then(response=>{
          return response.json();
        }).then(responseData =>{
          var currencyCode = this.state.currencyCode
          var currency = responseData.rates.INR
          var value =  69 / currency
          console.log(value);
        })
        }
    
    componentDidMount(){
        this.getItemRequest()
        this.getIsItemRequestActive()
        this.getData()
    }
    
    updateItemRequestStatus=()=>{
        db.collection('exchange_requests').doc(this.state.docId).update({
            item_status : 'recieved',
        })
        db.collection('users').where('user_name','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                IsItemRequestActive: false
                })
            })
        })
    
    }
    
    render(){
        if (this.state.IsItemRequestActive === true){
            return(<SafeAreaProvider>
                <View style={{ flex: 1}}>
                    <View
                        style={{
                        flex: 0.1,
                        }}>
                        <MyHeader title="Item Status" navigation={this.props.navigation} />
                        
                        <View style={{marginTop:15}}>
                            <Card
                                title={"Item Information"}
                                titleStyle= {{fontSize :RFValue (14),fontWeight:'600'}}>
                                <Card >
                                    <Text style={{fontSize:RFValue(11),fontWeight:'500'}}>Item Name :  {this.state.requestedItemName}</Text>
                                </Card>
                                <Card >
                                    <Text style={{fontSize:RFValue(11),fontWeight:'500'}}>Item Value :  {this.state.itemValue}</Text>
                                </Card>
                                <Card >
                                    <Text style={{fontSize:RFValue(11),fontWeight:'500'}}>Item Status :  {this.state.itemStatus}</Text>
                                </Card>
                            </Card>
                        <View/>
                        
                        <View
                            style={styles.buttonView}>
                            
                            <TouchableOpacity
                            style={[styles.button,{marginLeft:36}]}
                            onPress={() => {
                                this.sendNotification();
                                this.updateItemRequestStatus();
                                this.receivedItem(this.state.requestedItemName);
                            }}
                            >
                            <Text
                                style={[styles.buttontxt,{fontSize:RFValue(12), }]}
                            >
                                Item Recived
                            </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                       
                </View>
            </View>
            </SafeAreaProvider>)
        }
        else{
            return(<SafeAreaProvider>
                <View style={{flex:1}}>
                    <MyHeader title = "Add Item"  navigation = {this.props.navigation}/>
                    <KeyboardAvoidingView style={styles.keyBoardStyle}>
                        <TextInput
                            style={styles.formTextInput}
                            placeholder='Item Name'
                            onChangeText={(text)=>{
                                this.setState({itemName:text})
                            }}
                            value = {this.state.itemName}
                        />

                        <TextInput
                            style={[styles.formTextInput,{height:300,}]}
                            multiline
                            numberOfLines = {8} 
                            placeholder='Descripition'
                            onChangeText={(text)=>{
                                this.setState({description:text})
                            }}
                            value = {this.state.description}
                        />

                        <TextInput
                            style={styles.formTextInput}
                            placeholder ={"Item Value"}
                            maxLength ={8}
                            onChangeText={(text)=>{
                                this.setState({
                                    itemValue: text
                                })
                            }}
                            value={this.state.itemValue}
                        />

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={()=>{
                                this.addItem(this.state.itemName,this.state.description,this.state.itemValue)
                            }}>
                            <Text style={{color: "black", fontSize:18, fontWeight:"bold"}}>Add Item</Text>
                        </TouchableOpacity>   
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaProvider>);
        }
    }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "80%",
    height: RFValue(35),
    borderWidth: 1.4,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
    
  },
  requestedbookName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    fontWeight: "bold",
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  bookstatus:{
    marginLeft:RFValue(275),
    padding: RFValue(10),
    fontSize: RFValue(14),
    fontWeight: "500",
    marginTop: RFValue(50),
    borderWidth: 1.4,
    marginRight:RFValue(250)
  },
  buttonView:{
    flex: 0.2,
    marginTop:50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "black",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "black",
  },
  button: {
    marginTop:50,
    width: "20%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(18),
    backgroundColor: "#d61a3c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});
