<template>
  <div
    class="card"
    :class="{'card--seen': isSeen}"
  >
    <div
      v-show="!isSeen"
      class="card__seen-indicator"
    />
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
        size="xs"
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
  height: 88px;
  padding: 24px 36px 24px 40px;
  color: $dark;
  user-select: none;
  background: $light;
  //transition: background 0.2s;

  &:hover {
    cursor: pointer;
    background: rgba($grey-100, 0.4);
  }

  &--seen {
    background: $grey-50;
  }

  &__seen-indicator {
    position: absolute;
    top: 42px;
    left: 16px;
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
