<template>
  <FeedbackComment
    v-if="action.type === $options.COMMENT_ACTION"
    :id="action.id"
    :comment="action"
    :unseen-comments="unseenActions"
    :feedback-data="feedbackData"
  />
  <WorkspaceFeedbackNotification
    v-else-if="action.type === $options.MARK_CLEAR_ACTION"
    :id="action.id"
    :notification="action"
    :unseen-actions="unseenActions"
    :feedback-data="feedbackData"
  />
</template>

<script>
import { COMMENT_ACTION, MARK_CLEAR_ACTION } from '@/constants/feedback';
import FeedbackComment from './FeedbackComment.vue';
import WorkspaceFeedbackNotification from './WorkspaceFeedbackNotification.vue';

export default {
  components: {
    FeedbackComment,
    WorkspaceFeedbackNotification,
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
  MARK_CLEAR_ACTION,
};
</script>

<style lang="scss" scoped>

</style>
