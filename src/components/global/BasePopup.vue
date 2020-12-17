<template>
  <div class="base-popup">
    <slot />
    <BaseBackgroundWrapper
      v-if="isOpen"
      class="base-popup__content"
      :class="{
        'base-popup__content--medium-left': position === $options.MEDIUM_LEFT,
        'base-popup__content--bottom-right': position === $options.BOTTOM_RIGHT,
        'base-popup__content--bottom-left': position === $options.BOTTOM_LEFT,
      }"
      :style="popupStyles"
    >
      <slot name="content" />
    </BaseBackgroundWrapper>
  </div>
</template>

<script>
const MEDIUM_LEFT = 'medium-left';
const BOTTOM_RIGHT = 'bottom-right';
const BOTTOM_LEFT = 'bottom-left';
const VALID_POSITIONS = [MEDIUM_LEFT, BOTTOM_RIGHT, BOTTOM_LEFT];

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String,
      default: 'bottom-left',
      validator: (value) => VALID_POSITIONS.includes(value),
    },
    width: {
      type: String,
      default: 'auto',
    },
  },
  computed: {
    popupStyles() {
      return {
        width: this.width,
      };
    },
  },
  MEDIUM_LEFT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
};
</script>

<style lang="scss" scoped>
.base-popup {
  position: relative;
  display: flex;

  &__trigger {
    cursor: pointer;
  }

  &__content {
    position: absolute;
    z-index: 100;
    z-index: 2000;
    padding: 4px;

    &--bottom-left {
      right: 0;
      bottom: -4px;
      transform: translateY(100%);
    }

    &--bottom-right {
      bottom: -4px;
      left: 0;
      transform: translateY(100%);
    }

    &--medium-left {
      top: 0;
      left: -4px;
      transform: translateX(-100%);
    }
  }
}
</style>
