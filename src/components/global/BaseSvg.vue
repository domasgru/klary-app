<template>
  <svg class="base-svg">
    <use :xlink:href="`#${name}`" />
  </svg>
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
  },
};
</script>

<style lang="scss" scoped>
.base-svg {
  display: block;
}
</style>
