import * as firebase from 'firebase';

require("@firebase/firestore")

  var firebaseConfig = {
    apiKey: "AIzaSyBW8lEbuLWnPRVaYZDejmJGLjaLX1yNYYE",
    authDomain: "barter-system-app-ad395.firebaseapp.com",
    databaseURL: "https://barter-system-app-ad395.firebaseio.com",
    projectId: "barter-system-app-ad395",
    storageBucket: "barter-system-app-ad395.appspot.com",
    messagingSenderId: "414720702401",
    appId: "1:414720702401:web:ec080a5c6da6f3706ea140"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()