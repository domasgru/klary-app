<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <BaseTextarea
      rows="1"
      padding="12px 16px"
      :is-preview="viewMode === 'view'"
      :error="error"
      :placeholder="placeholder"
      :model-value="value"
      @input="$emit('form-input', {value: $event.target.value})"
    />
  </WorksapceFormQuestionBase>
</template>

<script>
import WorksapceFormQuestionBase from './WorkspaceFormQuestionBase.vue';

export default {
  components: {
    WorksapceFormQuestionBase,
  },
  props: {
    viewMode: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete', 'form-input'],
  computed: {
    isEditMode: ({ viewMode }) => viewMode === 'edit',
    placeholder: ({ isEditMode }) => (isEditMode ? 'Short answer' : 'Your answer'),
  },
};
</script>
