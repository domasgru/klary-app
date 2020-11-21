<template>
  <h4 class="title">
    Received
  </h4>
  <h6 class="subtitle">
    Active
  </h6>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="feedbacks"
    class="active-feedback-list"
    @open="openFeedback"
  />
  <h6 class="subtitle">
    Closed
  </h6>
  <div class="closed-empty-state base-typography--b-14-20">
    Once you close the feedback you received, it will be moved here.
  </div>
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

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.subtitle {
  margin-bottom: 16px;
}

.active-feedback-list {
  margin-bottom: 32px;
}

.closed-empty-state {
  width: 100%;
  padding: 29px 40px;
  color: $grey-600;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
}
</style>
