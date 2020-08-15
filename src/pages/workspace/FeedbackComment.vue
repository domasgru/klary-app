<template>
  <div class="feedback-comment">
    <div class="feedback-comment__header">
      <div class="feedback-comment__author">
        <BaseInitial
          class="feedback-comment__initial"
          :name="comment.author.name"
          size="sm"
        />
        <p class="base-typography--b-14-20">
          {{ comment.author.name }}
        </p>
      </div>
      <BaseTimestamp :timestamp="comment.createdAt.seconds" />
      <div class="feedback-comment__line" />
    </div>
    <div class="feedback-comment__content base-typography--b-16-24">
      {{ comment.content }}
    </div>
    <div
      v-if="comment.replies && comment.replies.length"
      class="feedback-comment__replies"
    >
      <div
        v-for="(reply, index) in comment.replies"
        :key="index"
        class="comment-reply"
      >
        <div class="comment-reply__left">
          <BaseInitial
            size="sm"
            :name="reply.author.name"
          />
          <div class="comment-reply__vertical-line" />
        </div>
        <div class="comment-reply__right">
          <div class="comment-reply__name-and-time">
            <p class="comment-reply__name base-typography--b-14-20">
              {{ reply.author.name }}
            </p>
            <BaseTimestamp :timestamp="reply.createdAt.seconds" />
          </div>
          <div class="comment-reply__content">
            {{ reply.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="feedback-comment__reply">
      <BaseInitial
        class="feedback-comment__reply-initial"
        :name="userData.name"
        size="sm"
      />
      <div class="feedback-comment__reply-input-wrapper">
        <BaseTextarea
          v-model="replyContent"
          class="feedback-comment__reply-input base-typography--b-16-24"
        />
        <BaseSvg
          class="feedback-comment__send-icon"
          name="send-arrow"
          @click.native="addReply(comment.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { addCommentReply } from '@/firebase';
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      replyContent: '',
    };
  },
  validations: {
    replyContent: {
      required,
    },
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('feedback', ['currentFeedback']),
  },
  methods: {
    addReply(commentId) {
      if (this.$v.replyContent.$invalid) {
        return;
      }

      addCommentReply(this.currentFeedback.id, commentId, this.replyContent, this.userData);
      this.replyContent = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-comment {
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 0 20px 0;
  }

  &__author {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__initial {
    margin-right: 12px;
  }

  &__line {
    position: absolute;
    top: 0;
    left: 15px;
    width: 2px;
    height: 100%;
    background: $grey-200;
  }

  &__content {
    padding: 24px;
    background: $light;
    border: $stroke;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
  }

  &__reply {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    background: $grey-50;
    border: $stroke;
    border-top: none;
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
  }

  &__reply-initial {
    margin-right: 12px;
  }

  &__reply-input {
    width: 100%;
  }

  &__reply-input-wrapper {
    position: relative;
    flex-grow: 1;
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

  &__replies {
    padding: 24px;
    border-right: $stroke;
    border-bottom: $stroke;
    border-left: $stroke;
  }
}

.comment-reply {
  display: flex;

  &__left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__right {
    flex-grow: 1;
    justify-content: space-between;
    padding-left: 16px;
  }

  &__name-and-time {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__name {
    color: $grey-500;
  }

  &:not(:last-child) &__vertical-line {
    flex-grow: 1;
    width: 2px;
    margin: 4px 0;
    background: $grey-200;
  }

  &:not(:last-child) &__content {
    margin-bottom: 32px;
  }
}
</style>
