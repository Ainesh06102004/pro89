import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {Avatar} from 'react-native-elements';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import db from '../config';
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class CustomSideBarMenu extends React.Component{
    state = {
      userId: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docId: "",
    }

    selectPicture = async () => {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!cancelled) {
        this.setState({
          image:uri
        })
        this.uploadImage(uri, this.state.userId);
      }
    }

    uploadImage = async (uri, imageName) => {
      var response = await fetch(uri)
      var blob = await response.blob()
      var ref = firebase.storage().ref().child("user_profiles" + imageName)
      return ref.put(blob).then((response) => {
        this.fetchImage(imageName);
      })
    }

    fetchImage = (imageName) => {
      var storageRef = firebase.storage().ref().child("user_profiles" + imageName)
      storageRef.getDownloadURL().then((url) => {
          this.setState({
             image: url,
          })
        })
        .catch((error) => {
          this.setState({
             image: "#" 
          })
        })
    }

    getUserProfile() {
      db.collection("users")
        .where("user_name", "==", this.state.userId)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.setState({
              name: doc.data().first_name + " " + doc.data().last_name,
              docId: doc.id,
              image: doc.data().image,
            });
          });
        });
    }

    componentDidMount() {
      this.fetchImage(this.state.userId);
      this.getUserProfile();
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:0.4, alignItems:"center", backgroundColor:"#d61a3c"}}>
                  <Avatar 
                    rounded
                    source={{uri:this.state.image}}
                    size={'xlarge'}
                    onPress={()=>{
                      this.selectPicture()
                    }}
                    containerStyle={styles.imageContainer}
                    showEditButton/>
                    <Text style={{fontWeight:"400", fontSize: RFValue(20), marginTop:5, marginLeft: -10, padding: RFValue(10)}}>
                      {this.state.name}
                    </Text>
                </View>

                <View style={{ flex: 0.6 }}>
                    <DrawerItems {...this.props}/>
                </View>

                <View style={{ flex: 0.1 }}>
                  <TouchableOpacity 
                   style={{
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    }}

                    onPress={()=>{
                      this.props.navigation.navigate('SignUpAndLoginScreen')
                      firebase.auth().signOut()
                    }}>

                    <Icon
                      name="logout"
                      type="antdesign"
                      size={RFValue(18)}
                      iconStyle={{ paddingLeft: RFValue(10) }}
                    />

                    <Text
                      style={{
                        fontSize: RFValue(15),
                        fontWeight: "bold",
                        marginLeft: RFValue(30),
                      }}
                    >
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container : {
      flex:1
    },
    drawerItemsContainer:{
      flex:0.8
    },
    logOutContainer : {
      flex:0.2,
      justifyContent:'flex-end',
      paddingBottom:30
    },
    logOutButton : {
      height:30,
      width:'100%',
      justifyContent:'center',
      padding:10
    },
    logOutText:{
      fontSize: 30,
      fontWeight:'bold'
    },
    imageContainer:{ 
      marginTop: 40
    },
  })