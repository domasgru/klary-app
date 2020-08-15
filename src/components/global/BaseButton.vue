<template>
  <button
    class="button base-typography--bold-button1"
    :class="computedClasses"
    :disabled="disabled"
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
  },
  computed: {
    computedClasses() {
      return {
        'button--disabled': this.disabled,
        'button--fluid': this.fluid,
        'button--inverse': this.inverse,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  padding: 16px 24px;
  color: white;
  background: $primary;
  border: none;
  border-radius: 10px;
  outline: none;
  transition: background-color 0.2s;

  &:hover {
    cursor: pointer;
    background: $primary-400;
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
