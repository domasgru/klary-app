<template>
  <FeedbackComment
    v-if="action.type === $options.COMMENT_ACTION"
    :id="action.id"
    :comment="action"
    :unseen-comments="unseenActions"
    :feedback-data="feedbackData"
  />
</template>

<script>
import { COMMENT_ACTION } from '@/constants/feedback';
import FeedbackComment from './FeedbackComment.vue';

export default {
  components: {
    FeedbackComment,
  },
  props: {
    action: {
      type: Object,
      required: true,
    },
    unseenActions: {
      type: Array,
      required: true,
    },
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  COMMENT_ACTION,
};
</script>

<style lang="scss" scoped>

</style>
