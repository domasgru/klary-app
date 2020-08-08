<template>
  <div class="feedbacks">
    <div
      v-for="(feedback, index) in feedbacks"
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
      ...mapState('feedback', ['feedbacks']),
    },
    async beforeRouteEnter(to, from, next) {
      // await this.bindFeedbacks(this.userData.uid);
      next();
    },
    methods: {
      ...mapActions('feedback', ['bindFeedbacks', 'setCurrentFeedback']),
      openFeedback(feedback) {
        this.setCurrentFeedback(feedback);
        this.$router.push({ path: `/workspace/feedback/${feedback.id}` });
      },
    },
  };
</script>

<style lang="scss" scoped>
.feedbacks {
  overflow: hidden;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: 8px;
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
