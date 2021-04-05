<template>
  <component
    :is="tag"
    :to="to"
    class="button"
    :class="{
      ...computedClasses,
      'b1s': size === 'lg',
      'b2s': size === 'md',
    }"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script>
const VALID_BUTTON_TYPES = ['sm', 'md', 'lg', 'xlg', 'icon'];

export default {
  props: {
    type: {
      type: String,
      default: 'primary',
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
    isPlain: {
      type: Boolean,
      default: false,
    },
    isInline: {
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
      type, disabled, fluid, inverse, size, isPlain, isInline,
    }) => (
      {
        [`button--${type}`]: type,
        'button--disabled': disabled,
        'button--fluid': fluid,
        'button--inverse': inverse,
        [`button--${size}`]: size,
        'button--plain': isPlain,
        'button--inline': isInline,
      }
    ),
  },
};
</script>

<style lang="scss" scoped>
.button {
  $this: &;

  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: none;
  border-radius: 10px;
  outline: none;
  transition: background-color 0.2s;

  &:hover {
    cursor: pointer;
  }

  &--primary {
    color: white;
    background: $primary;

    &:hover {
      background: $primary-200;
    }

    &:active {
      background: $primary-300;
    }

    &#{$this}--disabled {
      cursor: not-allowed;
      background: $primary-disabled;
    }
  }

  &--secondary {
    color: $dark;
    background: $light;
    border: 1px solid $grey-200;

    &:hover {
      background: $grey-100;
    }

    &:active {
      background: $grey-150;
    }

    &#{$this}--disabled {
      color: $grey-500;
      cursor: not-allowed;
    }
  }

  &--error {
    color: $light;
    background: $error;

    &:hover {
      background: $error-200;
    }

    &:active {
      background: $error-300;
    }

    &#{$this}--disabled {
      cursor: not-allowed;
      background: $error-disabled;
    }
  }

  &--md {
    padding: 10px 20px;

    &#{$this}--secondary {
      padding: 9px 20px;
    }

    &#{$this}--singleIcon {
      padding: 8px;
    }
  }

  &--lg {
    padding: 12px 20px;

    &#{$this}--secondary {
      padding: 11px 20px;
    }
  }

  &--icon {
    padding: 7px;
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

  &--plain {
    color: $dark;
    background: transparent;

    &:hover {
      color: $dark;
      background: transparent;
    }
  }

  &--inline {
    display: inline;
    padding: 0;
    font-weight: normal;
    color: $primary-100;
    background: transparent;

    &:hover {
      color: $primary-100;
      background: transparent;
    }
  }
}
</style>
