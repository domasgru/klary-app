<template>
  <div class="feedback-line-top" />
  <div
    class="feedback-comment"
    v-bind="$attrs"
  >
    <div class="feedback-comment__header">
      <div class="feedback-comment__author">
        <BaseAvatar
          class="feedback-comment__initial"
          :name="author.name"
          :picture="author.picture"
          size="md"
        />
        <p class="feedback-comment__author-name base-typography--bold-button1">
          {{ author.name }}
        </p>
        <BaseTimestamp
          class="feedback-comment__time"
          :timestamp="comment.createdAt.seconds"
        />
        <BaseLabelNew v-if="isCommentUnseen" />
      </div>
    </div>
    <div class="feedback-comment__content base-typography--b-16-24">
      {{ comment.content }}
    </div>
  </div>
  <div
    v-if="comment.replies && comment.replies.length"
    class="feedback-replies"
  >
    <FeedbakCommentReply
      v-for="(reply, index) in comment.replies"
      :id="reply.id"
      :key="index"
      :feedback-data="feedbackData"
      :unseen-comments="unseenComments"
      :reply="reply"
    />
  </div>
  <div class="feedback-write-reply">
    <BaseTextarea
      v-model="replyContent"
      placeholder="Reply..."
      class="feedback-write-reply__input base-typography--b-16-24"
      has-submit
      submit-button-text="Reply"
      @submit="addReply(comment.id)"
    />
  </div>
</template>

<script>
import { toRefs } from 'vue';
import { mapState } from 'vuex';
import { addCommentReply } from '@/firebase';
import { useFeedbackData } from '@/composables/useFeedback';
import FeedbakCommentReply from './FedbackCommentReply.vue';

export default {
  components: {
    FeedbakCommentReply,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    unseenComments: {
      type: Array,
      required: true,
    },
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { getParticipant } = useFeedbackData(toRefs(props).feedbackData);
    const author = getParticipant(props.comment.authorUid);

    return {
      author,
    };
  },
  data() {
    return {
      replyContent: '',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    isCommentUnseen() {
      return this.unseenComments.some((unseenComment) => unseenComment.id === this.comment.id);
    },
  },
  methods: {
    addReply(commentId) {
      if (!this.replyContent) {
        return;
      }

      addCommentReply(this.$route.params.id, commentId, this.replyContent, this.userData.uid);
      this.replyContent = '';
    },
    isReplyUnseen(replyId) {
      return this.unseenComments.some((unseenComment) => unseenComment.id === replyId);
    },
  },
};
</script>

<style lang="scss" scoped>
$background-unseen: #511fdc1f;

.feedback-line-top {
  width: 2px;
  height: 36px;
  margin-left: 34px;
  background: $grey-200;
}

.feedback-comment {
  position: relative;
  padding: 20px 24px;
  background: $light;
  border: $stroke;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;

  &__header {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  &__author {
    z-index: 2;
    display: flex;
    align-items: center;
  }

  &__initial {
    margin-right: 16px;
  }

  &__author-name {
    margin-right: 8px;
  }

  &__time {
    margin-right: 8px;
  }

  &__content {
    word-break: break-word;
    white-space: pre-line;
    transition: background 0.3s;
  }
}

.feedback-replies {
  border-right: $stroke;
  border-bottom: $stroke;
  border-left: $stroke;
}

.feedback-write-reply {
  display: flex;
  align-items: center;
  padding: 8px 24px;
  background: $grey-50;
  border: $stroke;
  border-top: none;
  border-bottom-right-radius: $border-radius;
  border-bottom-left-radius: $border-radius;

  &__initial {
    margin-right: 12px;
  }

  &__input-wrapper {
    position: relative;
    flex-grow: 1;
  }

  &__input {
    width: 100%;
  }

  &__send-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
    box-sizing: content-box;
    width: 16px;
    height: 16px;
    padding: 8px;
    cursor: pointer;
  }
}
</style>
