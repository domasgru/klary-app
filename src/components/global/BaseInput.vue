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
      :for="`input${_uid}`"
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
        :id="`input${_uid}`"
        ref="input"
        type="text"
        class="base-input__input base-typography--b-16-24"
        spellcheck="false"
        :value="value"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :autocomplete="autocomplete ? null : 'off'"
        v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value)
        }"
        @keydown.enter="handleSubmitKeyDown"
        @keydown.esc="blur"
      >
      <!-- MULTI INPUT -->
      <div
        ref="multiInputMeasurer"
        class="base-input__multi-input-measurer base-typography--b-16-24"
        v-text="value"
      />
      <div
        v-if="type=== 'multi'"
        :id="`multiInput-${_uid}`"
        class="base-input__multi base-input__input base-typography--b-16-24"
        @mousedown="handleMultiInputMousedown"
      >
        <div
          v-for="selectedValue in selectedValues"
          :key="selectedValue.uid"
          class="base-input__multi-selected-item"
        >
          <BaseInitial
            class="base-input__initial"
            size="xs"
            :name="selectedValue.name"
          />
          {{ selectedValue.name }}
          <BaseSvg
            class="base-input__multi-x"
            name="x"
            @click.native="$emit('remove', selectedValue.uid)"
          />
        </div>
        <input
          :id="`input${_uid}`"
          ref="input"
          class="base-input__multi-input base-typography--b-16-24"
          spellcheck="false"
          type="text"
          :value="value"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :autocomplete="autocomplete ? null : 'off'"
          :style="{width: `${multiInputWidth}px`}"
          v-on="{
            ...$listeners,
            input: event => $emit('input', event.target.value)
          }"
          @keydown.enter="handleSubmitKeyDown"
          @keydown.esc="blur"
        >
      </div>
      <!-- TEXTAREA INPUT -->
      <textarea
        v-if="type === 'textarea'"
        :id="`input${_uid}`"
        ref="input"
        class="base-input__input base-typography--b-16-24"
        :placeholder="placeholder"
        :value="value"
        :rows="rows"
        v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value)
        }"
        @keydown.enter="handleSubmitKeyDown"
        @keydown.esc="blur"
      />
    </div>
    <span class="base-input__hint">
      {{ hint || error || success }}
    </span>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import autosize from 'autosize';

export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'input',
    },
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
    hint: {
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
      default: false,
    },
    autocomplete: {
      type: Boolean,
      default: true,
    },
    // Textarea specific
    rows: {
      type: [Number, String],
      default: 1,
    },
    // Multi specific
    selectedValues: {
      type: Array,
      default: () => ([]),
    },
  },
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
    handleMultiInputMousedown(e) {
      const { input } = this.$refs;
      const clickingAroundInput = e.target.closest(`#multiInput-${this._uid}`);
      const clickingInput = e.target.closest(`#input${this._uid}`);
      if (clickingInput) {
        input.focus();
      } else if (clickingAroundInput) {
        e.preventDefault();
        input.focus();
        input.selectionStart = this.value.length;
      }
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
    cursor: text;
    resize: none;
    background: $light;
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
  }

  &__multi {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    padding-bottom: 4px;
  }

  &__multi-input {
    padding: 4px 0;
    margin-bottom: 8px;
    font-family: 'Inter';
    border: none;
    outline: none;
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
    width: 24px;
    height: 24px;
    margin-left: 8px;
    cursor: pointer;
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
    margin-bottom: 8px;
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
