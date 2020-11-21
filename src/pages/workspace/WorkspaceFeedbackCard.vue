<template>
  <div
    class="card"
    :class="{'card--unseen': !isSeen}"
  >
    <div class="card__unseen-indicator-container">
      <div
        v-show="!isSeen"
        class="card__unseen-indicator"
      />
    </div>
    <div
      v-if="isSentFeedback"
      class="card__to base-typography--b-14-20"
    >
      To:
    </div>
    <BaseAvatar
      class="card__initial"
      :name="user.name"
      :picture="user.googlePicture || ''"
      size="xs"
    />
    <div
      class="card__name"
      :class="{
        'base-typography--b-14-20': isSeen,
        'base-typography--bold-b-14-20': !isSeen
      }"
    >
      {{ user.name }}
    </div>
    <div
      class="card__title"
      :class="{
        'base-typography--b-14-20': isSeen,
        'base-typography--bold-b-14-20': !isSeen
      }"
    >
      {{ feedbackData.title }}
    </div>
    <BaseTimestamp
      class="card__time"
      :timestamp="feedbackData.createdAt.seconds"
    />
    <BaseSvg
      name="favorite"
      class="card__favorite"
    />
    <BaseSvg
      class="card__more"
      name="more-horizontal"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetUser } from '@/composables/useGetUser';
import { mapState } from 'vuex';
import { FEEDBACK_ACTION_TYPES } from '@/constants';

dayjs.extend(relativeTime);

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
    ...mapState('user', ['userData']),
    lastAction() {
      const { lastAction, name } = Object.values(this.feedbackData.participants)
      .reduce((max, participant) => {
        if (!participant.lastAction.createdAt) {
          return max;
        }

        return max.lastAction.createdAt?.seconds > participant.lastAction.createdAt?.seconds
        ? max : participant;
      });

      if (!lastAction.type || !lastAction.createdAt) {
        return '';
      }

      const lastActionRelativeTime = dayjs(lastAction.createdAt.seconds * 1000).fromNow();

      if (lastAction.type === FEEDBACK_ACTION_TYPES.COMMENT) {
        return `${name} commented ${lastActionRelativeTime}`;
      } if (lastAction.type === FEEDBACK_ACTION_TYPES.CREATE) {
        return `${name} created a feedback ${lastActionRelativeTime}`;
      }
      return '';
    },
    isSeen() {
      const { participants } = this.feedbackData;
      const currentUser = participants[this.userData.uid];

      // User didn't see feedback at all
      if (!currentUser.seenAt) {
        return false;
      }

      const { lastAction, name } = Object.entries(participants)
        .filter(([id, participant]) => id !== this.userData.uid)
        .map(([id, value]) => value)
        .reduce((max, participant) => (
          max.lastAction.createdAt.seconds > participant.lastAction.createdAt.seconds
          ? max
          : participant
        ));

      // No actions from other users
      if (!lastAction.createdAt) {
        return true;
      }

      return currentUser.seenAt.seconds >= lastAction.createdAt.seconds;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 28px 32px 28px 0;
  color: $dark;
  user-select: none;
  background: $grey-100;
  //transition: background 0.2s;

  &:hover {
    cursor: pointer;
    background: rgba($grey-100, 0.4);
  }

  &--unseen {
    background: $light;
  }

  &__unseen-indicator-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
  }

  &__unseen-indicator {
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
  }

  &__description {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 44.4%;
    margin-right: 12.7%;
  }

  &__to {
    margin-right: 0.9237%;
    color: $grey-600;
  }

  &__initial {
    margin-right: 0.923%;
  }

  &__name {
    width: 100%;
    max-width: 18.7066%;
    margin-right: 3.6951%;
  }

  &__title {
    width: 100%;
    max-width: 38%;
    margin-right: auto;
  }

  &__time {
    width: 100%;
    max-width: 7.6212%;
    margin-right: 1.8475%;
    text-align: right;
  }

  &__favorite {
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-right: 1.8475%;
  }

  &__more {
    width: 24px;
    height: 24px;
    padding: 2px;
  }
}
</style>
