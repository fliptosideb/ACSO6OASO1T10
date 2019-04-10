// Initialize Firebase
var config = {
    apiKey: "AIzaSyCbPutO4jNX4dyzzK9WJ-w2h06hYSMf-kg",
    authDomain: "day-out-7bc8d.firebaseapp.com",
    databaseURL: "https://day-out-7bc8d.firebaseio.com",
    projectId: "day-out-7bc8d",
    storageBucket: "day-out-7bc8d.appspot.com",
    messagingSenderId: "855448935871"
  };
  firebase.initializeApp(config);
  
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: 'planner.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: 'https://www.google.com/',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
      window.location.assign('https://www.google.com/');
    }
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#login', uiConfig);
