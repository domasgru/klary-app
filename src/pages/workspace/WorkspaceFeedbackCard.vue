<template>
  <div
    class="card"
    :class="{'card--light-background': !isFeedbackLastActionSeen || !isFeedbackClosed}"
  >
    <div class="card__clickable-area-wrapper">
      <div class="card__unseen-indicator-container">
        <div
          v-show="!isFeedbackLastActionSeen"
          class="card__unseen-indicator"
        />
      </div>
      <div class="card__user">
        <p
          v-if="isFeedbackSent"
          class="card__to base-typography--b-14-20"
          v-text="'To:'"
        />
        <BaseAvatar
          class="card__initial"
          :name="user.name"
          :picture="user.picture"
          size="xs"
        />
        <p
          class="card__name"
          :class="{
            'base-typography--b-14-20': isFeedbackLastActionSeen,
            'base-typography--bold-b-14-20': !isFeedbackLastActionSeen
          }"
          v-text="user.name"
        />
      </div>
      <p
        class="card__title"
        :class="{
          'base-typography--b-14-20': isFeedbackLastActionSeen,
          'base-typography--bold-b-14-20': !isFeedbackLastActionSeen
        }"
        v-text="feedbackData.title"
      />
      <BaseTimestamp
        class="card__time"
        :timestamp="feedbackData.createdAt.seconds"
      />
    </div>
    <WorkspaceFeedbackCardButton
      icon="favorite"
      theme="star"
      class="card__favorite"
      :active="isFeedbackFavorite"
      @click.stop="toggleFeedbackFlag(FAVORITE_FLAG)"
    />
    <WorkspaceFeedbackSettings
      :feedback-data="feedbackData"
      @remove="updateFeedbackState(REMOVED_STATE)"
      @unremove="updateFeedbackState(ACTIVE_STATE)"
      @delete="showDeleteModal = true"
    >
      <WorkspaceFeedbackCardButton
        icon="more"
      />
    </WorkspaceFeedbackSettings>
    <ExampleFeedbackGuide
      v-if="isExampleFeedback"
      class="guide"
    />
  </div>
</template>

<script>
import { toRefs } from 'vue';
import {
  FAVORITE_FLAG, ACTIVE_STATE, REMOVED_STATE, DELETED_STATE,
} from '@/constants/feedback';
import { useFeedbackData } from '@/composables/useFeedback';
import ExampleFeedbackGuide from './ExampleFeedbackGuide.vue';
import WorkspaceFeedbackSettings from './WorkspaceFeedbackSettings.vue';
import WorkspaceFeedbackCardButton from './WorkspaceFeedbackCardButton.vue';

export default {
  components: {
    WorkspaceFeedbackSettings,
    WorkspaceFeedbackCardButton,
    ExampleFeedbackGuide,
  },
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
    inboxType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { feedbackData } = toRefs(props);
    const {
      feedbackCardUser: user,
      isFeedbackSent,
      isFeedbackClosed,
      isFeedbackFavorite,
      isFeedbackLastActionSeen,
      toggleFeedbackFlag,
      updateFeedbackState,
      isExampleFeedback,
    } = useFeedbackData(feedbackData, props.inboxType);

    return {
      user,
      isFeedbackSent,
      isFeedbackClosed,
      isFeedbackFavorite,
      isFeedbackLastActionSeen,
      isExampleFeedback,
      toggleFeedbackFlag,
      updateFeedbackState,
      FAVORITE_FLAG,
      ACTIVE_STATE,
      REMOVED_STATE,
      DELETED_STATE,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 32px 24px 0;
  color: $dark;
  user-select: none;
  background: $grey-100;

  &:hover {
    cursor: pointer;
    background: $grey-150;
  }

  &--light-background {
    background: $light;
  }

  &__clickable-area-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
    margin-right: 8px;
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
    text-align: right;
  }

  &__favorite {
    margin-right: 8px;
  }
}

.guide {
  position: absolute;
  right: 0;
  bottom: -16px;
  left: 0;
  z-index: 10;
  margin: auto;
}
</style>
