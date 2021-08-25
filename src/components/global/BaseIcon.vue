<template>
  <BaseSvg
    class="base-icon"
    :name="name"
    :size="size"
    :class="{
      'base-icon--sm': size === 'sm',
      'base-icon--md': size === 'md',
      [`base-icon--${color}`]: color,
    }"
  />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
    color: {
      type: String,
      default: 'dark',
    },
  },
};
</script>

<style lang="scss" scoped>
.base-icon {
  padding: 2px;
  fill: none;

  &--sm {
    width: 20px;
    height: 20px;
  }

  &--md {
    width: 24px;
    height: 24px;
  }

  &--dark {
    stroke: $dark;
  }

  &--light {
    stroke: $light;
  }

  &--primary {
    stroke: $primary;
  }

  &--grey-600 {
    stroke: $grey-500;
  }

  &--error {
    stroke: $error;
  }
}
</style>
