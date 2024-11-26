import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import shortId from 'shortid';
import { nanoid } from 'nanoid';
import { COMMENT_ACTION } from '@/constants';

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

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const googleAuthProviderId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const { FieldValue } = firebase.firestore;
export const getTime = (...date) => (date
  ? firebase.firestore.Timestamp.fromDate(new Date(...date))
  : firebase.firestore.Timestamp.fromDate(new Date())
);
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

export const updateFeedbackLastAction = ({
  userId, feedbackId, actionType, createdAt,
}) => updateFeedback({
  feedbackId,
  path: `participants.${userId}.lastAction`,
  value: {
    createdAt: createdAt || getTime(),
    type: actionType,
  },
});

export const getFeedback = async (id) => {
  const feedback = await db.doc(`feedbacks/${id}`).get();
  return { id: feedback.id, ...feedback.data() };
};

export const addAction = async ({
  feedbackId, type, content, replies = [], authorUid, createdAt = getTime(),
}) => {
  const discussionRef = db.collection(`feedbacks/${feedbackId}/discussion`);
  updateFeedbackLastAction(
    {
      userId: authorUid, feedbackId, actionType: type, createdAt,
    },
  );
  return discussionRef.add({
    type,
    content: content.replace(/^\s+|\s+$/g, ''),
    replies,
    authorUid,
    createdAt,
  });
};

// TODO: rewrite argument as object
export const addCommentReply = async (feedbackId, commentId, content, authorUid) => {
  const reply = {
    id: shortId.generate(),
    authorUid,
    content: content.replace(/^\s+|\s+$/g, ''),
    createdAt: getTime(),
  };
  const commentRef = db.doc(`feedbacks/${feedbackId}/discussion/${commentId}`);
  updateFeedbackLastAction(
    { userId: authorUid, feedbackId, actionType: COMMENT_ACTION },
  );
  return commentRef.update({ replies: firebase.firestore.FieldValue.arrayUnion(reply) });
};

export const updateSeenAt = async (userId, feedbackId) => updateFeedback(
  { feedbackId, path: `participants.${userId}.seenAt`, value: getTime() },
);

export const createFeedback = async (feedbackData) => {
  const feedback = {
    createdAt: getTime(),
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
  if (!feedbackRequest.exists) {
    return null;
  }

  return { ...feedbackRequest.data(), id: feedbackRequest.id };
};

export const createFeedbackRequest = async ({ id = nanoid(10), data }) => {
  await Promise.all([
    db.collection('feedbackRequests').doc(id).set({
      createdAt: getTime(),
      ...data,
    }),
    db.collection('customUI').doc(auth.currentUser.uid).set({ sidebarFormsOrder: FieldValue.arrayUnion(id) }, { merge: true }),
  ]);

  return id;
};
export const deleteFeedbackRequest = (requestId) => Promise.all([
  db.collection('feedbackRequests').doc(requestId).delete(),
  db.collection('customUI').doc(auth.currentUser.uid).set({ sidebarFormsOrder: FieldValue.arrayRemove(requestId) }, { merge: true }),
]);

export const updateFeedbackRequest = (feedbackId, data) => db.doc(`feedbackRequests/${feedbackId}`).update(data);

// Custom UI
export const setCustomUI = ({ userId, key, value }) => db.collection('customUI').doc(userId).set({ [key]: value }, { merge: true });

// Klary support message
export const addSupportMessage = (message) => db.collection('contactUs').add({ uid: auth.currentUser.uid, message });
