import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
    super()
    this.state = {
        username: firebase.auth().currentUser.email,
        allBarters : [],
        donorName : '',
    }
    this.requestRef= null
    }


    getAllBarters =()=>{
      this.requestRef = db.collection("all_Barters")
      .where("donor_id" ,'==', this.state.username)
      .onSnapshot((snapshot)=>{
        var allBarters = []
         snapshot.docs.map((doc)=>{
           var barters = doc.data()
           barters['doc_id'] = doc.id
           allBarters.push(barters)
         })
        this.setState({
          allBarters : allBarters,
        });
      })
    }

   getDonorDetais =(username)=>{
    db.collection('users').where("user_name", "==",username).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          donorName:doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
   }

   sendItem = (itemDetails) => {
    if (itemDetails.request_status === "Item Sent"){
      var requestStatus = "Person Intersted"
      db.collection('all_Barters').doc(itemDetails.doc_id).update({
        request_status:"Person Interested"
      })
      this.sendNotification(itemDetails, requestStatus)
    }

    else{
      var requestStatus = "Item Sent"
      db.collection('all_Barters').doc(itemDetails.doc_id).update({
        request_status:"Item Sent"
      })
      this.sendNotification(itemDetails, requestStatus)
    }
   }

   sendNotification =(itemDetails, requestStatus) => {
     var exchangeId = itemDetails.exchange_id
     var userName = itemDetails.donor_id 
     db.collection("all_notifications")
     .where('exchange_id',"==", exchangeId)
     .where('donor_id','==',userName).get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         if(requestStatus === "Item Sent"){
           message = this.state.donorName + " Sent You The Item"
         }
         else{
          message = this.state.donorName + " Has Shown Interest In Exchanging The Item"
         }
         db.collection('all_notifications').doc(doc.id).update({
           message : message,
           notification_status : "unread",
           date : firebase.firestore.FieldValue.serverTimestamp()
         })
       })
     })  
    }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
        <TouchableOpacity 
          style={[
            styles.button,
            {
              backgroundColor : item.request_status === "Item Sent" ? "green" : "#ff5722"
            }
          ]}
          onPress={()=>{
            this.sendItem(item)
          }}
          >
         <Text style={{color:'white'}}>
           {item.request_status === "Item Sent" ? "Item Sent" : "Send Item"}
         </Text>
       </TouchableOpacity>
         }
       bottomDivider
     />
   )

   componentDidMount(){
    this.getDonorDetais(this.state.username)
    this.getAllBarters()
   } 

   componentWillUnmount(){
    this.requestRef();
  }


   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})