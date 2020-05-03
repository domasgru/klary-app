<template>
  <input
    type="text"
    :value="value"
    class="input"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  padding: 12px;
  font-size: 20px;
  border: none;
}
</style>
