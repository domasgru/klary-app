<template>
  <div class="base-textarea">
    <label
      :for="_uid"
      class="base-textarea__label base-typography--caption"
    >{{ label }}</label>
    <textarea
      :id="_uid"
      class="base-textarea__textarea base-typography--b2"
      :placeholder="placeholder"
      :value="value"
      v-on="{
        ...$listeners,
        input: event => $emit('input', event.target.value)
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.base-textarea {
  text-align: start;

  &__label {
    display: block;
    margin-bottom: 8px;
  }

  &__textarea {
    width: 100%;
    height: 176px;
    padding: 16px;
    font-family: 'Inter';
    background: $grey-50;
    border: 1px solid $grey-200;
    border-radius: 10px;
    outline: none;
    transition: box-shadow 0.15s ease;

    &::placeholder {
      color: $grey-500;
    }

    &:hover {
      border: 1px solid $grey-300;
    }

    &:focus {
      border: 1px solid $primary;
      box-shadow: 0 0 0 4px rgba(81, 31, 220, 0.2);
    }
  }
}
</style>
