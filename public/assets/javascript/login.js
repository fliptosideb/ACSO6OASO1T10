const config = {
  apiKey: "AIzaSyCbPutO4jNX4dyzzK9WJ-w2h06hYSMf-kg",
  authDomain: "day-out-7bc8d.firebaseapp.com",
  databaseURL: "https://day-out-7bc8d.firebaseio.com",
  projectId: "day-out-7bc8d",
  storageBucket: "day-out-7bc8d.appspot.com",
  messagingSenderId: "855448935871"
}

firebase.initializeApp(config)

const uiConfig = {
  signInSuccessUrl: 'planner.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],

  tosUrl: 'https://www.google.com/',
  privacyPolicyUrl: function() {
    window.location.assign('https://www.google.com/');
  }
}

const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#login', uiConfig)
