<template>
  <div class="comment-reply">
    <div class="comment-reply__left">
      <BaseAvatar
        size="sm"
        :name="author.name"
        :picture="author.googlePicture || ''"
      />
      <div class="comment-reply__vertical-line" />
    </div>
    <div class="comment-reply__right">
      <div class="comment-reply__name-and-time">
        <p class="comment-reply__name base-typography--b-14-20">
          {{ author.name }}
        </p>
        <BaseTimestamp :timestamp="reply.createdAt.seconds" />
      </div>
      <div class="comment-reply__content">
        {{ reply.content }}
      </div>
    </div>
  </div>
</template>

<script>
import { useGetUser } from '@/composables/useGetUser';

export default {
  props: {
    reply: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return { author: useGetUser(props.reply.author.uid) };
  },
};
</script>

<style lang="scss" scoped>
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

  &__content {
    word-break: break-word;
    white-space: pre-line;
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
