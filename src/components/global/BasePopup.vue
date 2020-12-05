<template>
  <div class="base-popup">
    <slot />
    <BaseBackgroundWrapper
      v-if="isOpen"
      class="base-popup__content"
      :style="{top, right, bottom, left}"
    >
      <slot name="content" />
    </BaseBackgroundWrapper>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    top: {
      type: [String, Number],
      default: 'auto',
    },
    right: {
       type: [String, Number],
      default: '0',
    },
    bottom: {
       type: [String, Number],
      default: '0',
    },
    left: {
       type: [String, Number],
      default: 'auto',
    },
  },
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
    padding: 4px;
    transform: translateY(100%);
  }
}
</style>
