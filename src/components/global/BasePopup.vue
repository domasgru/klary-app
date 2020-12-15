<template>
  <div class="base-popup">
    <slot />
    <BaseBackgroundWrapper
      v-if="isOpen"
      class="base-popup__content"
      :style="popupStyles"
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
    side: {
      type: String,
      default: 'right',
    },
    marginTop: {
      type: String,
      default: '0',
    },
    marginLeft: {
      type: String,
      default: '0',
    },
    width: {
      type: String,
      default: 'auto',
    },
  },
  computed: {
    popupStyles() {
      return {
        right: this.side === 'right' ? '0' : 'auto',
        left: this.side === 'left' ? `${-parseInt(this.marginLeft, 10)}px` : 'auto',
        bottom: `${-parseInt(this.marginTop, 10)}px`,
        width: this.width,
      };
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
    z-index: 2000;
    padding: 4px;
    transform: translateY(100%);
  }
}
</style>
