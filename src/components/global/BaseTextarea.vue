<template>
  <div class="base-textarea">
    <label
      v-if="label"
      :for="id"
      class="base-textarea__label base-typography--caption"
      v-text="label"
    />
    <textarea
      :id="id"
      ref="textarea"
      class="base-textarea__textarea base-typography--b-16-24"
      :style="textareaStyle"
      :class="{'base-textarea__textarea--enlarged': textareaEnlarged}"
      :placeholder="placeholder"
      :value="modelValue"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown="handleCmdEnter"
    />
    <div
      v-if="showSubmit"
      class="base-textarea__submit base-typography--b-14-20"
      :style="submitPosition"
    >
      Or press ⌘+Enter
      <BaseButton
        class="base-textarea__submit-button"
        @click="$emit('submit')"
        v-text="submitButtonText"
      />
    </div>
    <span
      v-if="!noHint"
      class="base-textarea__hint"
      v-text="hint || error || success"
    />
  </div>
</template>

<script>
import autosize from 'autosize';
import shortId from 'shortid';

const SUBMIT_HEIGHT = 40;

export default {
  props: {
    padding: {
      type: String,
      default: '8px 12px',
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
    hasSubmit: {
      type: Boolean,
      default: false,
    },
    submitButtonText: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      textareaEnlarged: false,
    };
  },
  computed: {
    id: () => shortId.generate(),
    verticalPadding: ({ padding }) => parseInt(padding.split(' ')[0], 10),
    horizontalPadding: ({ padding }) => parseInt(padding.split(' ')[1], 10),
    showSubmit: ({ modelValue, hasSubmit }) => modelValue && hasSubmit,
    submitPosition: ({ verticalPadding, horizontalPadding }) => ({
      bottom: `${verticalPadding}px`,
      right: `${horizontalPadding}px`,
    }),
    textareaStyle: ({ padding, verticalPadding, showSubmit }) => ({
      padding,
      ...(showSubmit ? { paddingBottom: `${16 + SUBMIT_HEIGHT + verticalPadding}px` } : { paddingBottom: `${verticalPadding}px` }),
    }),
  },
  watch: {
    async modelValue(newValue) {
      if (newValue === '') {
        await this.$nextTick();
        autosize.update(this.$refs.textarea);
      }
    },
    async showSubmit(newValue) {
      if (newValue) {
        await this.$nextTick();
        autosize.update(this.$refs.textarea);
      }
    },
  },
  mounted() {
    autosize(this.$refs.textarea);
  },
  methods: {
    handleCmdEnter(e) {
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
        this.$emit('submit');
      }
    },
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
    font-family: 'Inter';
    line-height: 24px;
    resize: vertical;
    resize: none;
    background: $light;
    border: 1px solid $grey-200;
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

  &__submit {
    position: absolute;
    display: flex;
    align-items: center;
    color: $grey-500;
  }

  &__submit-button {
    margin-left: 16px;
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
