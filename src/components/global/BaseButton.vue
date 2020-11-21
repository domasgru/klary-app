<template>
  <component
    :is="tag"
    :to="to"
    class="button"
    :class="{
      ...computedClasses,
      'base-typography--bold-button1': ['xlg', 'lg'].includes(size),
      'base-typography--bold-button2': ['sm', 'md'].includes(size)
    }"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script>
const VALID_BUTTON_TYPES = ['sm', 'md', 'lg', 'xlg'];

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => VALID_BUTTON_TYPES.includes(value),
    },
    to: {
      type: String,
      default: null,
    },
  },
  computed: {
    tag: ({ to }) => (to ? 'router-link' : 'button'),
    computedClasses: ({
      disabled, fluid, inverse, size,
    }) => (
      {
        'button--disabled': disabled,
        'button--fluid': fluid,
        'button--inverse': inverse,
        [`button--${size}`]: size,
      }
    ),
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: block;
  color: white;
  text-align: center;
  background: $primary;
  border: none;
  border-radius: 10px;
  outline: none;
  transition: background-color 0.2s;

  &:hover {
    cursor: pointer;
    background: $primary-400;
  }

  &--sm {
    padding: 6px 16px;
  }

  &--md {
    padding: 10px 20px;
  }

  &--lg {
    padding: 12px 20px;
  }

  &--xlg {
    padding: 16px 24px;
  }

  &--disabled {
    //pointer-events: none;
    cursor: not-allowed;
    background: $primary-disabled;
  }

  &--fluid {
    width: 100%;
  }

  &--inverse {
    color: $primary;
    background: $light;

    &:hover {
      background: $light;
    }
  }
}
</style>
