<template>
  <component
    :is="tag"
    class="base-link"
    :class="{
      [`base-link--theme-${theme}`]: theme,
      'base-link--bold': bold,
    }"
    :to="to"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    tag: {
      type: String,
      default: 'router-link',
    },
    to: {
      type: String,
      required: true,
    },
    bold: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-link {
  font-weight: normal;

  &--bold {
    font-weight: bold;
  }

  &--theme-default {
    font-size: 16px;
    color: $primary;
  }

  &--theme-navigation {
    font-size: 14px;
    font-weight: normal;
    color: $dark;

    &.router-link-exact-active {
      color: $primary;
    }
  }
}
</style>
