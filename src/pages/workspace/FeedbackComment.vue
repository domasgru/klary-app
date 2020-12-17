<template>
  <div class="feedback-line-top" />
  <div
    class="feedback-comment"
    v-bind="$attrs"
    :class="{'feedback-comment__content--unseen': unseenComments.some(unseenComment => unseenComment.id === comment.id)}"
  >
    <div class="feedback-comment__header">
      <div class="feedback-comment__author">
        <BaseAvatar
          class="feedback-comment__initial"
          :name="commentAuthor.name"
          :picture="commentAuthor.googlePicture || ''"
          size="md"
        />
        <p class="feedback-comment__author-name base-typography--bold-button1">
          {{ commentAuthor.name }}
        </p>
        <BaseTimestamp :timestamp="comment.createdAt.seconds" />
      </div>
    </div>
    <div
      class="feedback-comment__content base-typography--b-16-24"
    >
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
      :class="{'comment-reply--unseen': unseenComments.some(unseenComment => unseenComment.id === reply.id)}"
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
import { mapState } from 'vuex';
import { addCommentReply } from '@/firebase';
import { useGetUser } from '@/composables/useGetUser';
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
  },
  setup(props) {
    return { commentAuthor: useGetUser(props.comment.author.uid) };
  },
  data() {
    return {
      replyContent: '',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    addReply(commentId) {
      if (!this.replyContent) {
        return;
      }

      addCommentReply(this.$route.params.id, commentId, this.replyContent, this.userData);
      this.replyContent = '';
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

  &__content {
    word-break: break-word;
    white-space: pre-line;
    transition: background 0.3s;

    &--unseen {
      background: $background-unseen;
    }
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
