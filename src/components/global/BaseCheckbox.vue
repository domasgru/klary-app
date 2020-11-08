<template>
  <div class="base-checkbox">
    <input
      :id="$.uid"
      class="base-checkbox__input"
      type="checkbox"
    >
    <label
      :for="$.uid"
      class="base-checkbox__title base-typography--body2"
    >
      {{ title }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  created() {
    debugger;
  },
};
</script>

<style lang="scss" scoped>
.base-checkbox {
  display: flex;
  align-items: center;

  &__input {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    background: $grey-100;
    border: 1px solid $grey-200;
  }
}
</style>
