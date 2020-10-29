<template>
  <div
    class="feedbacks"
    :class="{'feedbacks--not-empty': feedbacks.length}"
  >
    <div
      v-for="(feedback, index) in feedbacks"
      :key="`feedback-${index}`"
      class="feedback"
      @click="$emit('open', feedback.id)"
    >
      <WorkspaceFeedbackReceivedCard
        :feedback-data="feedback"
        :is-sent-feedback="isSentFeedback"
      />
      <div class="feedback__separator" />
    </div>
  </div>
</template>

<script>
import WorkspaceFeedbackReceivedCard from './WorkspaceFeedbackReceivedCard.vue';

export default {
  components: {
    WorkspaceFeedbackReceivedCard,
  },
  props: {
    feedbacks: {
      type: Array,
      required: true,
    },
    isSentFeedback: {
      type: Boolean,
      default: false,
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
