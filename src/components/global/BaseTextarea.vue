<template>
  <BaseInputBase v-bind="$props">
    <textarea
      :id="id"
      ref="textarea"
      class="textarea base-typography--b-16-24"
      :style="textareaStyle"
      :class="{'textarea--enlarged': textareaEnlarged}"
      :placeholder="placeholder"
      :value="modelValue"
      :rows="rows"
      :autofocus="autofocus"
      :disabled="isDisabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown="handleCmdEnter"
    />
    <div
      v-if="showSubmit"
      class="submit base-typography--b-14-20"
      :style="submitPosition"
    >
      <p
        v-if="allowShortcutSubmit"
        class="b2"
      >
        Or press ⌘+Enter
      </p>
      <BaseButton
        class="submit__button"
        @click="$emit('submit')"
        v-text="submitButtonText"
      />
    </div>
  </BaseInputBase>
</template>

<script>
import autosize from 'autosize';
import shortId from 'shortid';

const SUBMIT_HEIGHT = 40;

export default {
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      default: '8px 12px',
    },
    fontSize: {
      type: String,
      default: '16px',
    },
    lineHeight: {
      type: String,
      default: '24px',
    },
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    rows: {
      type: [Number, String],
      default: 1,
    },
    hasSubmit: {
      type: Boolean,
      default: false,
    },
    submitButtonText: {
      type: String,
      default: '',
    },
    allowShortcutSubmit: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
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
    textareaStyle: ({
      padding, fontSize, lineHeight, verticalPadding, showSubmit,
    }) => ({
      padding,
      fontSize,
      lineHeight,
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
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 13 && this.allowShortcutSubmit) {
        this.$emit('submit');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.textarea {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: 'Inter';
  line-height: 24px;
  resize: none;
  outline: none;
  border: none;
  background: transparent;
  cursor: text;

  &::placeholder {
    color: $grey-500;
  }
}

.submit {
  position: absolute;
  display: flex;
  align-items: center;
  color: $grey-500;

  &__button {
    margin-left: 16px;
  }
}
</style>
