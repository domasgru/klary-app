import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';
import { pureSpliceArrayStateMutation, bindFirestoreArrayRefAction } from '../utils/bindFirestoreRef';

export default {
  state: {
    receivedFeedbacks: null,
    sentFeedbacks: null,
    currentFeedback: null,
    currentFeedbackComments: null,
  },
  mutations: {
    setCurrentFeedback(state, value) {
      state.currentFeedback = value;
    },
    pureSpliceArrayStateMutation,
  },
  actions: {
    setCurrentFeedback({ commit }, value) {
      commit('setCurrentFeedback', value);
    },
    bindCurrentFeedback: firestoreAction(({ bindFirestoreRef }, feedbackId) => (
      bindFirestoreRef('currentFeedback', db.collection('feedbacks').doc(feedbackId))
    )),
    bindReceivedFeedbacks1: firestoreAction(({ bindFirestoreRef }, { userId, workspaceId }) => (
      bindFirestoreRef(
        'receivedFeedbacks',
        db.collection('feedbacks')
          .where('receiverId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindReceivedFeedbacks({ commit }, { userId, workspaceId }) {
      bindFirestoreArrayRefAction(
        commit,
       'receivedFeedbacks',
        db.collection('feedbacks')
          .where('receiverId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      );
    },
    bindSentFeedbacks: firestoreAction(({ bindFirestoreRef }, { userId, workspaceId }) => (
      bindFirestoreRef(
        'sentFeedbacks',
        db.collection('feedbacks')
          .where('authorId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindCurrentFeedbackComments: firestoreAction(({ bindFirestoreRef }, id) => (
      bindFirestoreRef('currentFeedbackComments', db.collection(`feedbacks/${id}/discussion`).orderBy('createdAt', 'asc'))
    )),
  },
};
