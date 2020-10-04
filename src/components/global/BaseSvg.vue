<template>
  <svg
    class="base-svg"
    :style="{
      ...(strokeColor ? {stroke: strokeColor} : {}),
      ...(fillColor ? {fill: fillColor} : {})
    }"
  >
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
    strokeColor: {
      type: String,
      default: '',
    },
    fillColor: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.base-svg {
  display: block;
}
</style>
