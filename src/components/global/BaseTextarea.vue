<template>
  <div class="base-textarea">
    <label
      v-if="label"
      :for="id"
      class="base-textarea__label base-typography--caption"
    >{{ label }}</label>
    <textarea
      :id="id"
      ref="textarea"
      class="base-textarea__textarea base-typography--b-16-24"
      :class="{'base-textarea__textarea--enlarged': textareaEnlarged}"
      :placeholder="placeholder"
      :value="modelValue"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span
      v-if="!noHint"
      class="base-textarea__hint"
    >
      {{ hint || error || success }}
    </span>
  </div>
</template>

<script>
import autosize from 'autosize';
import shortId from 'shortid';

export default {
  emits: ['update:modelValue'],
  props: {
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
    rows: {
      type: [Number, String],
      default: 1,
    },
    noHint: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      textareaEnlarged: false,
    };
  },
  computed: {
    id: () => shortId.generate(),
  },
  watch: {
    async modelValue(newValue) {
      if (newValue === '') {
        await this.$nextTick();
        autosize.update(this.$refs.textarea);
      }
    },
  },
  mounted() {
    autosize(this.$refs.textarea);
  },
};
</script>

<style lang="scss" scoped>
.base-textarea {
  $this: &;

  position: relative;
  display: flex;
  flex-direction: column;
  text-align: start;

  &__label {
    display: block;
    margin-bottom: 8px;
  }

  &__textarea {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 7px 12px;
    font-family: 'Inter';
    line-height: 24px;
    resize: vertical;
    resize: none;
    background: $light;
    border: 1px solid $grey-300;
    border-radius: 8px;
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
</style>
