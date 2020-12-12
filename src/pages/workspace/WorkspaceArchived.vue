<template>
  <h4 class="title">
    Archived
  </h4>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="archivedFeedbacks"
    empty-state-text="You have no archived feedbacks"
    @open="openFeedback"
  />
</template>

<script>
import { useStore } from 'vuex';
import { useFeedbackList } from '@/composables/useFeedback';
import { ARCHIVED_STATE } from '@/constants/feedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';

export default {
  components: {
    WorkspaceFeedbackList,
  },
  setup() {
    const store = useStore();
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(ARCHIVED_STATE);

    const archivedFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: `participants.${store.state.user.userData.uid}.feedbackState`,
      filterValue: ARCHIVED_STATE,
    });

    return { archivedFeedbacks, isLoading, openFeedback };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}
</style>
