<template>
  <div
    class="card"
    :class="{'card--unseen': !isSeen}"
  >
    <div class="card__clickable-area-wrapper">
      <div class="card__unseen-indicator-container">
        <div
          v-show="!isSeen"
          class="card__unseen-indicator"
        />
      </div>
      <p
        v-if="isSentFeedback"
        class="card__to base-typography--b-14-20"
        v-text="'To:'"
      />
      <BaseAvatar
        class="card__initial"
        :name="user.name"
        :picture="user.googlePicture || ''"
        size="xs"
      />
      <p
        class="card__name"
        :class="{
          'base-typography--b-14-20': isSeen,
          'base-typography--bold-b-14-20': !isSeen
        }"
        v-text="user.name"
      />
      <div
        v-if="isClosed"
        class="card__label"
      >
        <BaseSvg
          class="card__label-icon"
          name="check"
        />
        Closed
      </div>
      <p
        class="card__title"
        :class="{
          'base-typography--b-14-20': isSeen,
          'base-typography--bold-b-14-20': !isSeen
        }"
        v-text="feedbackData.title"
      />
      <BaseTimestamp
        class="card__time"
        :timestamp="feedbackData.createdAt.seconds"
      />
    </div>
    <BaseSvg
      name="favorite"
      class="card__favorite"
      :class="{'card__favorite--active': isFavorite}"
      @click.stop="toggleFavorite"
    />
    <BaseDropdown
      v-click-outside="{
        handler: () => showOptions = false,
        events: ['mousedown']
      }"
      :is-open="showOptions"
      :items="optionsItems"
      @click.stop
      @archive="archiveFeedback"
      @unarchive="unarchiveFeedback"
      @delete="deleteFeedback"
    >
      <BaseSvg
        class="card__more"
        name="more-horizontal"
        @click.stop="showOptions = !showOptions"
      />
    </BaseDropdown>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetUser } from '@/composables/useGetUser';
import { mapState } from 'vuex';
import { CREATE_ACTION, COMMENT_ACTION } from '@/constants';
import {
 FAVORITE_TYPE, ACTIVE_STATE, ARCHIVED_STATE, DELETED_STATE, CLOSED_STATUS,
} from '@/constants/feedback';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import { updateFeedback } from '@/firebase';

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
    return {
      user,
    };
  },
  data() {
    return {
      showOptions: false,
    };
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
      debugger;
      if (lastAction.type === COMMENT_ACTION) {
        return `${name} commented ${lastActionRelativeTime}`;
      } if (lastAction.type === CREATE_ACTION) {
        return `${name} created a feedback ${lastActionRelativeTime}`;
      }
      return '';
    },
    optionsItems() {
      const optionsArchiveItem = this.feedbackData.participants[this.userData.uid].feedbackState === ARCHIVED_STATE
      ? { name: 'Unarchive', action: 'unarchive', icon: 'archive' }
      : { name: 'Archive for you', action: 'archive', icon: 'archive' };
      const optionsDeleteItem = {
        name: 'Delete for you', action: 'delete', icon: 'delete', theme: 'alarm',
      };

      return [
        optionsArchiveItem,
        optionsDeleteItem,
      ];
    },
    isSeen() {
      return isFeedbackSeen(this.feedbackData, this.userData.uid);
    },
    isClosed() {
      return this.feedbackData.status === CLOSED_STATUS;
    },
    feedbackFlags() {
      return this.feedbackData.participants[this.userData.uid]?.flags;
    },
    isFavorite() {
      return this.feedbackFlags.includes(FAVORITE_TYPE);
    },
  },
  methods: {
    toggleFavorite() {
      const updatedFlags = this.feedbackFlags.includes(FAVORITE_TYPE)
        ? this.feedbackFlags.filter((flag) => flag !== FAVORITE_TYPE)
        : [...this.feedbackFlags, FAVORITE_TYPE];

      updateFeedback({
        feedbackId: this.feedbackData.id,
        path: `participants.${this.userData.uid}.flags`,
        value: updatedFlags,
      });
    },
    archiveFeedback() {
      updateFeedback({
        feedbackId: this.feedbackData.id,
        path: `participants.${this.userData.uid}.feedbackState`,
        value: ARCHIVED_STATE,
      });
    },
    unarchiveFeedback() {
      updateFeedback({
        feedbackId: this.feedbackData.id,
        path: `participants.${this.userData.uid}.feedbackState`,
        value: ACTIVE_STATE,
      });
    },
    deleteFeedback() {
      updateFeedback({
        feedbackId: this.feedbackData.id,
        path: `participants.${this.userData.uid}.feedbackState`,
        value: DELETED_STATE,
      });
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
    background: $grey-150;
  }

  &--unseen {
    background: $light;
  }

  &__clickable-area-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }

  &__unseen-indicator-container {
    display: flex;
    flex-shrink: 0;
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

  &__to {
    flex-shrink: 0;
    margin-right: 0.9237%;
    color: $grey-600;
  }

  &__initial {
    flex-shrink: 0;
    width: 24px;
    margin-right: 8px;
  }

  &__name {
    flex-shrink: 0;
    width: 100%;
    max-width: 162px;
    margin-right: 32px;
  }

  &__label {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding: 2px 8px;
    margin-right: 8px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: $light;
    text-transform: uppercase;
    background: $grey-500;
    border-radius: 14px;
  }

  &__label-icon {
    width: 12px;
    height: 12px;
    padding: 2px;
    margin-right: 6px;
  }

  &__title {
    @include text-overflow-ellipsis;

    flex-grow: 1;
    flex-shrink: 1000;
    width: 200px;
  }

  &__time {
    width: 100%;
    max-width: 80px;
    margin-right: 16px;
    text-align: right;
  }

  &__favorite {
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-right: 16px;
    stroke: $grey-600;
    transition: stroke 0.2s ease;

    &--active {
      stroke: #ffc800;
    }
  }

  &__more {
    width: 24px;
    height: 24px;
    padding: 2px;
  }
}
</style>
