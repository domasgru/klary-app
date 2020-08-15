import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import shortId from 'shortid';

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
export const updateUserProfileDocument = async (uid, userData) => {
  db.collection('users').doc(uid).update({
    ...userData,
  });
};

// Workspace
export const getUserWorkspaces = async (userId) => (await db.collection('workspaces').where('team', 'array-contains', userId).get())
  .docs.map((doc) => ({ id: doc.id, ...doc.data() }));

export const getInvitedWorkspaces = async (userEmail) => (await db.collection('workspaces').where('invited', 'array-contains', userEmail).get())
  .docs.map((doc) => ({ id: doc.id, ...doc.data() }));

export const createWorkspace = async (userId, workspaceName) => {
  const workspaceRef = await db.collection('workspaces').add({
    name: workspaceName,
    team: [userId],
  });
  await db.collection('workspaces').doc(workspaceRef.id).collection('roles').doc(userId)
    .set({
      role: 'admin',
    });
  return {
    id: workspaceRef.id,
    data: (await workspaceRef.get()).data(),
  };
};
export const getWorkspace = async (id) => {
  const workspaceRef = db.doc(`workspaces/${id}`);
  return { id: workspaceRef.id, ...(await workspaceRef.get()).data() };
};


// Feedback
export const getFeedback = async (id) => {
  const feedback = await db.doc(`feedbacks/${id}`).get();
  return { id: feedback.id, ...feedback.data() };
};

export const addComment = async (feedbackId, content, author) => {
  const comment = {
    content,
    author: {
      name: author.name,
      uid: author.uid,
    },
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
  };
  const discussionRef = db.collection(`feedbacks/${feedbackId}/discussion`);
  return discussionRef.add(comment);
};

export const addCommentReply = async (feedbackId, commentId, content, author) => {
  const reply = {
    id: shortId.generate(),
    author: {
      name: author.name,
      uid: author.uid,
    },
    content,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
  };
  const commentRef = db.doc(`feedbacks/${feedbackId}/discussion/${commentId}`);
  return commentRef.update({ replies: firebase.firestore.FieldValue.arrayUnion(reply) });
};

export const createFeedbackRequest = async (requestData) => {
  const feedbackRequest = {
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    ...requestData,
  };
  const requestRef = db.collection('feedbackRequests');
  return requestRef.add(feedbackRequest);
};

export const createFeedback = async (feedbackData) => {
  const timeNow = firebase.firestore.Timestamp.fromDate(new Date());
  const feedback = {
    createdAt: timeNow,
    ...feedbackData,
    author: { name: feedbackData.author.name, seenAt: timeNow, lastAction: { type: 'CREATE', createdAt: timeNow } },
    receiver: { name: feedbackData.receiver.name, seenAt: null, lastAction: { type: '', createdAt: null } },
  };
  const feedbackRef = db.collection('feedbacks');
  return feedbackRef.add(feedback);
};
