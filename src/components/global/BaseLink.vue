<template>
  <component
    :is="tag"
    class="base-link base-typography--button"
    :class="{
      'base-link--bold': bold
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
  },
};
</script>

<style lang="scss" scoped>
.base-link {
  font-size: 16px;
  font-weight: normal;
  color: $primary;

  &--bold {
    font-weight: bold;
  }
}
</style>
