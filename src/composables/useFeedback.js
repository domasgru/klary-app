/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import {
 computed, ref, toRefs, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  RECEIVED_TYPE, SENT_TYPE, FAVORITE_TYPE, ARCHIVED_STATE, ACTIVE_STATUS, CLOSED_STATUS,
} from '@/constants/feedback';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import arraySort from 'array-sort';
import getObjectValue from 'get-value';
import { updateFeedback } from '@/firebase';

const validTypes = [RECEIVED_TYPE, SENT_TYPE, FAVORITE_TYPE, ARCHIVED_STATE];

export const useFeedbackList = (type) => {
  const store = useStore();
  const router = useRouter();
  const isLoading = ref(false);

  const isValidType = validTypes.includes(type);
  const currentUser = store.state.user.userData;
  const feedbacks = isValidType
    ? computed(() => store.getters[`feedback/${type.toLowerCase()}Feedbacks`])
    : computed(() => store.getters.allFeedbacks);

  const getFeedbackList = async () => {
    isLoading.value = true;
    await store.dispatch(
      'feedback/bindAllFeedbacks',
      { userId: store.state.user.userData.uid, workspaceId: store.state.workspace.currentWorkspace.id },
    );

    if (type === ARCHIVED_STATE) {
      await store.dispatch('feedback/bindArchivedFeedbacks', { userId: store.state.user.userData.uid });
    }
    isLoading.value = false;
  };

  if (!feedbacks.value) {
    getFeedbackList();
  }

  const compare = (prop, reverse = true) => {
    if (prop === 'isSeen') {
      return (a, b) => {
        const result = isFeedbackSeen(b, currentUser.uid) - isFeedbackSeen(a, currentUser.uid);
        return reverse ? result * -1 : result;
      };
    }

    return (a, b) => {
      a = getObjectValue(a, prop);
      b = getObjectValue(b, prop);
      let result;
      if (a < b) {
        result = -1;
      }
      if (a > b) {
        result = 1;
      }
      if (a === b) {
        return 0;
      }
      return reverse ? result * -1 : result;
    };
  };

  const getFilteredAndSortedFeedbacks = ({
    filterBy, filterValue, sortBy = 'createdAt.seconds', sortReverse = false,
  }) => computed(() => {
    let preparedFeedbacks = null;

    if (filterBy && filterValue) {
      preparedFeedbacks = feedbacks.value.filter((feedback) => {
        const valueToFilter = getObjectValue(feedback, filterBy);
        if (Array.isArray(valueToFilter)) {
          return valueToFilter.includes(filterValue);
        }

        return valueToFilter === filterValue;
      });
    }
    if (sortBy) {
      preparedFeedbacks = arraySort(preparedFeedbacks, compare('isSeen'), compare(sortBy));
    }

    return preparedFeedbacks;
  });
  const openFeedback = (id) => router.push({ path: `/workspace/${type.toLowerCase()}/feedback/${id}` });

  return {
    feedbacks, isLoading, getFilteredAndSortedFeedbacks, openFeedback,
  };
};

export const useFeedbackData = (feedbackData) => {
  const store = useStore();
  const userData = computed(() => store.state.user.userData);
  const feedbackFlags = computed(() => feedbackData.value.participants[userData.value.uid]?.flags);
  const feedbackId = computed(() => feedbackData.value.id);

  const toggleFeedbackFlag = (flag) => {
    const updatedFlags = feedbackFlags.value.includes(flag)
        ? feedbackFlags.value.filter((feedbackFlag) => feedbackFlag !== flag)
        : [...feedbackFlags.value, flag];

    return updateFeedback({
      feedbackId: feedbackId.value,
      path: `participants.${userData.value.uid}.flags`,
      value: updatedFlags,
    });
  };
  const updateFeedbackStatus = (status) => updateFeedback({
    feedbackId: feedbackId.value,
    path: 'status',
    value: status,
  });
  const updateFeedbackState = (state) => updateFeedback({
      feedbackId: feedbackId.value,
      path: `participants.${userData.value.uid}.feedbackState`,
      value: state,
  });

  return {
    feedbackFlags,
    isFeedbackClosed: computed(() => feedbackData.value?.status === CLOSED_STATUS),
    isFeedbackFavorite: computed(() => feedbackFlags.value.includes(FAVORITE_TYPE)),
    isFeedbackArchived: computed(() => feedbackData.value.participants[userData.value.uid]?.feedbackState === ARCHIVED_STATE),
    isFeedbackSent: computed(() => feedbackData.value.authorId === userData.value.uid),
    isFeedbackLastActionSeen: computed(() => isFeedbackSeen(feedbackData.value, userData.value.uid)),
    toggleFeedbackFlag,
    updateFeedbackStatus,
    updateFeedbackState,
  };
};
