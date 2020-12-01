/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  RECEIVED_TYPE, SENT_TYPE, FAVORITE_TYPE, ARCHIVED_STATE,
} from '@/constants/feedback';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import arraySort from 'array-sort';
import getObjectValue from 'get-value';

const validTypes = [RECEIVED_TYPE, SENT_TYPE, FAVORITE_TYPE, ARCHIVED_STATE];

export const useFeedbackList = (type) => {
  const store = useStore();
  const router = useRouter();
  const isLoading = ref(false);

  const isValidType = validTypes.includes(type);
  const currentUser = store.state.user.userData;
  const feedbacks = isValidType
    ? computed(() => store.getters[`feedback/${type}Feedbacks`])
    : computed(() => store.getters.allFeedbacks);

  const getFeedbackList = async () => {
    isLoading.value = true;
    await store.dispatch(
      'feedback/bindAllFeedbacks',
      { userId: store.state.user.userData.uid, workspaceId: store.state.workspace.currentWorkspace.id },
    );
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
      preparedFeedbacks = feedbacks.value.filter((feedback) => feedback[filterBy] === filterValue);
    }
    if (sortBy) {
      preparedFeedbacks = arraySort(preparedFeedbacks, compare('isSeen'), compare(sortBy));
    }

    return preparedFeedbacks;
  });
  const openFeedback = (id) => router.push({ path: `/workspace/${type}/feedback/${id}` });

  return {
    feedbacks, isLoading, getFilteredAndSortedFeedbacks, openFeedback,
  };
};
