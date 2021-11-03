<template>
  <BasePopup
    class="emoji-picker"
    :class="{
      [`emoji-picker--${size}`]: size
    }"
    :is-open="isOpen"
    :position="'bottom-start'"
    :offset="[0, 6]"
    @close="$emit('close')"
    @click.stop.prevent
  >
    <div
      class="emoji-picker__wrapper"
      :class="{
        [`emoji-picker__wrapper--hover-${hoverBackgroundColor}`]: hoverBackgroundColor,
        'emoji-picker__emoji-select-theme': emojiSelectTheme,
        'is-open': isOpen
      }"
      @click="$emit('toggle')"
    >
      <div
        v-if="emoji"
        class="emoji-picker__emoji"
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
    isOpen: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'sm',
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'dark',
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
  },
  emits: ['close', 'toggle', 'update-emoji'],
  watch: {
    async isOpen(newValue) {
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
.emoji-picker {
  $this: &;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 4px;

    #{$this}--md & {
      width: 56px;
      height: 56px;
      border-radius: 10px;
    }

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

  &__emoji {
    font-size: 28px;
    transform: scale(0.5);

    #{$this}--md & {
      font-size: 80px;
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
