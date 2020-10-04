<template>
  <div class="card">
    <div class="card__description">
      <div class="card__title base-typography--b-16-24">
        {{ feedbackData.title }}
      </div>
      <div
        v-if="lastAction"
        class="card__last-action base-typography--b-14-20"
      >
        {{ lastAction }}
      </div>
    </div>
    <div class="card__author">
      <BaseAvatar
        class="card__initial"
        :name="user.name"
        :picture="user.googlePicture || ''"
        size="sm"
      />
      <div class="card__name base-typography--b-14-20">
        {{ user.name }}
      </div>
    </div>
    <BaseTimestamp
      class="card__time"
      :timestamp="feedbackData.createdAt.seconds"
    />
    <BaseSvg
      class="card__more"
      name="more-horizontal"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { useGetUser } from '@/composables/useGetUser';
import { mapState } from 'vuex';

export default {
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
    isSentFeedback: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const userId = props.isSentFeedback
      ? props.feedbackData.receiverId
      : props.feedbackData.authorId;
    const user = useGetUser(userId);
    return { user };
  },
  computed: {
    lastAction() {
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  align-items: center;
  width: 100%;
  height: 88px;
  padding: 24px 36px 24px 32px;
  color: $dark;
  user-select: none;
  //transition: background 0.2s;

  &:hover {
    cursor: pointer;
    background: rgba($grey-100, 0.4);
  }

  &__description {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 44.4%;
    margin-right: 12.7%;
  }

  &__title {
    margin-bottom: 4px;
  }

  &__last-action {
    color: $grey-500;
  }

  &__author {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 21%;
    margin-right: auto;
  }

  &__initial {
    margin-right: 12px;
  }

  &__time {
    margin-right: 36px;
  }

  &__more {
    width: 24px;
    height: 24px;
  }
}
</style>
