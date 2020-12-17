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
      <div class="card__user">
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
      </div>
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
    <WorkspaceFeedbackSettings
      :feedback-data="feedbackData"
      @archive="updateFeedbackState(ARCHIVED_STATE)"
      @unarchive="updateFeedbackState(ACTIVE_STATE)"
      @delete="updateFeedbackState(DELETED_STATE)"
    >
      <BaseSvg
        class="icon-more"
        name="more-horizontal"
      />
    </WorkspaceFeedbackSettings>
  </div>
</template>

<script>
import { computed } from 'vue';
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
import WorkspaceFeedbackSettings from './WorkspaceFeedbackSettings.vue';

dayjs.extend(relativeTime);

export default {
  components: {
    WorkspaceFeedbackSettings,
  },
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
    const userId = computed(() => (props.isSentFeedback
      ? props.feedbackData.receiverId
      : props.feedbackData.authorId));
    const user = useGetUser(userId.value);

    return {
      user,
      ACTIVE_STATE,
      ARCHIVED_STATE,
      DELETED_STATE,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
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
    updateFeedbackState(newState) {
       updateFeedback({
        feedbackId: this.feedbackData.id,
        path: `participants.${this.userData.uid}.feedbackState`,
        value: newState,
      });
      this.showOptions = false;
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

  &__user {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 194px;
    margin-right: 32px;
  }

  &__to {
    margin-right: 8px;
    color: $grey-600;
  }

  &__initial {
    width: 24px;
    margin-right: 8px;
  }

  &__name {
    flex-grow: 1;
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
}

.icon-more {
  width: 24px;
  height: 24px;
  padding: 2px;
  stroke: $grey-600;
}
</style>
