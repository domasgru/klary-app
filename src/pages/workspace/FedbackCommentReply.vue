<template>
  <div class="comment-reply">
    <BaseAvatar
      size="md"
      :name="author.name"
      :picture="author.googlePicture || ''"
    />
    <div class="comment-reply__main">
      <div class="comment-reply__name-and-time">
        <p class="comment-reply__name base-typography--bold-button1">
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
  padding: 10px 24px 10px 24px;
  background: $grey-50;
  transition: background 0.3s;

  &:first-child {
    padding-top: 20px;
  }

  &:last-child {
    padding-bottom: 20px;
  }

  // Comes from upper component
  &--unseen {
    background: #511fdc1f;
  }

  &__main {
    flex-grow: 1;
    justify-content: space-between;
    padding-left: 16px;
  }

  &__name-and-time {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  &__content {
    word-break: break-word;
    white-space: pre-line;
  }

  &__name {
    margin-right: 8px;
  }
}
</style>
