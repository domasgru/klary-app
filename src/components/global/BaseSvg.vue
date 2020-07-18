<template>
  <svg class="base-svg">
    <use :xlink:href="`#${this.name}`" />
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  created() {
    // import(`@/assets/icons/${this.name}.svg`);
  },
};
</script>

<style lang="scss" scoped>
.base-svg {
  display: block;
}
</style>
