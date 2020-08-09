<template>
  <div class="base-popup">
    <div class="base-popup__trigger">
      <slot />
    </div>
    <BaseBackgroundWraper class="base-popup__content">
      <slot name="content" />
    </BaseBackgroundWraper>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-popup {
  &__content {
    padding: 12px 0;
  }
}
</style>
