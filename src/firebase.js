import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import shortId from 'shortid';
import { COMMENT_ACTION } from '@/constants';

const firebaseConfig = {
  apiKey: 'AIzaSyAFS8RVfGHghmSagIJ3FDRVcYTWaPCGMMw',
  authDomain: 'login.kuriapp.com',
  databaseURL: 'https://feedback-2263b.firebaseio.com',
  projectId: 'feedback-2263b',
  storageBucket: 'feedback-2263b.appspot.com',
  messagingSenderId: '38331897250',
  appId: '1:38331897250:web:b391be3a9581eb27b70efb',
  measurementId: 'G-STRL62FGP9',
};
firebase.initializeApp(firebaseConfig);

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const googleAuthProviderId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const { FieldValue } = firebase.firestore;
export const getTimeNow = () => firebase.firestore.Timestamp.fromDate(new Date());
export const loginWithGoogle = () => auth.signInWithPopup(googleAuthProvider);
export const login = (email, redirectToPage = '') => {
  const actionCodeSettings = {
    url: redirectToPage ? `${window?.location.origin}${redirectToPage}` : window?.location.href,
    handleCodeInApp: true,
  };

  auth.sendSignInLinkToEmail(email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const logout = async () => auth.signOut();

export const getCurrentUser = () => new Promise((resolve, reject) => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
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
export const updateUserProfileDocument = (uid, userData) => db.collection('users').doc(uid).update({
    ...userData,
  });

// Feedback
export const updateFeedback = ({ feedbackId, path, value }) => db.collection('feedbacks').doc(feedbackId).update({ [path]: value });
export const updateFeedbackLastAction = ({ userId, feedbackId, actionType }) => updateFeedback({
    feedbackId,
    path: `participants.${userId}.lastAction`,
    value: {
      createdAt: getTimeNow(),
      type: actionType,
    },
  });
export const getFeedback = async (id) => {
  const feedback = await db.doc(`feedbacks/${id}`).get();
  return { id: feedback.id, ...feedback.data() };
};

export const addAction = async (feedbackId, type, content, authorUid) => {
  const comment = {
    type,
    content: content.replace(/^\s+|\s+$/g, ''),
    authorUid,
    createdAt: getTimeNow(),
  };
  const discussionRef = db.collection(`feedbacks/${feedbackId}/discussion`);
  updateFeedbackLastAction(
    { userId: authorUid, feedbackId, actionType: type },
  );
  return discussionRef.add(comment);
};

export const addCommentReply = async (feedbackId, commentId, content, authorUid) => {
  const reply = {
    id: shortId.generate(),
    authorUid,
    content: content.replace(/^\s+|\s+$/g, ''),
    createdAt: getTimeNow(),
  };
  const commentRef = db.doc(`feedbacks/${feedbackId}/discussion/${commentId}`);
  updateFeedbackLastAction(
    { userId: authorUid, feedbackId, actionType: COMMENT_ACTION },
  );
  return commentRef.update({ replies: firebase.firestore.FieldValue.arrayUnion(reply) });
};

export const updateSeenAt = async (userId, feedbackId) => updateFeedback(
  { feedbackId, path: `participants.${userId}.seenAt`, value: getTimeNow() },
);

export const createFeedback = async (feedbackData) => {
  const feedback = {
    createdAt: getTimeNow(),
    ...feedbackData,
  };
  const feedbackRef = db.collection('feedbacks');
  return feedbackRef.add(feedback);
};

// Feedback request
export const getFeedbackRequest = async (uid) => {
  const feedbackRequest = await db.collection('feedbackRequests').where('uid', '==', uid).get();
  if (feedbackRequest.docs[0]) {
    return { ...feedbackRequest.docs[0].data(), id: feedbackRequest.docs[0].id };
  }
    return null;
};
export const getFeedbackRequestById = async (id) => {
  const feedbackRequest = await db.doc(`feedbackRequests/${id}`).get();
  return { ...feedbackRequest.data(), id: feedbackRequest.id };
};

export const createFeedbackRequest = (id, requestData) => {
  const feedbackRequest = {
    createdAt: getTimeNow(),
    ...requestData,
  };
  return db.collection('feedbackRequests').doc(id).set(feedbackRequest);
};
export const deleteFeedbackRequest = (requestId) => db.collection('feedbackRequests').doc(requestId).delete();

export const updateFeedbackRequest = (feedbackId, data) => db.doc(`feedbackRequests/${feedbackId}`).update(data);
