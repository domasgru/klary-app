<template>
  <h4 class="title">
    Favorites
  </h4>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="favoritesFeedbacks"
    empty-state-text="You have no favorite feedbacks"
    @open="openFeedback"
  />
</template>

<script>
import { useFeedbackList } from '@/composables/useFeedback';
import { useStore } from 'vuex';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';

export default {
  components: {
    WorkspaceFeedbackList,
  },
  setup() {
    const store = useStore();
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList('favorites');

    const favoritesFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: `participants.${store.state.user.userData.uid}.flags`,
      filterValue: 'favorite',
    });

    return { favoritesFeedbacks, isLoading, openFeedback };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}
</style>
