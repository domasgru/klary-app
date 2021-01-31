<template>
  <h4 class="title h4">
    Favorites
  </h4>
  <WorkspaceFeedbackList
    v-if="!isLoading && favoriteFeedbacks.length"
    :feedbacks="favoriteFeedbacks"
    empty-state-text="You have no favorite feedbacks"
    :inbox-type="FAVORITES_TYPE"
    @open="openFeedback"
  />
  <WorkspaceInboxEmptyState
    v-else
    title="No favorites"
    illustration="favorites-il"
  />
</template>

<script>
import { useFeedbackList } from '@/composables/useFeedback';
import { useStore } from 'vuex';
import { FAVORITES_TYPE, FAVORITE_FLAG } from '@/constants/feedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';

export default {
  components: {
    WorkspaceFeedbackList,
    WorkspaceInboxEmptyState,
  },
  setup() {
    const store = useStore();
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(FAVORITES_TYPE);

    const favoriteFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: `participants.${store.state.user.userData.uid}.flags`,
      filterValue: FAVORITE_FLAG,
    });

    return {
      favoriteFeedbacks, isLoading, openFeedback, FAVORITES_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}
</style>
