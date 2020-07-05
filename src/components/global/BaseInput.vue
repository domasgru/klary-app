<template>
  <div
    class="base-input"
    :class="{
      'base-input--error': error,
      'base-input--success': success,
      'base-input--liftUpAnimation': animateLiftUp
    }"
    @animationend="animateLiftUp = false"
  >
    <label
      v-if="label"
      :for="_uid"
      class="base-input__label base-typography--caption"
    >
      {{ label }}
    </label>
    <div
      :style="styleVariables"
      class="base-input__input-wrapper"
      :class="{'base-input__input-wrapper--pulse': inputPulseAnimation}"
      @animationend="inputPulseAnimation = false"
    >
      <input
        :id="_uid"
        ref="input"
        type="text"
        :value="value"
        :placeholder="placeholder"
        class="base-input__input base-typography--b2"
        :autofocus="autofocus"
        v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value)
        }"
        @keydown.enter="handleSubmitKeyDown"
      >
    </div>
    <span class="base-input__hint">
      {{ error || success }}
    </span>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    success: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      animateLiftUp: false,
      inputPulseAnimation: false,
    };
  },
  computed: {
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
  mounted() {
    this.$refs.input.focus();
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
  },
};
</script>

<style lang="scss" scoped>
.base-input {
  $this: &;

  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: start;

  &--liftUpAnimation {
    animation: liftUp 0.2s;
  }

  &__input {
    position: relative;
    width: 100%;
    padding: 16px;
    font-family: 'Inter', sans-serif;
    color: $dark;
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
      box-shadow: 0 0 0 4px var(--outlineColor);
    }

    #{$this}--error & {
      background: $error-light;
      border: 1px solid $error;
    }

    #{$this}--success & {
      background: $success-light;
      border: 1px solid $success;
    }
  }

  &__input-wrapper {
    position: relative;
    border: 1px solid transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 0 var(--outlineColor);

    &--pulse {
      animation: pulse 0.4s ease;
    }

    // &:focus-within:not(&--pulse) {
    //   animation: pulse 0.4s 0.1s ease;
    // }
  }

  &__label {
    display: block;
    margin-bottom: 8px;
  }

  &__hint {
    height: 14px;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 500;

    #{$this}--success & {
      color: $success;
    }

    #{$this}--error & {
      color: $error;
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
