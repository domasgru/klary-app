<template>
  <div
    class="base-input"
    :class="{
      'base-input--error': error,
      'base-input--success': success,
      'base-input--disabled': isDisabled,
      'base-input--liftUpAnimation': animateLiftUp,
    }"
    @animationend="animateLiftUp = false"
  >
    <label
      v-if="label"
      :for="`input${$.uid}`"
      class="base-input__label base-typography--caption"
    >
      {{ label }}
    </label>
    <div :class="{'base-input--hasScaleInteractionOnFocus': hasScaleInteractionOnFocus}">
      <div
        class="base-input__input-wrapper"
        :style="styleVariables"
        :class="{'base-input__input-wrapper--pulse': inputPulseAnimation}"
        @animationend="inputPulseAnimation = false"
      >
        <slot />
      </div>
    </div>
    <span
      v-if="showHintArea"
      class="base-input__hint caption"
    >
      {{ hint || error || success }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: undefined,
    },
    error: {
      type: String,
      default: undefined,
    },
    success: {
      type: String,
      default: undefined,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hasScaleInteractionOnFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animateLiftUp: false,
      inputPulseAnimation: false,
    };
  },
  computed: {
    showHintArea() {
      return this.hint || this.error || this.success;
    },
    styleVariables() {
      let outlineColor = 'rgba(81, 31, 220, 0.2)';
      let outlineColorEnd = 'rgba(81, 31, 220, 0)';
      if (this.error) {
        outlineColor = 'rgba(217, 47, 43, 0.2)';
        outlineColorEnd = 'rgba(217, 47, 43, 0)';
      }
      return {
        '--outlineColor': outlineColor,
        '--outlineColorEnd': outlineColorEnd,
      };
    },
  },
  watch: {
    error(newValue) {
      if (!newValue) {
        return;
      }
      this.handleSubmitKeyDown();
    },
  },
  methods: {
    handleSubmitKeyDown() {
      if (!this.error) {
        return;
      }

      if (this.animateLiftUp) {
        this.animateLiftUp = false;
      }

      if (this.inputPulseAnimation) {
        this.inputPulseAnimation = false;
      }

      this.animateLiftUp = true;
      this.inputPulseAnimation = true;
    },
    // Are called from child input component
    blur() {

    },
    focus() {

    },
  },
};
</script>

<style lang="scss" scoped>
.base-input {
  $this: &;

  width: 100%;
  transition: all 0.2s ease;
  transform-origin: center center;

  &--hasScaleInteractionOnFocus {
    transition: all 0.2s ease;

    &:focus-within {
      transform: scale(1.01);
    }
  }

  &__label {
    display: block;
    padding-bottom: 8px;
  }

  &__hint {
    display: block;
    height: 20px;
    margin-top: 8px;
    font-size: 14px;
    color: $grey-500;

    #{$this}--success & {
      color: $success;
    }

    #{$this}--error & {
      color: $error;
    }
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    overflow: hidden;
    background: $light;
    border: 1px solid $grey-200;
    border-radius: 10px;
    box-shadow: 0 0 0 0 var(--outlineColor);
    transition: all 0.15s ease;

    &:hover {
      border: 1px solid $grey-300;
    }

    &:focus,
    &:focus-within {
      border: 1px solid $primary;
      box-shadow: 0 0 0 4px var(--outlineColor);
    }

    &--pulse {
      animation: pulse 0.4s ease;
    }

    #{$this}--error & {
      background: $error-light;
      border: 1px solid $error;
    }

    #{$this}--success & {
      background: $success-light;
      border: 1px solid $success;
    }

    #{$this}--disabled & {
      color: $grey-600;
      background: $grey-50;
    }
  }
}

@keyframes liftUp {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 12px var(--outlineColorEnd);
  }
}
</style>
