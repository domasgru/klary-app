<template>
  <div
    class="feedbacks"
    :class="{'feedbacks--not-empty': receivedFeedbacks.length}"
  >
    <div
      v-for="(feedback, index) in receivedFeedbacks"
      :key="`feedback-${index}`"
      class="feedback"
      @click="openFeedback(feedback)"
    >
      <WorkspaceFeedbackCard
        :feedback-data="feedback"
      />
      <div class="feedback__separator" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import WorkspaceFeedbackCard from './WorkspaceFeedbackCard.vue';

export default {
    components: {
      WorkspaceFeedbackCard,
    },
    computed: {
      ...mapState('user', ['userData']),
      ...mapState('feedback', ['receivedFeedbacks']),
    },
    async beforeRouteEnter(to, from, next) {
      // await this.bindFeedbacks(this.userData.uid);
      next();
    },
    methods: {
      ...mapActions('feedback', ['bindFeedbacks']),
      openFeedback(feedback) {
        this.$router.push({ path: `/workspace/received/feedback/${feedback.id}` });
      },
    },
  };
</script>

<style lang="scss" scoped>
.feedbacks {
  overflow: hidden;
  background: $light;
  border-radius: 8px;

  &--not-empty {
    border: 1px solid $grey-200;
  }
}

.feedback {
  &__separator {
    width: 94%;
    height: 1px;
    margin: auto;
    background: $grey-100;
  }
}
</style>
