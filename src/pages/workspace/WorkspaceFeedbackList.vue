<template>
  <div class="feedback-list">
    <div
      class="feedbacks"
      :class="{'feedbacks--empty': !feedbacks.length}"
    >
      <h6
        v-if="label"
        class="feedback-list__label b2s"
        v-text="label"
      />
      <div
        v-for="(feedback, index) in feedbacks"
        :key="`feedback-${index}`"
        class="feedback"
      >
        <WorkspaceFeedbackCard
          class="feedback__card"
          :feedback-data="feedback"
          :is-sent-feedback="isSentFeedback(feedback)"
          :inbox-type="inboxType"
          @click="$emit('open', feedback.id)"
        />
        <div class="feedback__separator" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
    inboxType: {
      type: String,
      required: true,
    },
  },
  emits: ['open'],
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    isSentFeedback(feedback) {
      return feedback.authorId === this.userData.uid;
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-list {
  &__label {
    padding: 16px;
    border-bottom: 1px solid $grey-200;
  }
}

.feedbacks {
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

  &:first-child &__card {
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
  }

  &:last-child &__card {
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
  }
}

.feedback:last-child .feedback__separator {
  display: none;
}
</style>
