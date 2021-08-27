import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';
import {
  FEEDBACKS_COLLECTION, FEEDBACK_REQUESTS_COLLECTION, ACTIVE_STATE, REMOVED_STATE,
} from '@/constants/feedback';
import { bindFirestoreArrayRefMutations, bindFirestoreArrayRefAction } from '../utils/bindFirestoreRef';

export default {
  state: {
    // Sent and received has to have separate state, as firestore does not have logical OR opretator
    receivedFeedbacks: null,
    sentFeedbacks: null,
    removedFeedbacks: null,
    currentFeedbackActions: null,
    feedbackRequests: null,
  },
  getters: {
    allFeedbacks(state) {
      if (!state.receivedFeedbacks || !state.sentFeedbacks) {
        return null;
      }

      const allFeedbacks = [...state.receivedFeedbacks, ...state.sentFeedbacks];
      const uniqueAllFeedbacks = Array.from(new Set(allFeedbacks.map((f) => f.id)))
        .map((id) => allFeedbacks.find((f) => f.id === id));
      return uniqueAllFeedbacks;
    },
    receivedFeedbacks(state) {
      return state.receivedFeedbacks;
    },
    sentFeedbacks(state) {
      return state.sentFeedbacks;
    },
    favoritesFeedbacks(state, getters) {
      return getters.allFeedbacks;
    },
    removedFeedbacks(state, getters) {
      return state.removedFeedbacks;
    },
    orderedFeedbackRequests(state, getters, rootState) {
      if (rootState.user?.customUI?.sidebarFormsOrder) {
        return rootState.user.customUI.sidebarFormsOrder.map(
          (item) => state.feedbackRequests.find((request) => request.id === item),
        ).filter(((item) => !!item));
      }

      return state.feedbackRequests;
    },
  },
  mutations: {
    ...bindFirestoreArrayRefMutations,
  },
  actions: {
    bindReceivedFeedbacks({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
        'receivedFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where('receiverId', '==', userId)
          .where(`participants.${userId}.feedbackState`, '==', ACTIVE_STATE),
      );
    },
    bindSentFeedbacks({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
        'sentFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where('authorId', '==', userId)
          .where(`participants.${userId}.feedbackState`, '==', ACTIVE_STATE),
      );
    },
    bindAllFeedbacks({ dispatch }, { userId, workspaceId }) {
      return Promise.all([
        dispatch('bindReceivedFeedbacks', { userId }),
        dispatch('bindSentFeedbacks', { userId }),
      ]);
    },
    bindCurrentFeedbackActions({ commit }, id) {
      return bindFirestoreArrayRefAction(
        commit,
        'currentFeedbackActions',
        db.collection(`${FEEDBACKS_COLLECTION}/${id}/discussion`)
          .orderBy('createdAt', 'asc'),
      );
    },
    // Separate handling for removed feedabcks
    bindRemovedFeedbacks({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
        'removedFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where(`participants.${userId}.feedbackState`, '==', REMOVED_STATE),
      );
    },
    bindFeedbackRequests({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
        'feedbackRequests',
        db.collection(FEEDBACK_REQUESTS_COLLECTION)
          .where('uid', '==', userId)
          .orderBy('createdAt', 'asc'),
      );
    },
  },
};
