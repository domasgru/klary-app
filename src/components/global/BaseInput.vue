<template>
  <BaseInputBase
    ref="inputBaseRef"
    v-bind="$props"
  >
    <input
      :id="`input${$.uid}`"
      ref="input"
      type="text"
      class="input"
      :class="{
        'input--lg': size === 'lg',
        'input--md': size === 'md',
      }"
      spellcheck="false"
      :value="modelValue"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :autocomplete="autocomplete ? null : 'off'"
      :disabled="isDisabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter="handleSubmitKeyDown"
      @keydown.esc="$refs.input.blur()"
      @blur="$refs.inputBaseRef.blur()"
      @focus="$refs.inputBaseRef.focus()"
    >
  </BaseInputBase>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['focus', 'update:modelValue'],
  mounted() {
    if (this.autofocus) {
      this.$refs.input.focus();
    }
  },
};
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  width: 100%;
  font-family: 'Inter', sans-serif;
  cursor: text;
  resize: none;
  background: transparent;
  outline: none;

  &--lg {
    padding: 12px 16px;
    font-size: 16px;
    line-height: 24px;
  }

  &--md {
    padding: 10px 12px;
    font-size: 14px;
    line-height: 20px;
  }

  &::placeholder {
    color: $grey-500;
  }
}
</style>
