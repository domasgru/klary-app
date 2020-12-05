<template>
  <h4 class="title">
    Favorites
  </h4>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="favoriteFeedbacks"
    empty-state-text="You have no favorite feedbacks"
    @open="openFeedback"
  />
</template>

<script>
import { useFeedbackList } from '@/composables/useFeedback';
import { useStore } from 'vuex';
import { FAVORITE_TYPE } from '@/constants/feedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';

export default {
  components: {
    WorkspaceFeedbackList,
  },
  setup() {
    const store = useStore();
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(FAVORITE_TYPE);

    const favoriteFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: `participants.${store.state.user.userData.uid}.flags`,
      filterValue: FAVORITE_TYPE,
    });

    return { favoriteFeedbacks, isLoading, openFeedback };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}
</style>
