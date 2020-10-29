<template>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="feedbacks"
    @open="openFeedback"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { useFeedbackList } from '@/composables/useFeedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';

export default {
  components: {
    WorkspaceFeedbackList,
  },
  setup() {
    const { feedbacks, isLoading, openFeedback } = useFeedbackList('received');
    return { feedbacks, isLoading, openFeedback };
  },
};
</script>
