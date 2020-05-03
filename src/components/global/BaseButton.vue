<template>
  <button
    class="button"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  padding: 15px 32px;
  color: white;
  background: #5867e6;
  border: none;
  border-radius: 5px;
}
</style>
