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

export const auth = firebase.auth();
export const db = firebase.firestore();
export const { FieldValue } = firebase.firestore;
export const login = (email, redirectToPage = '') => {
  const actionCodeSettings = {
    url: redirectToPage ? `${window.location.origin}${redirectToPage}` : window.location.href,
    handleCodeInApp: true,
  };

  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const logout = () => firebase.auth().signOut();

export const getCurrentUser = () => new Promise((resolve, reject) => {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    unsubscribe();
    resolve(user);
  }, reject);
});
export const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userDocument = await db.collection('users').doc(uid).get();
    return userDocument.data();
  } catch (error) {
    console.error('Failed to get user document', error);
    return null;
  }
};
export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return null;

  const userRef = db.doc(`users/${user.uid}`);

  const userData = await userRef.get();
  if (!userData.exists) {
    const userToSet = {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
      ...additionalData,
    };
    try {
      await userRef.set(userToSet);
      return userToSet;
    } catch (error) {
      console.error('Failed to create user document', error);
    }
  }
  return getUserDocument(user.uid);
};
export const updateUserProfileDocument = async (uid, userData) => {
  db.collection('users').doc(uid).update({
    ...userData,
  });
};
export const getUserWorkspaces = async (userId) => (await db.collection('workspaces').where('team', 'array-contains', userId).get())
  .docs.map((doc) => doc.data());

export const getWorkspace = async (workspaceId) => (await db.doc(`workspaces/${workspaceId}`).get()).data();
