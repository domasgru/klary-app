<template>
  <div
    class="base-input"
    :class="{
      'base-input--error': error,
      'base-input--success': success,
      'base-input--disabled': isDisabled === true,
      'base-input--liftUpAnimation': animateLiftUp
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
    <div
      class="base-input__input-wrapper"
      :style="styleVariables"
      :class="{'base-input__input-wrapper--pulse': inputPulseAnimation}"
      @animationend="inputPulseAnimation = false"
    >
      <!-- INPUT -->
      <input
        v-if="type === 'input'"
        :id="`input${$.uid}`"
        ref="input"
        type="text"
        class="base-input__input"
        :class="{
          'base-input__input--lg': size === 'lg',
          'base-input__input--md': size === 'md',
        }"
        spellcheck="false"
        :value="modelValue"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :autocomplete="autocomplete ? null : 'off'"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="handleSubmitKeyDown"
        @keydown.esc="blur"
      >
    </div>
    <span
      v-if="showHintArea"
      class="base-input__hint"
    >
      {{ hint || error || success }}
    </span>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import autosize from 'autosize';

export default {
  props: {
    type: {
      type: String,
      default: 'input',
    },
    modelValue: {
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
    autofocus: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: Boolean,
      default: true,
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
  data() {
    return {
      animateLiftUp: false,
      inputPulseAnimation: false,
      multiInputWidth: 1,
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
    showHintArea() {
      return this.hint !== undefined || this.error !== undefined || this.success !== undefined;
    },
  },
  watch: {
    error(newValue) {
      if (!newValue) {
        return;
      }
      this.handleSubmitKeyDown();
    },
    async value(newValue) {
      if (newValue === '') {
        await this.$nextTick();
        autosize.update(this.$refs.input);
      }
      await this.$nextTick();
      this.multiInputWidth = this.$refs.multiInputMeasurer.offsetWidth + 2;
    },
  },
  mounted() {
    if (this.autofocus) {
      this.focus();
    }
    autosize(this.$refs.input);
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
    blur() {
      this.$refs.input.blur();
    },
    focus() {
      this.$refs.input.focus();
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

  &--disabled {
    pointer-events: none;
  }

  &__input {
    position: relative;
    width: 100%;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    color: $dark;
    cursor: text;
    resize: none;
    background: $light;
    border: 1px solid $grey-200;
    border-radius: 10px;
    outline: none;
    transition: box-shadow 0.15s ease;

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

    &:hover {
      border: 1px solid $grey-300;
    }

    &:focus,
    &:focus-within {
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

    #{$this}--disabled & {
      color: $grey-600;
      background: $grey-50;
    }
  }
  // Single-select
  &__single-select {
    padding: 0;
  }

  &__single-select-input {
    width: 100%;
    padding: 16px;
  }

  &__single-select-selected {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    cursor: pointer;
  }

  &__single-select-initial {
    margin-right: 8px;
  }

  &__single-select-name {
    margin-right: auto;
  }

  &__single-select-no-padding {
    padding: 0;
  }
  // Multi-select
  &__multi {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    padding-bottom: 4px;
  }

  &__multi-input {
    padding: 4px 0;
    margin-bottom: 8px;
  }

  &__multi-selected-item {
    display: flex;
    align-items: center;
    padding: 4px;
    margin-right: 8px;
    margin-bottom: 8px;
    color: $dark;
    background: $grey-100;
    border-radius: 10px;
  }

  &__initial {
    margin-right: 8px;
  }

  &__multi-x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 8px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: $grey-200;
    }
  }

  &__multi-x-icon {
    width: 12px;
    height: 12px;
  }

  &__multi-input-measurer {
    position: absolute;
    white-space: pre;
    pointer-events: none;
    visibility: hidden;
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    border: 1px solid transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 0 var(--outlineColor);

    &--pulse {
      animation: pulse 0.4s ease;
    }
  }

  &__label {
    display: block;
    padding-bottom: 8px;
  }

  &__hint {
    height: 14px;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 500;
    color: $grey-500;

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
