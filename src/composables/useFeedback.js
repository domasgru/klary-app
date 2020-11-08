/* eslint-disable import/prefer-default-export */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { capitalize } from '@/utils/stringUtils';

export const useFeedbackList = (type) => {
  const store = useStore();
  const router = useRouter();
  const isLoading = ref(false);
  const feedbacks = computed(() => store.state.feedback[`${type}Feedbacks`]);

  const getFeedbackList = async () => {
    isLoading.value = true;
    await store.dispatch(`feedback/bind${capitalize(type)}Feedbacks`,
    { userId: store.state.user.userData.uid, workspaceId: store.state.workspace.currentWorkspace.id });
    isLoading.value = false;
  };

  if (!feedbacks.value) {
    getFeedbackList();
  }

  const openFeedback = (id) => router.push({ path: `/workspace/${type}/feedback/${id}` });

  return { feedbacks, isLoading, openFeedback };
};
