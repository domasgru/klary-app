/* eslint-disable import/prefer-default-export */
import { getCurrentInstance, computed, ref } from '@vue/composition-api';
import { capitalize } from '@/utils/stringUtils';

export const useFeedbackList = (type) => {
  const { $store, $router } = getCurrentInstance();
  const isLoading = ref(false);
  const feedbacks = computed(() => $store.state.feedback[`${type}Feedbacks`]);


  const getFeedbackList = async () => {
    isLoading.value = true;
    await $store.dispatch(`feedback/bind${capitalize(type)}Feedbacks`,
    { userId: $store.state.user.userData.uid, workspaceId: $store.state.workspace.currentWorkspace.id });
    isLoading.value = false;
  };

  if (!feedbacks.value) {
    getFeedbackList();
  }

  const openFeedback = (id) => $router.push({ path: `/workspace/${type}/feedback/${id}` });

  return { feedbacks, isLoading, openFeedback };
};
