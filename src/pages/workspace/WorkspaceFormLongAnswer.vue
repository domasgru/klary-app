<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <BaseTextarea
      rows="4"
      padding="12px 16px"
      :is-disabled="isDisabled"
      :error="error"
      placeholder="Long answer"
      :model-value="value"
      @input="$emit('form-input', $event.target.value)"
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
};
</script>

<style lang="scss" scoped>

</style>
