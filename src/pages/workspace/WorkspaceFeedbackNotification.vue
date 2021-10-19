<template>
  <div
    v-show="index !== 0"
    class="line-top"
  />
  <div
    class="content"
    v-bind="$attrs"
  >
    <div class="content__top">
      <div class="content__avatar-wrapper">
        <BaseAvatar
          class="content__avatar"
          :name="author.name"
          :picture="author.picture"
        />
        <div class="content__check">
          <BaseIcon
            size="sm"
            color="light"
            name="check"
          />
        </div>
      </div>
      <div class="content__text b1">
        <div class="content__name b1s">
          {{ author.name }}
        </div>
        &nbsp;marked this feedback as clear
      </div>
      <BaseTimestamp
        class="content__time"
        :timestamp="notification.createdAt.seconds"
      />
      <BaseLabelNew v-if="isNotificationUnseen" />
    </div>
    <div
      v-if="notification.content"
      class="content__message"
    >
      {{ notification.content }}
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue';
import { useFeedbackData } from '@/composables/useFeedback';

export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    notification: {
      type: Object,
      required: true,
    },
    unseenActions: {
      type: Array,
      required: true,
    },
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { getParticipant } = useFeedbackData(toRefs(props).feedbackData);
    const author = getParticipant(props.notification.authorUid);

    return {
      author,
    };
  },
  computed: {
    isNotificationUnseen() {
      return this.unseenActions.some((unseenAction) => unseenAction.id === this.notification.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.line-top {
  width: 2px;
  height: 36px;
  margin-left: 34px;
  background: $grey-200;
}

.content {
  padding: 20px 24px;
  background: $light;
  border: $stroke;
  border-radius: $border-radius;

  &__top {
    display: flex;
    align-items: center;
  }

  &__text {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  &__avatar-wrapper {
    position: relative;
    flex-shrink: 0;
    margin-right: 16px;
  }

  &__check {
    position: absolute;
    right: -8px;
    bottom: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: $success;
    border: 2px solid $light;
    border-radius: 50%;
  }

  &__time {
    margin-right: 8px;
  }

  &__message {
    margin-top: 16px;
    word-break: break-word;
    white-space: pre-line;
  }
}
</style>
