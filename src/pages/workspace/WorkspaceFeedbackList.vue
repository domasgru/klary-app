<template>
  <div class="feedback-list">
    <h6
      v-if="label"
      class="feedback-list__label"
      v-text="label"
    />
    <div
      class="feedbacks"
      :class="{'feedbacks--empty': !feedbacks.length}"
    >
      <p
        v-if="!feedbacks.length"
        class="base-typography--b-14-20"
        v-text="emptyStateText"
      />
      <div
        v-for="(feedback, index) in feedbacks"
        :key="`feedback-${index}`"
        class="feedback"
        @click="$emit('open', feedback.id)"
      >
        <WorkspaceFeedbackCard
          :feedback-data="feedback"
          :is-sent-feedback="isSentFeedback"
        />
        <div class="feedback__separator" />
      </div>
    </div>
  </div>
</template>

<script>
import WorkspaceFeedbackCard from './WorkspaceFeedbackCard.vue';

export default {
  components: {
    WorkspaceFeedbackCard,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    feedbacks: {
      type: Array,
      required: true,
    },
    isSentFeedback: {
      type: Boolean,
      default: false,
    },
    emptyStateText: {
      type: String,
      default: '',
    },
  },
  emits: ['open'],
};
</script>

<style lang="scss" scoped>
.feedback-list {
  &__label {
    margin-bottom: 16px;
  }
}

.feedbacks {
  overflow: hidden;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: $border-radius;

  &--empty {
    padding: 30px 40px;
    color: $grey-600;
    background: $grey-100;
  }
}

.feedback {
  &__separator {
    width: 100%;
    height: 1px;
    background: $grey-200;
  }
}

.feedback:last-child .feedback__separator {
  display: none;
}
</style>
