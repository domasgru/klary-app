<template>
  <div
    v-click-outside="hide"
    class="base-popup"
  >
    <button
      class="base-popup__trigger"
      @click="isOpen = !isOpen"
    >
      <slot />
    </button>
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
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    hide(e) {
      this.isOpen = false;
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
    transform: translateY(100%);
  }
}
</style>
