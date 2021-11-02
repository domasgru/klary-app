<template>
  <BasePopup
    class="icon"
    :is-open="isEditable && showEmojiPopup"
    :position="'bottom-start'"
    :offset="[0, 6]"
    @close="$emit('close')"
    v-on="isEditable ? {click: (e) => {e.preventDefault(); e.stopPropagation()}} : {}"
  >
    <div
      class="icon__wrapper"
      :class="{
        [`icon__wrapper--hover-${hoverBackgroundColor}`]: emoji && hoverBackgroundColor,
        'icon__emoji-select-theme': emojiSelectTheme,
        'is-open': showEmojiPopup
      }"
      @click="isEditable && $emit('toggle')"
    >
      <div
        v-if="emoji"
        class="icon__emoji"
      >
        {{ emoji }}
      </div>
      <div
        v-else-if="icon"
      >
        <BaseIcon
          size="sm"
          :name="icon"
          :color="color"
        />
      </div>
    </div>
    <template #content>
      <emoji-picker
        ref="emojiPicker"
        class="light"
      />
    </template>
  </BasePopup>
</template>

<script>
import { nextTick } from 'vue';
import 'emoji-picker-element';

export default {
  props: {
    showEmojiPopup: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
    emoji: {
      type: String,
      default: null,
    },
    emojiSelectTheme: {
      type: Boolean,
      default: false,
    },
    hoverBackgroundColor: {
      type: String,
      default: 'grey-200',
    },
    color: {
      type: String,
      default: 'dark',
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'toggle', 'update-emoji'],
  watch: {
    async showEmojiPopup(newValue) {
      if (!newValue) {
        return;
      }

      await nextTick();
      this.$refs.emojiPicker.addEventListener('emoji-click', (e) => {
        this.$emit('update-emoji', e.detail.unicode);
        this.$emit('close');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 8px;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 2px;
    border-radius: 4px;

    &--hover-light:hover,
    &--hover-light.is-open {
      background: $light;
    }

    &--hover-grey-150:hover,
    &--hover-grey-150.is-open {
      background: $grey-150;
    }

    &--hover-grey-200:hover,
    &--hover-grey-200.is-open {
      background: $grey-200;
    }

    &--hover-primary-light-20:hover,
    &--hover-primary-light-20.is-open {
      background: $primary-light-20;
    }
  }

  &__emoji-select-theme {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: $light;
    border: $stroke;
    border-radius: 10px;
    transition: all 0.2s ease;

    &:hover {
      border: 1px solid $grey-300;
    }

    &.is-open {
      border: 1px solid $primary;
      box-shadow: 0 0 0 4px rgba(81, 31, 220, 0.2);
    }
  }
}
</style>
