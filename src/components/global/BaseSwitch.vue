<template>
  <div class="base-switch">
    <div class="base-switch__wrapper">
      <input
        :id="inputId"
        type="checkbox"
        class="base-switch__input"
        :checked="value"
        @change="$emit('change', $event)"
      >
      <label
        :for="inputId"
        class="base-switch__label"
      />
    </div>
    <label
      v-if="label"
      :for="inputId"
      class="base-switch__text-label b2"
      v-text="label"
    />
  </div>
</template>

<script>
import { nanoid } from 'nanoid';

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
  },
  emits: ['change'],
  computed: {
    inputId() {
      return nanoid(4);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-switch {
  display: flex;
  align-items: center;

  &__label {
    width: 40px;
    height: 24px;
    background: $grey-200;
    border-radius: 20px;
    display: block;
    position: relative;
    transition: all 0.2s ease;
    cursor: pointer;

    &::after {
      content: '';
      width: 16px;
      height: 16px;
      background: $light;
      position: absolute;
      top: 4px;
      left: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
  }

  &__text-label {
    margin-left: 8px;
    cursor: pointer;
  }

  &__input {
    opacity: 0;
    position: absolute;

    &:checked + .base-switch__label {
      background: $primary;
    }

    &:checked + .base-switch__label::after {
      transform: translateX(16px);
    }
  }
}
</style>
