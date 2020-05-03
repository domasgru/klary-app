import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAFS8RVfGHghmSagIJ3FDRVcYTWaPCGMMw',
  authDomain: 'feedback-2263b.firebaseapp.com',
  databaseURL: 'https://feedback-2263b.firebaseio.com',
  projectId: 'feedback-2263b',
  storageBucket: 'feedback-2263b.appspot.com',
  messagingSenderId: '38331897250',
  appId: '1:38331897250:web:b391be3a9581eb27b70efb',
  measurementId: 'G-STRL62FGP9',
};
firebase.initializeApp(firebaseConfig);

// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then((result) => {
      window.localStorage.removeItem('emailForSignIn');
      const { user } = result;
      if (result.additionalUserInfo.isNewUser) {
        firebase.firestore().collection('users').doc(user.uid).set({
          email: user.email,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export default {
  auth: firebase.auth(),
  db: firebase.firestore(),
  login(email, redirectToPage = '') {
    const actionCodeSettings = {
      url: `http://localhost:8080${redirectToPage}`,
      handleCodeInApp: true,
    };

    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  logout() {
    firebase.auth().signOut();
  },
};
